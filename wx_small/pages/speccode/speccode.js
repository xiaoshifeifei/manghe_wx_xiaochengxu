// pages/speccode/speccode.js
import { SpecCode } from "speccode-model.js";
var speccode = new SpecCode();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: 1,
    isEnd: 1,
    proData: [],
    type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getSpecCode(0);
  },

  //获取购买权码列表
  getSpecCode: function (type) {
    var that = this
    let p = that.data.p
    let isEnd = that.data.isEnd
    if (isEnd == 0) {
      speccode.toastMsg("没有更多内容喽~")
      return false
    }
    let proData = that.data.proData
    speccode.getSpecCode(p,(data) => {
      if (data.err == 0) {
        var newData = proData.concat(data.data.list)
        that.setData({
          proData: newData,
          p: p + 1,
          isEnd: data.data.nextPage
        })
      }
      if(type==1){
        // complete
        wx.hideNavigationBarLoading() //完成停止加载

        wx.stopPullDownRefresh() //停止下拉刷新
        wx.showToast({
            title: '刷新成功',
            icon: 'none',
            duration: 1000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      proData: [],
      p: 1,
      isEnd:1
    })
    this.getSpecCode(1);

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getSpecCode(0);
  },
})