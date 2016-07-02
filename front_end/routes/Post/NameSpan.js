import React from 'react'
import { hashHistory } from 'react-router'

import styles from './NameSpan.css'
import CSSModules from 'react-css-modules';

class NameSpan extends React.Component {
    avatarClick = (e)=>{
        e.stopPropagation();
        var { user } = this.props;
        hashHistory.push('detail/' + user._id);
    }
    render() {
        var { user } = this.props;
        return <span styleName={'nickname'} onClick={this.avatarClick}>{user.nickname}</span>;
    }
}

export default CSSModules(NameSpan, styles);
