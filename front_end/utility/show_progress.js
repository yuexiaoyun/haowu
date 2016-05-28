import PopupHelper from './PopupHelper';

module.exports = function(tips, promise) {
    PopupHelper.showProgressDialog(tips);
    promise.then((r)=>{
        PopupHelper.hideProgressDialog();
        PopupHelper.toast(r);
    }).catch((e) => {
        PopupHelper.hideProgressDialog();
        PopupHelper.toast(e);
    });
}
