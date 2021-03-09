// pages/wellist/wellist.js
import {Wellist} from "wellist-model.js"
var wellist = new Wellist()
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    WaveImg:wellist.WaveImg,
    imgurl1:wellist.ImgUrl1,
    PriceImg:wellist.PriceImg,
    NullImg:wellist.NullImg,
    wClicked:false,
    welfareHide:false,
    cutHide:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getWelfareList()
    this._getShare()
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
   *获取福利列表
   */
  _getWelfareList: function (callback) {
    let that = this
    wellist.getWelfare((data)=>{
      if(data.err == 0){
      that.setData({
        Lottery:data.data.lottery
      })
      callback && callback(1)
    }
  })
  },

  /*获取分享配置*/
  _getShare:function(){
    var that = this
    var type = 14;//0元抽页
    wellist.getShareConfig(type,(data)=>{
      if(data.err == 0){
      var back_url = encodeURIComponent('/pages/wellist/wellist');
      that.setData({
        sharetitle:data.data.title,
        shareimg:data.data.imgurl,
        encode:data.data.encode,
        back_url:back_url
      })
    }
  })
  },

  /**
   * 0元抢购详情
   */
  goDetail:function(event){
    let id = wellist.getDataSet(event,'id')
    wx.navigateTo({
      url: '../weldetail/weldetail?id='+id
    })
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this._getWelfareList((data)=>{
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      wx.showToast({
        title: '刷新成功',
        icon: 'none',
        duration: 1000
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //自定义分享内容
  onShareAppMessage: function (res) {
    var that = this
      //from menu
      return {
        title: that.data.sharetitle,
        path: '/pages/login/login?encode='+that.data.encode+'&back_url='+that.data.back_url,
        imageUrl:that.data.shareimg
      }
  }
})