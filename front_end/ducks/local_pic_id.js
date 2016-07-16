import { createAction, handleActions } from 'redux-actions'
import { hashHistory } from 'react-router'
import wx from 'weixin-js-sdk'
import update from '../utility/update'

export default handleActions({
    take_pic: (state, action) => (action.payload)
}, null);

export var takePhoto = (add) => {
    return dispatch => {
        wx.chooseImage({
            count: 1,
            success: res => {
                var path = res.localIds[0];
                dispatch(createAction('take_pic')(path));
                hashHistory.push('/pub?add=' + add);
            }
        });
        update('/api/hide_tooltip');
        dispatch(createAction('update_tooltip')(0));
    }
}
