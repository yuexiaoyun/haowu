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
    constructor() {
        super();
        this.state = { index : 0 };
    }
    widthNDpr = () => {
        return qs.stringify({
            dpr: window.devicePixelRatio,
            width: window.innerWidth
        })
    }
    componentDidMount() {
        window.setTitle('专辑');
        setShareInfo({
            title: '测试专辑',
            link: fconf.site + '/app/topic/1'
        });
        update('/api/update_feeds?min=10&' + this.widthNDpr());
    }
    render() {
        var { post_ids } = this.props;
        if (post_ids && post_ids.length > 0)
            return <TopicInner {...this.props} index={this.state.index} select={i=>this.setState({index: i})}/>;
        else
            return <div />;
    }
}

export default module.exports = connect(state => ({
    post_ids: state.feed_ids,
}))(Topic);
