// pages/news/news.js
import {News} from "news-model.js";
var news  = new News();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: 1,
    nextPage: 1,
    allArt: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArticle(0)
  },

  getArticle: function (type) {
    var that = this, p = this.data.p, nextPage = this.data.nextPage, allArt = this.data.allArt;
    if (nextPage == 0) {
      news.toastMsg("没有更多内容喽~")
      return false;
    }
    news.getList(p,(data)=>{
      if(data.err == 0){
        var newData = allArt.concat(data.data.list)
        that.setData({
          allArt:newData,
          p:p+1,
          nextPage:data.data.nextPage
        })
        if(type==1){
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
          news.toastMsg("刷新成功")
        }
      }
    })
  },

  /*跳转到详情*/
  goDetail:function(event){
    var id = news.getDataSet(event,'id')
    wx.navigateTo({
          url: '../newsdetail/newsdetail?id='+id
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
    this.data.p = 1;
    this.data.nextPage = 1;
    this.data.allArt = [];
    this.getArticle(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getArticle(0)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})