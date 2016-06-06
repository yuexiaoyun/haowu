import React from 'react';
import CommonCard from './components/CommonCard';
import { connect } from 'react-redux';
import { createAction } from 'redux-actions';
import { hashHistory } from 'react-router';

class Notifications extends React.Component {
    componentDidMount() {
        var { new_count } = this.props;
        if (new_count > 0)
            fetch('/api/clear_badge', {credentials:'same-origin'});
    }
    componentWillUnmount() {
        this.props.dispatch(createAction('clear_badge2')());
    }
    render() {
        var { notifications, my_badge2, users } = this.props;
        return <div>{ notifications && notifications.map(
            (n, i) => {
                var user = users[n.openid2];
                return <CommonCard
                    openid={n.openid2}
                    avatar={user.headimgurl}
                    txt={`${user.nickname} ${n.type=='like' ? '赞' : '订阅'}了你`}
                    pic_id={n.type == 'like' ? n.post.pic_id : null}
                    new_item={i < my_badge2}
                    onClick={n.type=='like' ? ()=>{hashHistory.push('/post/' + n.post._id)} : null}
                />;
            }
        )}</div>;
    }
}

export default connect(state=>({
    users: state.users,
    my_badge2: state.my_badge2,
    notifications: state.notifications
}))(Notifications);
