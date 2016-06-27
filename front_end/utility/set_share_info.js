import wx from 'weixin-js-sdk'

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
        } else {
            wx.hideMenuItems({
                menuList: [
                    'menuItem:share:timeline',
                    'menuItem:share:appMessage',
                    ...menuList
                ]
            });
        }
    });
}
