// pages/meset/meset.js
import {MeSet} from "meset-model.js";
var meset = new MeSet();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /*跳转绑定手机号*/
  bindPhone:function(){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '../bindphone/bindphone'
    })
  },

  /*跳转帮助文档*/
  mehelp:function(event){
    var type = meset.getDataSet(event,'type');
    wx.navigateTo({
      url: '../mehelp/mehelp?type='+type
    })
  },
  /*跳转到正品验证记录*/
  codeList: function () {
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '../mecode/mecode'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})