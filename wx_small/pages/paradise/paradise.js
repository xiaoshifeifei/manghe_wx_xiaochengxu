//index.js  
var app = getApp();
Page({
  data: {

  },
  onShow: function () {
//    let isPhoneX = app.globalData.isIphoneX;
//    if(isPhoneX){
//        this.setData({
//            isPhoneX:true,
//        }) 
//    }   
//    app.editTabBar();    //显示自定义的底部导航
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
              selected: 0
            })
        }    
  },
  toindex: function () {     //
    wx.navigateTo({
      url: '../index/index',
    })
  },
  toparadise: function () {     //
    wx.navigateTo({
      url: '../paradise/paradise',
    })
  },
  tobox: function () {     //
    wx.navigateTo({
      url: '../box/box',
    })
  },
  toshopping: function () {     //
    wx.navigateTo({
      url: '../shopping/shopping',
    })
  },
  tome: function () {     // 
    wx.navigateTo({
      url: '../me/me',
    })
  },
  onLoad: function () {

  }
})
