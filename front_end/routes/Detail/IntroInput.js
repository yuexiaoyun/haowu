import React from 'react'

import styles from './IntroInput.css'
import CSSModules from 'react-css-modules';

class IntroInput extends React.Component {
    shouldComponentUpdate(props) {
        return false;
    }
    componentDidMount() {
        this.refs.input.focus();
        this.refs.input.addEventListener('blur', () => {
            this.props.handleInput(this.refs.input.value);
        })
    }
    render() {
        var { user } = this.props;
        return (
            <div>
                <input ref='input' styleName='intro-input' defaultValue={user.intro}/>
            </div>
        );
    }
}
export default CSSModules(IntroInput, styles);
