import React from 'react';
import { findDOMNode } from 'react-dom';
import { hashHistory } from 'react-router';
import update from '../../utility/update';
import setShareInfo from '../../utility/set_share_info';
import fconf from '../../fconf';
import qs from 'querystring';

import EmptyView from '../common/EmptyView';
import FeedList from '../components/FeedList';
import Loader from '../components/Loader';

import { createAction } from 'redux-actions';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import styles from './index.css'
import CSSModules from 'react-css-modules'
import { takePhoto } from '../../ducks/local_pic_id'
import {
    topicEditorAdd,
    topicEditorRemove,
    topicEditorSetTitle,
    topicEditorSelect,
    setTopicEditor
} from '../../ducks/topic_editor'

class PostCardChild extends React.Component {
    onClick = (e) => {
        e.stopPropagation();
        var { i, post, active, dispatch } = this.props;
        if (i >= 0) {
            if (active)
                dispatch(topicEditorSelect(-1));
            dispatch(topicEditorRemove(post._id));
        } else {
            dispatch(topicEditorAdd(post._id));
        }
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.active && this.props.active)
            findDOMNode(this).scrollIntoViewIfNeeded();
    }
    render() {
        var { i, active } = this.props;
        var styleName = (i >= 0) ? 'post-card-child-selected' : 'post-card-child';
         if (active) {
            return (
                <div styleName='post-card-child-current'>
                    <div styleName='post-card-child-container' onClick={this.onClick}>
                        <div styleName={styleName} >
                        { i >= 0 && (i+1) }
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div styleName='post-card-child-container' onClick={this.onClick}>
                    <div styleName={styleName} >
                    { i >= 0 && (i+1) }
                    </div>
                </div>
            )
        }
    }
};
PostCardChild = CSSModules(PostCardChild, styles);
PostCardChild = connect((state, props) => {
    var { post_ids, index } = state.topic_editor;
    var i = post_ids.indexOf(props.post._id);
    var active = (i >= 0 && index == i);
    return {
        i,
        active
    }
})(PostCardChild);

class PostSmallCard extends React.Component {
    componentDidMount() {
        findDOMNode(this).scrollIntoViewIfNeeded();
    }
    onClick = () => {
        var { post, active, i, dispatch } = this.props;
        if (active) {
            dispatch(topicEditorSelect(-1));
        } else {
            dispatch(topicEditorSelect(i));
        }
    }
    render() {
        var { post, active } = this.props;
        return (
            <span styleName='icon-container' onClick={this.onClick}>
                <img
                    styleName={ active ? 'icon-active' : 'icon' }
                    src={fconf.qiniu.site + post.pic_id + '-b80'}/>
            </span>
        );
    }
}
PostSmallCard = connect()(
    CSSModules(PostSmallCard, styles)
);

class EditTopic extends React.Component {
    constructor() {
        super();
        this.state = { focus: 0 };
    }
    componentDidMount() {
        var { location, params, dispatch, topic } = this.props;
        if (location.action == 'PUSH') {
            dispatch(setTopicEditor(topic));
        }
        var title = params.id ? '编辑专辑' : '新建专辑';
        window.setTitle(title);
        setShareInfo();
        this.load();
    }
    load = () => {
        var id = window.user_id;
        var url = '/api/update_user_detail?_id=' + id;
        this.setState({err: null});
        update(url).catch((err) => this.setState({err}));
    }
    send = () => {
        var { topic_post_list, topic_editor, params, location } = this.props;
        if (topic_post_list.length > 1 && topic_editor.title.length > 0) {
            if (params.id) {
                var url = '/api/edit_topic?' + qs.stringify({
                    post_ids: topic_editor.post_ids.join(','),
                    title: topic_editor.title,
                    _id: params.id
                });
            } else {
                var url = '/api/pub_topic?' + qs.stringify({
                    post_ids: topic_editor.post_ids.join(','),
                    title: topic_editor.title
                });
            }
            update(url);
            if (location.query.from != 'me') {
                hashHistory.replace(`/detail/${window.user_id}?tab=1`);
            } else {
                hashHistory.go(-1);
            }
        }
    }
    renderTopItem = () => {
        var { dispatch } = this.props;
        return (
            <div className={styles['pub-post-container']} onClick={()=>dispatch(takePhoto(true))}>
                <div className={styles['pub-post']}>添加好物</div>
            </div>
        );
    }
    getTopItemHeight = () => {
        return 50;
    }
    render() {
        var { topic_post_list, post_list, topic_editor, dispatch } = this.props;
        var { err, focus } = this.state;
        const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
        const isIPhone = userAgent.match(/iPhone/i);
        var iPhone_focus = focus && isIPhone;
        if (post_list) {
            return (
                <div styleName='root' style={{minHeight: window.innerHeight}}>
                    <div styleName={iPhone_focus ? 'icon-list-container' : 'icon-list-container-fixed'}>
                        <div styleName='input-line' >
                            <input
                                styleName='input-ctrl'
                                placeholder='为专辑取个好听的标题~'
                                value={topic_editor.title}
                                onFocus={()=>this.setState({focus: 1})}
                                onBlur={()=>this.setState({focus: 0})}
                                onChange={e=>dispatch(topicEditorSetTitle(e.target.value))}/>
                        </div>
                        <div
                            styleName={topic_post_list.length > 1 && topic_editor.title.length > 0
                                ? 'send' : 'send-disabled'}
                            onClick={this.send}>
                        完成
                        {topic_post_list.length > 0 && `(${topic_post_list.length})`}
                        </div>
                        <div styleName='icon-list'>
                            { topic_post_list.map((post, i)=>(
                                <PostSmallCard
                                    post={post}
                                    i={i}
                                    active={topic_editor.index == i}
                                    key={post._id} />
                            )) }
                        </div>
                    </div>
                    { !iPhone_focus && <div styleName='content'>
                        <FeedList
                            renderTopItem={this.renderTopItem}
                            getTopItemHeight={this.getTopItemHeight}
                            post_list={post_list}
                            PostCardChild={PostCardChild}
                            />
                    </div> }
                </div>
            );
        } else if (!err) {
            return <Loader />;
        } else {
            return <EmptyView emptyText={'加载失败，点击重试'} onClick={this.load}/>;
        }
    }
}

var get_posts = state => state.posts;
var get_post_ids = state => state.user_post_ids[window.user_id];
var get_post_list = createSelector(
    [get_post_ids, get_posts],
    (post_ids, posts) => post_ids && post_ids.map(id=>posts[id]) || null
)
var get_topic_editor = state => state.topic_editor;
var get_topic_post_list = createSelector(
    [get_topic_editor, get_posts],
    (topic_editor, posts) => topic_editor.post_ids.map(id=>posts[id])
)
var get_topic = (state, props) => props.params.id ? state.topics[props.params.id] : null;

var mapStateToProps = createStructuredSelector({
    post_list: get_post_list,
    topic_post_list: get_topic_post_list,
    topic_editor: get_topic_editor,
    topic: get_topic
});

export default module.exports = connect(mapStateToProps)(
    CSSModules(EditTopic, styles)
);
