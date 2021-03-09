// pages/promdetail/promdetail.js
import {PromDetail} from "promdetail-model.js"
var WxParse = require('../../assets/wxParse/wxParse/wxParse.js');
var promdetail = new PromDetail()
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
    var id = options.id
    this._loadData(id)
  },

  _loadData:function(id){
    var that = this
    promdetail.getDetail(id,(data)=>{
      if(data.err == 0){
        var detail = data.data
        WxParse.wxParse('content','html',detail.content,that,25);
      }
      that.setData({
        detail:detail
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(222222);
      var detail = this.data.detail
      var endcoe = detail.encode
      var back_url = encodeURIComponent('/pages/promdetail/promdetail?id='+detail.id);
      //from menu
      return {
        title: detail.sharetitle,
        path: '/pages/login/login?type=1&encode='+endcoe+'&back_url='+back_url,
        imageUrl:detail.images.pic3
      }
  }
})