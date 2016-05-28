import React from 'react'
import _ from 'underscore'

export default class BottomButton extends React.Component {
    render() {
        var style = {
            bottomBtn: {
                width: "100%",
                height: "49px",
                lineHeight: "49px",
                margin: "10px auto 0",
                background: this.props.disabled ? "#ccc" : "#ff3333",
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
        return (
            <div>
                <div style={{height:"52px"}}/>
                <span onClick={this.props.onClick || (()=>{})}
                      style={style.bottomBtn}>
                    {this.props.txt}
                </span>
            </div>
        );
    }
}
