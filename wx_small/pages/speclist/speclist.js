// pages/speclist/speclist.js
import { SpecList } from "speclist-model.js";
var speclist = new SpecList();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: 1,
    isEnd: 1,
    proData: [],
    type:0,
    BackImg:speclist.BackImg
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getSpecList(0);
  },

  //获取购买权码列表
  getSpecList: function (type) {
    var that = this
    let p = that.data.p
    let isEnd = that.data.isEnd
    if (isEnd == 0) {
      speclist.toastMsg("没有更多内容喽~")
      return false
    }
    let proData = that.data.proData
    speclist.getSpecList(p,(data) => {
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
    this.getSpecList(1);

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getSpecList(0);
  },

  /**
   *去详情 
   */
  godetail:function(event){
    let id = speclist.getDataSet(event,"id");
    wx.navigateTo({
      url: '../specdetail/specdetail?spec_id='+id
    })
  },

  /**
   *去详情 
   */
  golottery:function(event){
    let lot_id = speclist.getDataSet(event,"lotid");
    wx.navigateTo({
      url: '../weldetail/weldetail?id='+lot_id
    })
  },

   /**
   * 用户分享
   */
  // onShareAppMessage: function (event) {
  //   var that = this
  //   if(event.from === 'button'){
  //       //按钮点击分享
  //       let spec_id = event.target.dataset.specid
  //       let title = that.data.share_title
  //       let encode = that.data.encode
  //       // var img = that.data.Lottery.images.pic2
  //       let back_url = encodeURIComponent('/pages/specdetail/specdetail?spec_id='+spec_id)
  //       return {
  //         title: title,
  //         path: '/pages/login/login?encode='+encode+'&back_url='+back_url,
  //       }
  //   }else{
  //       //右上角分享
  //       let spec_id = event.target.dataset.specid
  //       let title = that.data.share_title
  //       let encode = that.data.encode
  //       // var img = that.data.Lottery.images.pic2
  //       let back_url = encodeURIComponent('/pages/specdetail/specdetail?spec_id='+that.data.spec_id)
  //       return {
  //         title: title,
  //         path: '/pages/login/login?encode='+encode+'&back_url='+back_url,
  //       }
  //   }
  // }
  
})