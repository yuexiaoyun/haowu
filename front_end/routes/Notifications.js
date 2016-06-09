import React from 'react';
import CommonCard from './components/CommonCard';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import { hashHistory } from 'react-router';
import { get_badge_count } from '../reselectors';

class Notifications extends React.Component {
    constructor(props) {
        super(props);
        // componentDidMount后会clear_badge，但本次渲染仍然需要上一次的clear_badge_time
        this.state = {
            clear_badge_time: props.clear_badge_time
        }
    }
    componentDidMount() {
        fetch('/api/clear_badge', {credentials:'same-origin'});
        this.props.dispatch(createAction('clear_badge_time')(new Date()));
    }
    render() {
        var { notifications, users } = this.props;
        var { clear_badge_time } = this.state;
        return <div>{ notifications && notifications.map(
            (n) => {
                var user = users[n.openid2];
                return <CommonCard
                    openid={n.openid2}
                    avatar={user.headimgurl}
                    txt={`${user.nickname} ${n.type=='like' ? '赞' : '订阅'}了你`}
                    pic_id={n.type == 'like' ? n.post.pic_id : null}
                    new_item={!clear_badge_time || n.uptime > clear_badge_time}
                    onClick={n.type=='like' ? ()=>{hashHistory.push('/post/' + n.post._id)} : null}
                />;
            }
        )}</div>;
    }
}

export default connect(state=>({
    users: state.users,
    clear_badge_time: state.clear_badge_time,
    notifications: state.notifications
}))(Notifications);
