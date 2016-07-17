import React from 'react'
import { hashHistory } from 'react-router'
import update from '../../utility/update';
import qs from 'querystring';

import ListContainer from '../components/ListContainer';
import FollowLine from '../Detail/FollowLine';
import TopicInner from './TopicInner';

import styles from './index.css'
import CSSModules from 'react-css-modules';
import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

class Topic extends React.Component {
    load = () => {
        return update('/api/update_topic?_id=' + this.props.params.id);
    }
    render() {
        var { topic } = this.props;
        return (
            <ListContainer key={this.props.location.key} loadMore={this.load} hasMore={!topic} >
                <FollowLine />
                { topic && <TopicInner topic={topic} /> }
            </ListContainer>
        )
    }
}

var mapStateToProps = (state, props) => {
    return {
        topic: state.topics[props.params.id]
    }
}

export default module.exports = connect(mapStateToProps)(
    Topic
);
