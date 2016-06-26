import React from 'react'

import styles from './EmptyView.css'
import CSSModules from 'react-css-modules';

import image404 from '../../files/image_404.png';

class EmptyView extends React.Component {
    render() {
        return (
            <div style={{top: this.props.topHeight || 0}} styleName='container'>
                <div styleName='dummy' />
                <div styleName='image-container'>
                    <img styleName='empty-image' src={image404} />
                    { this.props.emptyText && <div styleName='text'>
                        {this.props.emptyText}
                    </div> }
                </div>
            </div>
        );
    }
}
export default CSSModules(EmptyView, styles);
