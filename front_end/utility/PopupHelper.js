var PopupWrapper = require('../routes/components/PopupWrapper');
var React = require('react');
var ReactDOM = require('react-dom');
var LoadingView = require('../routes/components/LoadingView');

//deprecated, use popup 2
module.exports.popup = function (content, hide, modal) {
    return module.exports.popup2({
        content,
        hide,
        modal,
        showCloseBtn: false
    })
}

module.exports.popup2 = function({content, hide, modal, showCloseBtn}) {
    return new Promise(function(resolve, reject) {
        var popup = <PopupWrapper onClose={modal ? ()=>{} : () => {reject(); module.exports.dismiss()}}
                                  hide={hide}
                                  showCloseBtn={showCloseBtn}>
            {content}
        </PopupWrapper>;
        ReactDOM.render(popup, document.getElementById('popup_container'));
    });
}

module.exports.dismiss = function() {
    ReactDOM.render(<div/>, document.getElementById('popup_container'));
}

module.exports.toast = function(text, timeout) {
    var toast = <div style={toastStyle}><span style={spanStyle}>{text}</span></div>;
    ReactDOM.render(toast, document.getElementById('toast_container'));

    setTimeout(() => {
        ReactDOM.render(<div/>, document.getElementById('toast_container'))
    }, timeout || 1200);
}

module.exports.showProgressDialog = function(tips) {
    var progressView = (
        <div style={progressStyle}>
            <LoadingView />
        </div>
    );
    try {
        var popup = <PopupWrapper onClose={()=>{}}>
            {progressView}
        </PopupWrapper>;
        ReactDOM.render(popup, document.getElementById('progress_container'));
    } catch(err) {
        alert(err);
    }
}

module.exports.hideProgressDialog = function() {
    ReactDOM.render(<div/>, document.getElementById('progress_container'));
}

var toastStyle = {
    zIndex: 200000,
    position: 'fixed',
    bottom: '150px',
    left: '0px',
    width: '100%',
    textAlign: 'center'
};

var spanStyle = {
    padding:"10px",
    paddingLeft: "20px",
    paddingRight: "20px",
    borderRadius: "17px",
    color: 'white',
    background: "black",
    fontSize: '15px'
};

var progressStyle = {
    display:'inline-block',
    backgroundColor: "#ffffff",
    padding:'38px',
    paddingLeft: "20px",
    paddingRight: "20px",
    borderRadius: "17px",
    textAlign:'center',
    fontSize:'15px'
};
