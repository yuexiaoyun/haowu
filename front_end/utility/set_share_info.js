export default (share_info) => {
    wx.ready(()=>{
        var menuList = [
            'menuItem:share:qq',
            'menuItem:share:weiboApp',
            'menuItem:share:timeline',
            'menuItem:share:facebook',
            'menuItem:share:QZone',
            'menuItem:copyUrl',
            'menuItem:openWithSafari'
        ];
        if (share_info) {
            wx.onMenuShareAppMessage(share_info);
            //wx.onMenuShareTimeline(share_info);
            wx.hideMenuItems({
                menuList
            });
            wx.showMenuItems({
                menuList: [
                    'menuItem:share:appMessage'
                ]
            });
        } else {
            wx.hideMenuItems({
                menuList: [
                    'menuItem:share:appMessage',
                    ...menuList
                ]
            });
        }
    });
}
