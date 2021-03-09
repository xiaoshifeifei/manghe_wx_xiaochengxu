// pages/problem/problem.js
import { Problem } from "problem-model.js";
var problem = new Problem();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: 1,
    listData: []  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this._getProblemData();  
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

  _getProblemData() {
      var that = this;
      var p = that.data.p;
      problem.getProblemData(p, (data) => {
          if (data.err == 0) {
              var nowData = that.data.listData.concat(data.data.list)
              //设置数据
              that.setData({
                  p: p + 1,
                  listData: nowData,
                  isEnd: data.data.nextPage,
              })
          }
      })
  },

   /**
    * 页面上拉加载
    */
  onReachBottom: function () {
    //判断是否有下一页
    var is_end = this.data.isEnd;
    if (is_end == 0) {
        //没有下一页
        problem.toastMsg("没有更多记录喽~")
        return false
    }
    //加载数据
    this._getProblemData();
  },

  //下拉刷新
  onPullDownRefresh: function () {
      var that = this;
      wx.showNavigationBarLoading() //在标题栏中显示加载

      var that = this;
      var p = 1;
      problem.getProblemData(p, (data) => {

          if (data.err == 0) {
              that.setData({
                  listData: []
              })
              var nowData = that.data.listData.concat(data.data.list)

              //设置数据
              that.setData({
                  p: p + 1,
                  listData: nowData,
                  isEnd: data.data.nextPage
              })
          }
          // complete
          wx.hideNavigationBarLoading() //完成停止加载

          wx.stopPullDownRefresh() //停止下拉刷新
          wx.showToast({
              title: '刷新成功',
              icon: 'none',
              duration: 1000
          })
      })

  }

})