import React from 'react'
import {hitContainer} from '../../utility/detect_event_target.js'
import outer_height from '../../utility/outer_height.js'
import ScreenSize from '../../utility/screen_size.js'
var ReactDom = require('react-dom');
var _ = require('underscore');

export default class PopupWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.children != nextProps.children;
    }
    onClickOutSide = (e) => {
        var container = ReactDom.findDOMNode(this.refs.content);
        if (container) {
            if (!hitContainer(e, ReactDom.findDOMNode(container))) {
                this.props.onClose();
            }
        }
    }
    sizeChanged = (e) => {
        this.forceUpdate();
    }
    keyboardHeightChanged = (height) => {
        this.setState({
            keyboardHeight: parseInt(height)
        });
        this.forceUpdate();
    }
    componentWillUnmount() {
        //解决android弹键盘时，遮盖position:fixed元素的问题
        window.removeEventListener("resize", this.sizeChanged);
        if (this.props.onClose) {
            window.document.removeEventListener("mousedown", this.onClickOutSide);
        }
    }
    componentDidMount() {
        window.addEventListener("resize", this.sizeChanged);
        if (this.props.onClose) {
            window.document.addEventListener("mousedown", this.onClickOutSide);
        }
        this.updateContentPosition();
    }
    updateContentPosition() {
        if (this.getContentSize()) {
            return;
        }
        var content = ReactDom.findDOMNode(this.refs.content);
        if (!content) return;
        var child = content.children[0];
        this.setState({
            content_size: {
                width: child.clientWidth,
                height: outer_height(child)
            }
        });
        this.forceUpdate();
    }
    getContentSize() {
        var content_size = this.state && this.state.content_size;
        if (!content_size) {
            content_size = this.props.content_size;
        }
        return content_size;
    }
    keyboardHeight() {
        if (this.props.state) {
            return this.props.state.keyboardHeight || 0;
        }
        return 0;
    }
    dismiss(finish) {
        this.setState({dismiss: true});
        this.forceUpdate();
        setTimeout(() => {
            finish();
        }, 400);
    }
    render() {
        var content_size = this.getContentSize();
        var containerClass = '';
        var styles = {opacity:0};
        var modal = this.props.bottom ? 'modal-bottom' : 'modal';
        var screenSize = ScreenSize();
        if (!this.props.hide && content_size) {
            var visibleHeight = screenSize.height - this.keyboardHeight();
            var top = Math.floor((visibleHeight - content_size.height) / 2);
            var left = Math.floor((screenSize.width - content_size.width) / 2);
            styles = {
                position: 'absolute',
                left: left + 'px',
                height: content_size.height + 'px',
                width: content_size.width + 'px'
            };
            if (this.props.bottom) {
                styles = {
                    ...styles,
                    top: screenSize.height - content_size.height
                }
            } else {
                styles = {
                    ...styles,
                    top: top
                }
            }
            styles.opacity = 1;
            containerClass = ' popup_container_visible';

            if (this.props.bottom) {
                modal = 'modal-bottom modal-bottom-in';
            } else {
                modal = 'modal modal-in';
            }
        } else {
            styles = {
                top: screenSize.height
            }
        }

        if (this.state.dismiss) {
            containerClass = '';

            if (this.props.bottom) {
                styles.top = screenSize.height;
            }
        }

        return <div key='popup_container' className={'popup_container ' + containerClass}>
            {this.props.showCloseBtn && <img src="/static/images/closed.png"
                                             style={{width:'20px', height:'20px', margin:'20px'}}
                                             className="cursor-pointer float-r"/>}
            <div ref='content' style={styles}  className={modal}>
                {this.props.children}
            </div>
        </div>
    }
}
