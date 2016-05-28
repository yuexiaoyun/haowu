import React from 'react'
import _ from 'underscore'

export default class LoadingView extends React.Component {
    constructor() {
        super();
        this.state = {begin: new Date(), i: 0};
    }
    refresh = () => {
        if (this.mounted) {
            this.setState({now: new Date()})
            setTimeout(this.refresh, 20);
        }
    }
    componentDidMount() {
        this.mounted = true;
        this.refresh();
    }
    componentWillUnmount() {
        this.mounted = false;
    }
    render() {
        var i = Math.floor((new Date() - this.state.begin) / 200) % 4 + 1;
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
            <span style={style} className={"image-image_loading" + (i + 1)} />
        );
    }
}
