import React from 'react'

import styles from './TitleInput.css'
import CSSModules from 'react-css-modules';

class TitleInput extends React.Component {
    constructor(props) {
        super();
        this.state = {
            title: props.post.title || ''
        }
    }
    componentDidMount() {
        this.refs.input.focus();
        this.refs.input.addEventListener('blur', () => {
            this.props.handleInput(this.state.title);
        })
    }
    handleChange = (event) => {
        if (event.target.value.length <= 15) {
            this.setState({title: event.target.value});
        }
    }
    render() {
        var { post } = this.props;
        return (
            <input
                ref='input'
                type='text'
                styleName='title-input'
                value={this.state.title}
                onChange={this.handleChange}/>
        );
    }
}
export default CSSModules(TitleInput, styles);
