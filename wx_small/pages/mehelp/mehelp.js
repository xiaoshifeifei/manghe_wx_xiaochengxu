// pages/mehelp/mehelp.js
import {Mehelp} from "mehelp-model.js";
var mehelp = new Mehelp();
var WxParse = require('../../assets/wxParse/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      title:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type
    this._loadData(type)

    //设置title
    var title;
    if (type == 0) {
      title = '使用协议'
    }
    if (type == 1) {
      title = '使用帮助'
    }
    wx.setNavigationBarTitle({
      title: title
    })
  },

  /*加载数据*/
  _loadData:function(type){
    var that = this
    mehelp.getHelp(type,(data)=>{
      if(data.err == 0){
        var content = data.data.faq.content
        data.data.faq.content = WxParse.wxParse('content','html',content,that,15);
      }
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