import React from 'react'
import { set_intro } from '../../actions'

import FollowLine from './FollowLine';
import SubButton from './SubButton';
import UserInfo from './UserInfo';
import IntroInput from './IntroInput';
import NotificationIcon from './NotificationIcon';
import Tabbar from '../common/Tabbar';

import { connect } from 'react-redux';
import styles from './UserTop.css'
import CSSModules from 'react-css-modules';

class UserTop extends React.Component {
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        currentTab: React.PropTypes.number.isRequired,
        setCurrentTab: React.PropTypes.func.isRequired,
        handleHeight: React.PropTypes.func.isRequired
    }
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
        if (user._id == window.user_id) {
            className = className + '-me';
        }
        return (
            <div styleName='intro-container'>
                <div styleName={className} onClick={this.input}>
                    { user.intro || user._id == window.user_id && '我的爱好；我的个性...或者我希望聊的' || 'Ta很懒，还没有个人介绍' }
                </div>
            </div>
        );
    }
    render() {
        var { user, currentTab, setCurrentTab } = this.props;
        var ta = user && user._id == window.user_id && '我' || 'Ta';
        return (
            <div ref='root' styleName='root'>
                <FollowLine />
                { user._id == window.user_id && <NotificationIcon /> }
                <SubButton user={user} />
                <UserInfo user={user} />
                { this.state.input ?
                    <IntroInput user={user} handleInput={this.handleInput}/> :
                    this.renderIntro() }
                <div styleName='number-container'>
                    <div styleName='number-cell'>
                        <div styleName='number'>{user.reads_count || 0}</div>
                        <div styleName='tag'>被听</div>
                    </div>
                    <div styleName='number-cell'>
                        <div styleName='number'>{user.liked_count || 0}</div>
                        <div styleName='tag'>被赞</div>
                    </div>
                    <div styleName='number-cell'>
                        <div styleName='number'>{user.sub_count || 0}</div>
                        <div styleName='tag'>订阅</div>
                    </div>
                    <div styleName='number-cell'>
                        <div styleName='number'>{user.subbed_count || 0}</div>
                        <div styleName='tag'>粉丝</div>
                    </div>
                </div>
                <Tabbar
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                    tabs={[
                        ta + '的发布',
                        ta + '的专辑'
                    ]} />
            </div>
        );
    }
}

export default connect()(
    CSSModules(UserTop, styles)
);
