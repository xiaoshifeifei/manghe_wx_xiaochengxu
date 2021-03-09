// pages/shopsmore/shopsmore.js
import {TagProducts} from "tagproducts-model.js"
var tagproducts = new TagProducts()
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    WaveImg:tagproducts.WaveImg,  
    p:1,
    isEnd:1,
    proData:[],
    ImgUrl:tagproducts.ImgUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t_id = this.options.t_id
    var type = this.options.type //type 0最新商品 1热门商品
    this.setData({
      t_id:t_id,
      type:type
    })   
    this.getProduct()
  },

  /*获取标签对应的商品列表*/
  getProduct:function(){
    var that = this
    var t_id = that.data.t_id
    var p = that.data.p
    var type = that.data.type
    var isEnd = that.data.isEnd
    if (isEnd == 0) {
      tagproducts.toastMsg("没有更多内容喽~")
      return false
    }
    var proData = that.data.proData
    tagproducts.getTagProducts(t_id,type,p,(data)=>{
      if(data.err == 0){
      var newData = proData.concat(data.data.list)
      wx.setNavigationBarTitle({
        title: data.data.title
      })
      that.setData({
        proData:newData,
        p:p+1,
        isEnd:data.data.nextPage,
        prosty:data.data.prosty
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
    //this.getProduct()
  },
  
   /*跳转详情页*/
  goLink:function(event){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      tagproducts._authCheckWin()
      return false
    }

    let link = tagproducts.getDataSet(event,'link')
    wx.navigateTo({
      url: link
    })
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
        this.getProduct()
  }
})