import React from 'react'
import { set_intro } from '../../actions'

import FollowLine from './FollowLine';
import SubButton from './SubButton';
import UserInfo from './UserInfo';
import IntroInput from './IntroInput';
import NotificationIcon from './NotificationIcon';

import btnEditMe from '../../files/btn_edit_me.png';

import { connect } from 'react-redux';
import styles from './UserTop.css'
import CSSModules from 'react-css-modules';

// TODO: 关注公众号的弹窗
class UserTop extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        this.props.handleHeight(this.refs.root.clientHeight);
    }
    componentDidUpdate() {
        this.props.handleHeight(this.refs.root.clientHeight);
    }
    input = () => {
        var { user } = this.props;
        if (user._id == window.user_id) {
            this.setState({input: true});
        }
    }
    handleInput = (value) => {
        this.setState({input: false});
        this.props.dispatch(set_intro({intro: value}));
    }
    renderIntro() {
        var { user } = this.props;
        var className = user.intro ? 'intro' : 'intro-null';
        return (
            <div>
                { user._id == window.user_id && <img styleName='intro-edit' src={btnEditMe} /> }
                <div styleName={className} onClick={this.input}>
                    { user.intro || user._id == window.user_id && '我的爱好；我的个性...或者我的微信' || 'Ta很懒，还没有个人介绍' }
                </div>
            </div>
        );
    }
    render() {
        var { user } = this.props;
        return (
            <div ref='root' styleName='root'>
                { user._id == window.user_id && user.post_count > 0 && <div styleName='share-line'>
                    可以将好物记录分享给微信好友、朋友圈
                    <span styleName='arrow' className="image-icon_me_up"/>
                </div> }
                { user._id != window.user_id && <FollowLine /> }
                { user._id == window.user_id && <NotificationIcon /> }
                <SubButton user={user} />
                <UserInfo user={user} />
                { this.state.input ?
                    <IntroInput user={user} handleInput={this.handleInput}/> :
                    this.renderIntro() }
                <div styleName='d3' />
            </div>
        );
    }
}

export default connect()(
    CSSModules(UserTop, styles)
);
