import React from 'react'
import { set_intro } from '../../actions'

import FollowLine from './FollowLine';
import SubButton from './SubButton';
import UserInfo from './UserInfo';
import IntroInput from './IntroInput';
import NotificationIcon from './NotificationIcon';

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
                { window.sub_status != 1 && <FollowLine /> }
                { user._id == window.user_id && <NotificationIcon /> }
                <SubButton user={user} />
                <UserInfo user={user} />
                { this.state.input ?
                    <IntroInput user={user} handleInput={this.handleInput}/> :
                    this.renderIntro() }
                <div styleName='tabs'>
                    <div styleName='tab' onClick={()=>setCurrentTab(0)}>
                        {ta}的发布
                        { currentTab == 0 && <div styleName='tab-current' /> }
                    </div>
                    <div styleName='tab' onClick={()=>setCurrentTab(1)}>
                        {ta}的专辑
                        { currentTab == 1 && <div styleName='tab-current' /> }
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(
    CSSModules(UserTop, styles)
);
