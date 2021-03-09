//index.js  

var app = getApp();


Page({
  data: {
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: false,
    autoplay: true,
    circular: true,
    interval: 5000,
    duration: 1000
  },
 
  onShow: function () {
    app.editTabBar();    //显示自定义的底部导航
  },
  toindex: function () {     //
    wx.redirectTo({
      url: '../index/index',
    })
  },
  toparadise: function () {     //
    wx.redirectTo({
      url: '../paradise/paradise',
    })
  },
  tobox: function () {     //
    wx.redirectTo({
      url: '../box/box',
    })
  },
  toshopping: function () {     //
    wx.redirectTo({
      url: '../shopping/shopping',
    })
  },
  tome: function () {     //
    wx.redirectTo({
      url: '../me/me',
    })
  },
  onLoad: function () {

  }
})
