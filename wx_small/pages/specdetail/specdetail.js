// pages/specdetail/specdetail.js
import { SpecDetail } from "specdetail-model.js";
var specdetail = new SpecDetail();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    encode:0,
    spec_id:0,
    share_title:'快来抢购买权吧~~'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let spec_id = options.spec_id
    this.setData({
      spec_id: spec_id
    })
    this.getSpecDetail(spec_id);
  },

  //获取购买权码列表
  getSpecDetail: function (spec_id) {
    var that = this
    specdetail.getSpecDetail(spec_id,(data) => {
      if (data.err == 0) {
        var str = data.data.product.content_images;
        var str1 = data.data.spec.content;
        if(data.data.spec.close_share == 1){
          that._closeShare()
        }
        //关闭分享
        that.setData({
          dataInfo: data.data,
          encode:data.data.encode,
          share_title:data.data.share_title,
          html:str.replace(/\<img/g,'<img style="width:100%;height:auto;display:flex"'),
          html1:str1.replace(/\<img/g,'<img style="width:100%;height:auto;display:flex"'),
        })
      }
     
    })
  },

  /*关闭分享方法*/
  _closeShare:function(){
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },



  /**
   *去0元抽 
   */
  golottery:function(){
    let lot_id = this.data.dataInfo.spec.lot_id;
    wx.navigateTo({
      url: '../weldetail/weldetail?id='+lot_id
    })
  },

  /**
   * 用户分享
   */
  onShareAppMessage: function (event) {
    var that = this
    if(event.from === 'button'){
        //按钮点击分享
        let title = that.data.share_title
        let encode = that.data.encode
        // var img = that.data.Lottery.images.pic2
        let back_url = encodeURIComponent('/pages/specdetail/specdetail?spec_id='+that.data.spec_id)
        return {
          title: title,
          path: '/pages/login/login?encode='+encode+'&back_url='+back_url,
        }
    }else{
        //右上角分享
        let title = that.data.share_title
        let encode = that.data.encode
        // var img = that.data.Lottery.images.pic2
        let back_url = encodeURIComponent('/pages/specdetail/specdetail?spec_id='+that.data.spec_id)
        return {
          title: title,
          path: '/pages/login/login?encode='+encode+'&back_url='+back_url,
        }
    }
  }
  
})