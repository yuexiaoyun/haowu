import React from 'react'
import { hashHistory } from 'react-router'
import update from '../../utility/update';
import fconf from '../../fconf';

import qs from 'querystring';
import setShareInfo from '../../utility/set_share_info';

import TopicInner from './TopicInner';

import styles from './index.css'
import CSSModules from 'react-css-modules';
import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

class Topic extends React.Component {
    componentDidMount() {
        this.setTitle();
        update('/api/update_topic?_id=' + this.props.params.id);
    }
    componentDidUpdate() {
        this.setTitle();
    }
    setTitle = ()=>{
        window.setTitle('专辑');
        var { title } = this.props;
        if (title) {
            setShareInfo({
                title: `${title} - 物记专辑`,
                link: fconf.site + '/app/topic/' + this.props.params.id
            });
        }
    }
    render() {
        var { post_ids, location } = this.props;
        if (post_ids && post_ids.length > 0)
            return <TopicInner {...this.props} action={location.action}/>;
        else
            return <div />;
    }
}

var mapStateToProps = (state, props) => {
    var topic = state.topics[props.params.id];
    if (topic) {
        return {
            post_ids: topic.posts,
            title: topic.title
        }
    } else {
        return {
        }
    }
}

export default module.exports = connect(mapStateToProps)(
    Topic
);
