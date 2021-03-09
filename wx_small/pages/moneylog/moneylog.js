// pages/moneylog/moneylog.js
import {MoneyLog} from "moneylog-model.js"
var moneylog = new MoneyLog()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p:1,//页码
    nextPage:1,//1有下一页0没有下一页
    MoneyData:[],
    NullImg:moneylog.NullImg,
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
    var MoneyData = that.data.MoneyData
    if (nextPage == 0) {
      //没有下一页
      wx.showToast({
        title: "没有更多记录",
        icon: 'none',
        duration: 2000
      })
      return false
    }
    moneylog.getMoneyLog(p,(data)=>{
      if(data.err == 0){
      p = p+1
      var nowData = MoneyData.concat(data.data.list)
      if(nowData.length == 0){
        that.setData({
          imageHide:false
        })
      }
      that.setData({
        p:p,
        MoneyData:nowData,
        nextPage:data.data.nextPage
      })
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
    this._loadData()
  }
})