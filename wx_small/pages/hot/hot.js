// pages/hot/hot.js
import {Hot} from "hot-model.js";
var hot = new Hot();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      p:1,
      isEnd:1,
      listData:[],
      loadingHidden: false,
      PageBackImg:hot.PageBackImg
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  _loadData: function () {
    var that = this
    var p = this.data.p
    hot.getHotList(p,(data)=>{
      if(data.err == 0){
      var nowData = that.data.listData.concat(data.data.list)
      console.log(nowData)
      //设置数据
      that.setData({
        p: p + 1,
        listData: nowData,
        isEnd: data.data.nextPage,
        loadingHidden: true
      })
    }
    });
  }
})