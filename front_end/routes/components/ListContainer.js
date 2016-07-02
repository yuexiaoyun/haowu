import React from 'react';
import { findDOMNode }from 'react-dom';

import Loader from './Loader';

import { createAction } from 'redux-actions';
import { connect } from 'react-redux';

function topPosition(domElt) {
    if (!domElt) {
        return 0;
    }
    return domElt.offsetTop + topPosition(domElt.offsetParent);
}

class ListContainer extends React.Component {
    render() {
        return (
            <div>
                { this.props.children }
                { this.props.pending && <Loader err={this.props.pending.err} onClick={this.loadMore}/> }
            </div>
        );
    }
    loadMore = () => {
        var { id, dispatch } = this.props;
        dispatch(createAction('LOADING_START')({id}));
        this.props.loadMore()
            .then(()=>{
                dispatch(createAction('LOADING_SUCCESS')({id}));
            })
            .catch((err)=>{
                console.log(err);
                dispatch(createAction('LOADING_FAILED')({id}));
            });
    }
    scrollListener = () => {
        if (!this.props.pending && this.props.hasMore) {
            var el = findDOMNode(this);
            var scrollEl = window;
            var scrollTop = (scrollEl.pageYOffset !== undefined)
                ? scrollEl.pageYOffset
                : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            var offset = topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight;
            var threshold = this.props.threshold || 250;
            if (offset < threshold)
                this.loadMore();
        }
    }
    componentDidMount() {
        window.addEventListener('scroll', this.scrollListener);
        window.addEventListener('resize', this.scrollListener);
        this.scrollListener();
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollListener);
        window.removeEventListener('resize', this.scrollListener);
    }
}

var mapStateToProps = (state, props) => ({ pending: state.pendings[props.id] })
export default connect(mapStateToProps)(
    ListContainer
);
