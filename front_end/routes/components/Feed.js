import React from 'react';
import { findDOMNode } from 'react-dom'

class __Feed extends React.Component {
    shouldComponentUpdate(prevProps) {
        return prevProps.w != this.props.w || prevProps.count != this.props.count;
    }
    render() {
        console.log('render __Feed');
        var {w, count, renderItem, getItemHeight} = this.props;
        var hs = [0, 0];
        var div_list = [[], []];
        for (var i = 0; i < count; i++) {
            var h = getItemHeight(i, w);
            if (hs[0] <= hs[1]) {
                div_list[0].push(i);
                hs[0] += h;
            } else {
                div_list[1].push(i);
                hs[1] += h;
            }
        }
        var styles = {
            d1: {
                width: '100%',
                paddingLeft: 3,
                paddingRight: 3
            },
            d2: () => {
                return {
                    width: w,
                    float: 'left'
                }
            }
        }
        return (
            <div style={styles.d1}>
                <div style={styles.d2()} key={'list0'}>
                    { div_list[0].map(i=>renderItem(i, w)) }
                </div>
                <div style={styles.d2()} key={'list1'}>
                    { div_list[1].map(i=>renderItem(i, w)) }
                </div>
                <div style={{width: '100%', height: 0, clear:'both', overflow:'hidden'}} />
            </div>
        );
    }
}

export default class Feed extends React.Component {
    constructor() {
        console.log('here');
        super();
        this.state = { width: window.innerWidth };
    }
    componentDidMount() {
        this.setSize();
        window.addEventListener('resize', this.setSize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.setSize);
    }
    setSize = () => {
        var dom = findDOMNode(this);
        this.setState({width: dom.clientWidth});
    }
    render() {
        var {width} = this.state;
        var w = (width - 6) / 2;
        return <__Feed {...this.props} w={w} />;
    }
}
