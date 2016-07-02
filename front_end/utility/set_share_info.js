import wx from 'weixin-js-sdk'
import fconf from '../fconf'

export default (share_info) => {
    wx.ready(()=>{
        var menuList = [
            'menuItem:share:qq',
            'menuItem:share:weiboApp',
            'menuItem:share:facebook',
            'menuItem:share:QZone',
            'menuItem:copyUrl',
            'menuItem:openWithSafari'
        ];
        if (!share_info) {
            share_info = {
                title: '点一下，这里有生活有趣的另一种可能',
                desc: '物记，好物有声',
                link: fconf.site + '/app/home',
                imgUrl: fconf.site + '/static/images/logo_80.png'
            }
        }
        if (share_info) {
            wx.onMenuShareAppMessage(share_info);
            share_info.title = share_info.title + ' | ' + share_info.desc;
            wx.onMenuShareTimeline(share_info);
            wx.hideMenuItems({
                menuList
            });
            wx.showMenuItems({
                menuList: [
                    'menuItem:share:timeline',
                    'menuItem:share:appMessage'
                ]
            });
        }
    });
}
