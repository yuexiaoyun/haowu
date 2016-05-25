import React from 'react'
import _ from 'underscore'

export default class BottomButton extends React.Component {
    render() {
        return (
            <div>
                <div style={{height:"50px"}}/>
                <span onClick={this.props.onClick || (()=>{})}
                      style={style.bottomBtn}>
                    {this.props.txt}
                </span>
            </div>
        );
    }
}

var style = {
    bottomBtn: {
        width: "100%",
        height: "46px",
        lineHeight: "46px",
        margin: "10px auto 0",
        background: "#02baff",
        color: "#fff",
        fontSize: "1.1em",
        textAlign: "center",
        cursor: "pointer",
        position: "fixed",
        left: "0",
        bottom: "0",
        zIndex: "10"
    }
};
