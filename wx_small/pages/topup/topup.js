// pages/topup/topup.js
import {Topup} from "topup-model.js";
var topup = new Topup();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popFlag: true,
    cMoney: 0.00,
    mMoney: 0.00,
    mScore: 0,
    payConfig: null,
    payId:0,
    wClicked:false,
    is_show:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var fromId = options.from
    if(typeof (fromId) == "undefined"){
      fromId = 0
    }
    this.setData({
      fromId:fromId
    })
    this._load();
  },
  /*加载充值列表*/
  _load:function(){
    var that = this;
    topup.getChargeList((data)=>{
      if(data.err == '0'){
      that.setData({
        mMoney: data.data.money,
        mScore: data.data.score,
        payConfig:data.data.pay_config,
        imgurl1:topup.ImgUrl1,
        is_show:data.data.is_show
      })
      if(data.data.is_show==1){
        wx.setNavigationBarTitle({
          title: data.data.title    
        })

        wx.setNavigationBarColor({
          frontColor: '#ffffff', // 必写项
          backgroundColor: data.data.color,
        })  
      }
      
    }
  })
  },
  /*选择充值*/
  goCharge:function(event)
  {
    var id = topup.getDataSet(event,'id')
    var money = topup.getDataSet(event,'money')
    this.setData({
      payId: id,//充值id
      cMoney: money,
      popFlag: false
    })
  },
  /*去充值*/
  goPay: function () {
    this._disableButton()
    var that = this
    var id = this.data.payId
    topup.goPreOrder(id,(data)=>{
      //充值成功回调刷新
        if(data == 2){
          //支付成功-关闭弹窗、刷新余额、返回上一层待支付订单
          that.closeWindow()
          that.reGetBalance(that)
          that._backFirstPage()
        }else if(data == 1){
          //支付失败&用户取消支付
          wx.showToast({
            title: "支付失败",
            icon: 'none',
            duration: 2000
          })
       }
    })
  },
  /*倒计时返回到上一页*/
  _backFirstPage:function(){
    var that = this
    var fromId = this.data.fromId
    wx.showToast({
      title: "充值成功",
      icon: 'none',
      duration: 2000
    })
    if(fromId == 2 || fromId == 3){
      that._confirmBack()
    }
  },
  /*充值完成弹窗返回*/
  _confirmBack:function(){
    wx.showModal({
      title: '提示',
      content: '充值完成，返回待支付订单',
      showCancel:false,
      success (res) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  /*重新获取余额*/
  reGetBalance:function(that) {
    topup.getNewBalance((data)=>{
      if(data.err == 0){
        that.setData({
          mMoney: data.data.money,
          mScore: data.data.score,
        })
      }
    })
  },
  /*关闭窗口*/
  closeWindow:function()
  {
    this.setData({
      popFlag:true
    })
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
  },
  /*余额明细*/
  moneyLog:function(){
    wx.navigateTo({
      url: '../moneylog/moneylog'
    })
  },
  /*积分明细*/
  scoreLog:function(){
    wx.navigateTo({
      url: '../scorelog/scorelog'
    })
  }
})