import React from 'react';
import { findDOMNode }from 'react-dom';

import Loader from './Loader';

function topPosition(domElt) {
    if (!domElt) {
        return 0;
    }
    return domElt.offsetTop + topPosition(domElt.offsetParent);
}

export default class ListContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: false, err: null };
    }
    render() {
        return (
            <div>
                { this.props.children }
                { this.state.loading && <Loader /> }
            </div>
        );
    }
    loadMore = () => {
        this.setState({loading: true, err: null});
        this.props.loadMore()
            .then(()=>{
                this.setState({loading: false, err: null});
            })
            .catch((err)=>{
                this.setState({loading: false, err});
            });
    }
    scrollListener = () => {
        if (!this.state.loading && !this.state.err && this.props.hasMore) {
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
