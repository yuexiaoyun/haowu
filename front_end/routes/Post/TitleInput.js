import React from 'react'

import styles from './TitleInput.css'
import CSSModules from 'react-css-modules';

class TitleInput extends React.Component {
    constructor(props) {
        super();
        this.state = { title: props.title }
    }
    shouldComponentUpdate(props) {
        return false;
    }
    componentDidMount() {
        this.refs.input.focus();
        this.refs.input.addEventListener('blur', () => {
            this.props.handleInput(this.state.title);
        })
    }
    handleChange = (event) => {
        console.log(event.target.value.length);
        if (event.target.value.length <= 15) {
            this.setState({title: event.target.value});
        } else {
            event.target.value = this.state.title;
        }
    }
    render() {
        var { post } = this.props;
        return (
            <input
                ref='input'
                styleName='title-input'
                type='text'
                value={this.state.title}
                onChange={this.handleChange}/>
        );
    }
}
export default CSSModules(TitleInput, styles);
