// pages/shop/shop.js
import {Shops} from "shops-model.js"
var shops = new Shops()
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: 1,
    isEnd: 1,
    shopData:[],
    WaveImg:shops.WaveImg
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
  },

  _loadData: function () {
    var that = this
    var p = that.data.p
    var isEnd = that.data.isEnd
    if (isEnd == 0) {
      shops.toastMsg("没有更多内容喽~")
      return false
    }
    var shopData = that.data.shopData
    shops.getShops(p,(data)=>{
      if(data.err == 0){
        var newData = shopData.concat(data.data.list)
        that.setData({
          shopData:newData,
          p:p+1,
          isEnd:data.data.nextPage
        })
      }
    })
  },

  /*店铺详情*/
  _shopDetail:function(event){
    var id = shops.getDataSet(event,'id')
    wx.navigateTo({
      url: '../shop/shop?id='+id
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
    app.playMusic('backMusic')
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
    this._loadData()
  }
})