// pages/bargaindetail/bargaindetail.js
import {BargainDetail} from "bargaindetail-model.js"
var bargaindetail = new BargainDetail()
var WxParse = require('../../assets/wxParse/wxParse/wxParse.js');
import { Index } from '../index/index-model.js';
var index = new Index(); //实例化 首页 对象
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bargainHide:true,
    image42:bargaindetail.image42,
    wClicked:false,
    PriceImg:bargaindetail.PriceImg
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._closeShare()
    //砍价商品配置表id
    var id = options.id
    if(!id){
      return false
    }
    this._loadData(id)
  },
  onShow: function () {
    let isPhoneX = app.globalData.isIphoneX;
    if(isPhoneX){
      this.setData({
        bottom:'padding-bottom:20rpx'
      })
    }
  },
  /*关闭顶部share*/
  _closeShare:function(){
    wx.hideShareMenu();
  },
  //自定义分享内容
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var title = "就差你这一刀了，快来帮我砍价抢"+that.data.product.pname+"吧！"
      var imageUrl =  that.data.product.images.pic1
      var code = that.data.shareData.icode
      return {
        title: title,
        path: '/pages/bargainlog/bargainlog?sharecode=' + code,//分享标识
        imageUrl:imageUrl
      }
    }
  },
  /*加载数据*/
  _loadData:function(id){
    var that = this
    bargaindetail.getBargainDetail(id,(data)=>{
      wx.setNavigationBarTitle({
           title: data.data.product.pname 
       })
      if(data.err == 0){
        var content_images = data.data.product.content_images
        data.data.product.content_images = WxParse.wxParse('content_images','html',content_images,that,25);
        that.setData({
          product:data.data.product
        })
      }
    })
  },

  /*砍价弹窗展示*/
  shareWin: function (event) {
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      bargaindetail._authCheckWin()
      return false
    }
    //砍价活动配置商品id
    var actid = this.data.product['act_id']
    var id = this.data.product['id']

    index.getCutWin(actid,id,(data)=>{
      if(data.err == 0){
      console.log(data.data)
      this.setData({
        shareData:data.data.share,
        cutInfoData:data.data.info,
        bargainHide: false
      })
    }
  })
  },
  /*关闭弹窗*/
  closeWin:function(){
    this.setData({
      bargainHide: true
    })
  },
  /*已经买过了*/
  notBuy: function () {
    wx.showToast({
      title: "买过咯，限购一个哦",
      icon: 'none',
      duration: 2000
    })
  },

  /*去购买*/
  goBuy:function() {
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      bargaindetail._authCheckWin()
      return false
    }
    //判断库存
    var stock = this.data.product.stock
    if (stock == 0) {
      //库存不足
      wx.showToast({
        title: "库存不足，无法购买",
        icon: 'none',
        duration: 2000
      })
      return false
    }
    //被砍价后的商品生成待支付订单
   
    var par = {
        p_id:this.data.product.p_id,
        act_id:this.data.product.act_id,
        num:1,
        callback: function(data){
            var order_id = data.order_id;
            wx.navigateTo({
                   url: '../orderkj/orderkj?order_id='+order_id
            })    
        }
    }
    bargaindetail.getpreorder1(par); 
    
  },
  /*按钮点击失效*/
  _disableButton:function(){
    var that = this
    that.setData({
      wClicked:true
    })
    //按钮还原
    setTimeout(function(){
      that.setData({
        wClicked:false
      })
    },1000)
  }

})