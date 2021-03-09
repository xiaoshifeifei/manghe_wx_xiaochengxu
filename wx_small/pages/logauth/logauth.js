// pages/logauth/logauth.js
import {LogAuth} from "logauth-model.js"
var logauth = new LogAuth()
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSet:false,
    isMobile:false,
    HeadImg:logauth.HeadImg,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type
  },
  onShow: function () {
    //展示授权登录或绑定手机号
    if (!app.globalData.isSetting) {
      this.setData({
        isSet: true
      })
    } else {
      //判断是否展示手机号
      this.setData({
        isMobile: true
      })
    }
  },
  onReady:function(){

  },

  /*button获取用户信息*/
  bindGetUserInfo: function (e) {
    var that = this;
    if(e.detail.errMsg =="getUserInfo:ok"){
      //授权成功
      var param = {
        'userInfo': e.detail.userInfo,
        'encryptedData': e.detail.encryptedData,
        'iv': e.detail.iv,
        'type': 1,//手动授权
      }
      //绑定用户信息
      logauth.decryptData(param,(data)=>{
        if(data.err == '1000'){
          //设置全局data
          app.globalData.isSetting = true
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
            setTimeout(function(){
              //返回上一级
              wx.navigateBack({
                delta: 1
              })
            },1000)
          }
        }else{
          wx.showToast({
            title: '登录失败，请重试',
            icon: 'none',
            duration: 2000
          })
        }
    });
    }
  },
  getPhoneNumber: function(e) {
    if(e.detail.errMsg == "getPhoneNumber:ok"){
      //获取成功
      var endata = encodeURIComponent(e.detail.encryptedData);
      var iv = encodeURIComponent(e.detail.iv);
      logauth.goBindPhone(endata,iv,(data)=>{
        if(data.err == 1000){
          app.globalData.is_bind_iphone = true
          wx.navigateBack({
            delta: 1
          })
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

    }
  },

  /*跳转到协议*/
  goAgree: function () {
    wx.navigateTo({
      url: '../mehelp/mehelp?type=0'
    })
  },

  //暂不授权-返回上一级
  noAuth:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})