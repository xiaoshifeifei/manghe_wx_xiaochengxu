// pages/mecode/mecode.js
import {MeCode} from "mecode-model.js"
var mecode = new MeCode()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p:1,//页码
    nextPage:1,//1有下一页0没有下一页
    VerifyData:[],
    NullImg:mecode.NullImg,
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
    var VerifyData = that.data.VerifyData
    if (nextPage == 0) {
      //没有下一页
      wx.showToast({
        title: "没有更多记录",
        icon: 'none',
        duration: 2000
      })
      return false
    }
    mecode.getCodeLog(p,(data)=>{
      if(data.err == 0){
      p = p+1
      var nowData = VerifyData.concat(data.data.list)
      if(nowData.length==0){
        //设置为空
        that.setData({
          imageHide:false
        })
      }
      that.setData({
        p:p,
        VerifyData:nowData,
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