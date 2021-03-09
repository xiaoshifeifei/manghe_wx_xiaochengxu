import {CodeLog} from "codelog-model.js"
var codelog = new CodeLog()
var app = getApp();
Page({
  data: {
    showPage: true,
    isSet:false,
    isMobile:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    HeadImg:codelog.HeadImg
  },
  onLoad: function (options) {
    //console.log(JSON.stringify(options))
    if (options.q) {
      var link = decodeURIComponent(options.q)
      var paramArr = link.split('=');
      var scenecode = paramArr[1]
      //console.log("q-"+scenecode)
    }

    if(options.scene){
      var scenecode = decodeURIComponent(options.scene)
      //console.log("scene-"+scenecode)
    }
    this.setData({
      scenecode:scenecode
    })
    this._loadData(scenecode)
  },
  /*loaddata*/
  _loadData:function(scenecode){
    var that = this
    codelog.verify(scenecode,(data)=>{
      if(data.err == 1000){
        if(data.data.is_bind_iphone == 1){
          app.globalData.is_bind_iphone = true
        }
      }
      this.getSetting()
    })
  },
  /*是否授权*/
  getSetting:function(){
    var that = this
    var scenecode=this.data.scenecode
    codelog.issetting((data)=>{
      if(data == 1){
      if(!app.globalData.is_bind_iphone){
        that.setData({
          showPage:false,//页面
          isSet:false,//授权
          isMobile:true,//手机号
        })
      }else{
        //跳转到正品验证
        wx.redirectTo({
          url: '../codeverify/codeverify?scenecode='+scenecode
        });
      }
    }else{
      //展示授权弹窗
      that.setData({
        showPage:false,
        isSet:true,//授权
      })
    }
  })
  },

  /*button获取用户信息*/
  bindGetUserInfo: function (e) {
    var that = this;
    var scenecode=this.data.scenecode
    if(e.detail.errMsg =="getUserInfo:ok"){
      //授权成功
      var param = {
        'userInfo': e.detail.userInfo,
        'encryptedData': e.detail.encryptedData,
        'iv': e.detail.iv,
        'type': 1,//手动授权
      }
      //绑定用户信息
      codelog.decryptData(param,(data)=>{
        if(data.err == '1000'){
          //设置全局data
          app.globalData.isSetting = true
          console.log(app.globalData.is_bind_iphone)
          if(!app.globalData.is_bind_iphone){
            that.setData({
              isSet: false,//授权关闭
              isMobile: true,//绑定手机开启
            })
          }else{
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1000
            })
            //跳转到正品验证页面
            wx.redirectTo({
              url: '../codeverify/codeverify?scenecode='+scenecode
            });
          }
      }
    });
    }
  },

  getPhoneNumber: function(e) {
    var scenecode=this.data.scenecode
    if(e.detail.errMsg == "getPhoneNumber:ok"){
      //获取成功
      var endata = encodeURIComponent(e.detail.encryptedData);
      var iv = encodeURIComponent(e.detail.iv);
      codelog.goBindPhone(endata,iv,(data)=>{
        if(data.err == 1000){
        app.globalData.is_bind_iphone = true
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1000
        })
        //跳转到正品验证页面
        wx.redirectTo({
          url: '../codeverify/codeverify?scenecode='+scenecode
        });
      }else{
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
    }else{
      //获取失败
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none',
        duration: 1000
      })
    }
  },

  /*跳转到协议*/
  goAgree: function () {
    wx.navigateTo({
      url: '../mehelp/mehelp?type=0'
    })
  }

})