import React from 'react';
import fconf from '../../fconf';
import moment from 'moment'
import _ from 'underscore';
import { hashHistory } from 'react-router';

import { connect } from 'react-redux'
import { createSelector, createStructuredSelector } from 'reselect';
import styles from './TopicCard.css'
import CSSModules from 'react-css-modules'

class TopicCard extends React.Component {
    constructor() {
        super();
    }
    render() {
        var { topic, post_list, total_length, read_count } = this.props;
        var total = moment(total_length + 500).format('mm:ss');
        return (
            <div styleName='root' onClick={()=>hashHistory.push('/topic/' + topic._id)}>
                <img styleName='avatar' src={fconf.qiniu.site + post_list[0].pic_id + '-b80'} />
                <div styleName='play' />
                <div styleName='edit' />
                <div styleName='content'>
                    <div styleName='title'>{topic.title}</div>
                    <div styleName='numbers'>
                        <div styleName='total-length'>{ total }</div>
                        <div styleName='post-count'>{ post_list.length }</div>
                        <div styleName='read-count'>{ read_count }</div>
                    </div>
                </div>
            </div>
        )
    }
}

var get_post_list = (state, props) => props.topic.posts.map(id=>state.posts[id]);
var get_total_length = createSelector(
    [get_post_list],
    (post_list) => _.reduce(post_list, (mem, post)=>{
        return (parseInt(post.length) || 0) + mem;
    }, 0)
);
var get_audios = state => state.audios;
var get_read_count = createSelector(
    [get_post_list, get_audios],
    (post_list, audios) => {
        return _.chain(post_list)
            .map(post=>post.audio_id)
            .map(audio_id=>audios[audio_id])
            .compact()
            .map(audio=>audio.read_count)
            .reduce((m, count) => (m + count), 0)
            .value();
    }
);
var mapStateToProps = createStructuredSelector({
    post_list: get_post_list,
    total_length: get_total_length,
    read_count: get_read_count
});

export default connect(mapStateToProps)(
    CSSModules(TopicCard, styles)
);