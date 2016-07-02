import React from 'react';

import styles from './Loader.css'
import CSSModules from 'react-css-modules';

class Loader extends React.Component {
    onClick = () => {
        if (this.props.err) {
            this.props.onClick();
        }
    }
    render() {
        var { no_text, err } = this.props;
        return (
            <div styleName='root' onClick={this.onClick}>
                {!err && <div className='loader-circle image-image_loading' />}
                {!no_text && <div styleName='txt'>{err ? '加载失败，点击重试' : '加载中'}</div>}
            </div>
        )
    }
}

export default CSSModules(Loader, styles);
