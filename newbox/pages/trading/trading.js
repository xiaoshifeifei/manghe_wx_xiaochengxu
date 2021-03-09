//index.js  
var app = getApp();
Page({
    data: {

    },
    onShow: function() {
        app.editTabBar(); //显示自定义的底部导航
    },
    toindex: function() { //
        wx.redirectTo({
            url: '../index/index',
        })
    },
    toparadise: function() { //
        wx.redirectTo({
            url: '../trading/trading',
        })
    },
    tobox: function() { //
        wx.redirectTo({
            url: '../box/box',
        })
    },
    toshopping: function() { //
        wx.redirectTo({
            url: '../shopping/shopping',
        })
    },
    tome: function() { //
        wx.redirectTo({
            url: '../me/me',
        })
    },
    onLoad: function() {

    }
})