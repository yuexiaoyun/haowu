import PopupHelper from './PopupHelper';

module.exports = function(tips, promise) {
    var state = 1;
    PopupHelper.showProgressDialog(tips);
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
