// pages/bargainrecord/bargainrecord.js
import {BargainRecord} from "bargainrecord-model.js"
var bargainrecord = new BargainRecord()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p:1,//页码
    nextPage:1,//1有下一页0没有下一页
    BargainData:[],
    NullImg:bargainrecord.NullImg,
    imageHide:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
  },

  /*加载数据*/
  _loadData:function(){
    var that = this
    var p = that.data.p
    var nextPage = that.data.nextPage
    var BargainData = that.data.BargainData
    if (nextPage == 0) {
      //没有下一页
      wx.showToast({
        title: "没有更多记录",
        icon: 'none',
        duration: 2000
      })
      return false
    }
    bargainrecord.getBargainLog(p,(data)=>{
      if(data.err == 0){
      p = p+1
      var nowData = BargainData.concat(data.data.list)
      if(nowData.length == 0){
        that.setData({
          imageHide:false
        })
      }
      that.setData({
        p:p,
        BargainData:nowData,
        nextPage:data.data.nextPage
      })
    }
  })
  },
  goBargain:function(event) {
    var icode = bargainrecord.getDataSet(event,'id')
    wx.navigateTo({
      url: '../bargaining/bargaining?sharecode='+icode
    });
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
    this._loadData()
  }
})