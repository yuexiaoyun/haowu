import React from 'react'
import _ from 'underscore'

export default class LoadingView extends React.Component {
    constructor() {
        super();
        this.state = {begin: new Date(), i: 1};
    }
    refresh = () => {
        if (this.mounted) {
            var i = Math.floor((new Date() - this.state.begin) / 100) % 4 + 1;
            this.setState({i: i})
        } else {
            clearInterval(this.timer);
        }
    }
    componentDidMount() {
        this.mounted = true;
        this.timer = setInterval(this.refresh, 1);
    }
    componentWillUnmount() {
        this.mounted = false;
    }
    render() {
        var { i } = this.state;
        var style = {
            display: 'inline-block',
            width: 60,
            height: 24,
            padding: '12px 0 12px 60px',
            backgroundSize: '60px 24px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left center'
        };
        return (
            <span style={style} className={"image-image_loading" + i} />
        );
    }
}
