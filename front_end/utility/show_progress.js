import PopupHelper from './PopupHelper';

module.exports = function(promise) {
    var state = 0;
    setTimeout(()=>{
        if (state == 0) {
            PopupHelper.showProgressDialog();
            state = 1;
        }
    }, 200);
    promise.then((r)=>{
        if (state == 1) {
            PopupHelper.hideProgressDialog();
        }
        state = 2;
        if (r) PopupHelper.toast(r);
    }).catch((e) => {
        if (state == 1) {
            PopupHelper.hideProgressDialog();
        }
        state = 2;
        PopupHelper.toast(e);
    });
}
