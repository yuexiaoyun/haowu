import React from 'react'

import styles from './EmptyView.css'
import CSSModules from 'react-css-modules';

import image404 from '../../files/image_404.png';

class EmptyView extends React.Component {
    static propTypes = {
        emptyText: React.PropTypes.string.isRequired,
        topHeight: React.PropTypes.number,
        onClick: React.PropTypes.func,
        emptyImage: React.PropTypes.string
    }
    render() {
        return (
            <div style={{top: this.props.topHeight || 0}} styleName='container'>
                <div styleName='dummy' />
                <div styleName='image-container' onClick={this.props.onClick || (()=>{}) } >
                    <img styleName='empty-image' src={this.props.emptyImage || image404} />
                    <div styleName='text'>{this.props.emptyText}</div>
                </div>
            </div>
        );
    }
}
export default CSSModules(EmptyView, styles);
