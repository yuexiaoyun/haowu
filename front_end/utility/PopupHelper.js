var PopupWrapper = require('../routes/components/PopupWrapper');
var React = require('react');
var ReactDOM = require('react-dom');
var LoadingView = require('../routes/components/LoadingView');

var popupComponent;
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
        popupComponent = ReactDOM.render(popup, document.getElementById('popup_container'));
    });
}

module.exports.dismiss = function() {
    if (popupComponent) {
        popupComponent.dismiss(() => {
            ReactDOM.render(<div/>, document.getElementById('popup_container'));
            popupComponent = null;
        })
    } else {
        ReactDOM.render(<div/>, document.getElementById('popup_container'));
    }
}

module.exports.confirm = function(text, btn, f) {
    var d = module.exports.dismiss;
    module.exports.popup(
        <div className='confirm'>
            <div className='icon image-icon_warn_alert' />
            <div className='text'>{text}</div>
            <div className='btn btn1' onClick={()=>{d();f()}}>{btn}</div>
            <div className='btn btn2' onClick={d}>取消</div>
            <div className='close image-btn_delete_alert' onClick={d} />
        </div>
    );
}

module.exports.menu = function(items) {
    var d = module.exports.dismiss;
    ReactDOM.render(
        <PopupWrapper onClose={d} bottom={true}>
            <div className='menu'>
                { items && items.map(item=><div className='ok' onClick={()=>{d();item.f();}}>{item.text}</div>) }
                <div className='cancel' onClick={d}>取消</div>
            </div>
        </PopupWrapper>, document.getElementById('popup_container'));
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
            <div style={{marginBottom:10}}>
                <LoadingView />
            </div>
            { tips }
        </div>
    );
    var popup = <PopupWrapper onClose={()=>{}}>
        {progressView}
    </PopupWrapper>;
    ReactDOM.render(popup, document.getElementById('progress_container'));
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
    backgroundColor: "#000000",
    padding:'20px',
    paddingLeft: "20px",
    paddingRight: "20px",
    borderRadius: "17px",
    color:'#ddd',
    textAlign:'center',
    fontSize:'15px'
};
