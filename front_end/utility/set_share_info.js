import wx from 'weixin-js-sdk'
import fconf from '../fconf'

export default (s) => {
    wx.ready(()=>{
        var share_info = {
            title: '点一下，生活的另一种可能 | 物记，好物有声',
            desc: '图音好物分享社区，体验沉淀在物里的情感，在这里，慢下来',
            link: fconf.site + '/app/home',
            imgUrl: fconf.site + '/assets/images/logo_80.png',
            ...(s || {})
        }
        wx.onMenuShareAppMessage(share_info);
        wx.onMenuShareTimeline(share_info);
    });
}
