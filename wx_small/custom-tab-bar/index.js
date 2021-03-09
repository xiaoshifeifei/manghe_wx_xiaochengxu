var app = getApp();
Component({
  data: {
    selected: null,
    isIphoneX:false,
    color: "#232323",
    selectedColor: "#232323",
    list: [
        {
            "pagePath": "/pages/index/index",
            "text": "首页",
            "iconPath": "/img/nav-1.png",
            "selectedIconPath": "/img/nav-1-hover.png",
            "selectedColor": "#232323"
          },
          {
            "pagePath": "/pages/welfare/welfare",
            "text": "福利",
            "iconPath": "/img/nav-2.png",
            "selectedIconPath": "/img/nav-2-hover.png",
            "selectedColor": "#232323"
          },
          {
            "pagePath": "/pages/box/box",
            "text": "拆盒",
            "iconPath": "/img/nav-5.png",
            "selectedIconPath": "/img/nav-5-hover.png",
            "selectedColor": "#232323"
          },
          {
            "pagePath": "/pages/shopping/shopping",
            "text": "盒柜",
            "iconPath": "/img/nav-3.png",
            "selectedIconPath": "/img/nav-3-hover.png",
            "selectedColor": "#232323"
          },
          {
            "pagePath": "/pages/me/me",
            "text": "我的",
            "iconPath": "/img/nav-4.png",
            "selectedIconPath": "/img/nav-4-hover.png",
            "selectedColor": "#232323"
          }
    ]
  },
  attached() {
  },
  ready: function() {    
    let isPhoneX = app.globalData.isIphoneX;
    if(isPhoneX){
        this.setData({
            isIphoneX:true,
        }) 
    } 
    
  },
  methods: {
    switchTab(e) {  
      const data = e.currentTarget.dataset
      //console.log(data.path);
      //console.log(data.index);
      if (data.index == 2) {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone){
          this._authCheckWin()
          return false
        }
      }
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    },
    _authCheckWin() {
      //弹窗
      wx.showModal({
        title: '提示',
        content: '您还未登录，是否前往登录？',
        cancelText:'暂不登录',
        cancelColor:'#9F9F9F',
        confirmText:'立即登录',
        confirmColor:'#ED7392',
        success (res) {
          if (res.confirm) {
            //跳转到授权页面
            wx.navigateTo({
              url: '../logauth/logauth'
            })
          } else if (res.cancel) {

          }
        }
      })
    }
  }
})