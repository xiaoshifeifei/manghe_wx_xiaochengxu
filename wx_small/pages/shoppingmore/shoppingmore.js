// pages/shoppingmore/shoppingmore.js
import {Shoppingmore} from "shoppingmore-model.js";
import {Address} from '../../utils/address.js';
var shoppingmore = new Shoppingmore();
var address = new Address();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payWin:true,
    hideWindow:true,
    addressInfo:null,
    errData:null,
    wClicked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //回传数据
    try{
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('acceptDataShoppingMore', {data: 'hide'});
    }catch (e){
      console.log("err"+e)
    }

    this.data.selectedIds = options.selectIds
    this._loadData()

    //判断是否是iphonex
    let isPhoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX:isPhoneX
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //从缓存中获取选择id
    var id = this.getStorageId()
    var that = this
    if(id){
      //获取对应id的收货地址
      this.getOneAddress(id)
      //清除缓存
      //this.removeCache('addressId')
    }
  },
  onUnload:function(){
    //清除address缓存
    this.removeCache('addressId')
  },
/*加载数据*/
  _loadData: function(callback) {
    var that = this;
    /*获取默认收货地址*/
    address.getDefaultAddress((data)=>{
      that.setData({
      addressInfo:data.data.address
      })
    })
    /*获取订单数据*/
    var selectIds = this.data.selectedIds;
    shoppingmore.getPostageOrder(selectIds,(data)=>{
      if(data.err == 0){
        that.setData({
          shopData:data.data.shop,
          scoreData:data.data.score,
          rewardData:data.data.reward,
          inviteData:data.data.invite,
          artData:data.data.art,
          totalData:data.data.counts,
          totalPostage:data.data.totalpostage
        })
      }
    })
  },
  /*跳转到收货地址列表*/
  getAddressList:function(){
    wx.navigateTo({
      url: '../shopaddress/shopaddress'
    })
  },
  /*从缓存中获取id*/
  getStorageId:function()
  {
    var that = this;
    try {
      var value = wx.getStorageSync('addressId')
      if (value) {
        return value
      }
    } catch (e) {
      // 获取默认收货地址
    }
  },
  /*根据id获取收货地址*/
  getOneAddress:function(id)
  {
    var that = this;
    address.getOneAddress(id, (data) => {
    that.setData({
      addressInfo: data.data.address
    })
  })
  },
  /*清除对应key的缓存*/
  removeCache:function(key)
  {
    try {
      wx.removeStorageSync(key)
    } catch (e) {
      // Do something when catch error
    }
  },
  /*支付邮费并且下单*/
  payPostage:function()
  {
    this._disableButton()
    var that = this;
    var selectIds = this.data.selectedIds;
    if (this.data.addressInfo == null) {
      shoppingmore.toastMsg("请添加收货地址");
      return false;
    }
    var addressId = this.data.addressInfo.id
    //判断是否存在邮费-判断支付方式开启状态-弹窗
    var totalPostage = that.data.totalPostage
    if (totalPostage > 0) {
      //存在邮费
      that._payMethod()
      return false
    }
    this.toastPostage(selectIds,addressId,that)
  },
  /*扣邮费*/
  nowPayPostage:function(selectIds,addressId)
  {
    this._disableButton()
    var that = this
    shoppingmore.payPostage(selectIds, addressId, (data) => {
      that.setData({
      errData: data
    })
    if (data.err == 1014) {
      //that.goToUp()
    }
    if (data.err == 0) {
      that.setData({
        hideWindow:false
      })
    }
  })
  },
  /*弹窗提示邮费*/
  toastPostage:function (selectIds,addressId,that) {
    var totalPostage = that.data.totalPostage;
    wx.showModal({
      title: '提示',
      content: "是否确认下单？",
      success: function (res) {
        if (res.confirm) {
        that.nowPayPostage(selectIds,addressId)
        } else if (res.cancel) {

        }
      }
    })
  },
  /*弹窗&跳转*/
  goToUp:function() {
    wx.showModal({
      title: '提示',
      content: '余额不足，前往充值？',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../topup/topup?from=2'
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /*跳转到我的订单页面*/
  goOrder: function () {
    wx.redirectTo({
      url: '../allorder/allorder?nowIndex=1'
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

  /*关闭弹窗*/
  close_pay: function () {
    this.setData({
      payWin: true
    })
  },

  /*选择支付邮费方式弹窗*/
  _payMethod:function(){
    var that = this;
    /*获取支付配置*/
    shoppingmore.getPayConfig((data)=>{
      if(data.err == 0){
        var blpay = data.data.blpay, wxpay = data.data.wxpay, blStyle = false, wxStyle = false, payType = 0,money = data.data.money;
        //if (blpay == 1) {
        //  //余额支付开启
        //  blStyle = true;
        //  payType = 1;//余额支付方式
        //} else if (blpay == 0) {
        //  //余额支付未开启-判断微信支付是否开启
        //  if (wxpay == 1) {
        //    wxStyle = true;
        //    payType = 2;//微信支付方式
        //  }
        //}
      if (wxpay == 1) {
        //微信支付开启
        wxStyle = true;
        payType = 2;//微信支付方式
      } else if (wxpay == 0) {
        //微信支付未开启-判断余额支付是否开启
        if (blpay == 1) {
            blStyle = true;
            payType = 1;//余额支付方式
        }
      }
        that.setData({
           blPay:blpay,
           wxPay:wxpay,
           blStyle:blStyle,
           wxStyle:wxStyle,
           payWin:false,
           payType:payType,
           money:money
        })
     }
   })
  },

  /*选择支付方式*/
  _chooseType:function(event){
    var id = shoppingmore.getDataSet(event,'id');
    if (id == 1) {
      this.setData({
        wxStyle:false,
        blStyle:true,
        payType: 1
      })
    }
    if (id == 2) {
      this.setData({
        wxStyle:true,
        blStyle:false,
        payType: 2
      })
    }
  },

  /*确认下单*/
  _goPay:function(){
    var selectIds = this.data.selectedIds;
    var addressId = this.data.addressInfo.id
    //支付类型
    var paytype = this.data.payType;
    if(paytype == 1){
      //走余额支付流程
      this.close_pay();//关闭选择窗
      this.nowPayPostage(selectIds,addressId)
    }else if(paytype == 2){
      //走微信支付流程
      this.close_pay();//关闭选择窗
      this._wxPay(selectIds, addressId, paytype)
    }
  },

  /*微信支付*/
  _wxPay: function (selectIds, addressId) {
      this._disableButton()
      this._showLoading()
      var that = this
      shoppingmore.wxPayPostage(selectIds,addressId,(data)=>{
          if(data == 2){
            //支付成功-弹窗-跳转到物流订单列表
            that.setData({
              hideWindow:false
            })
          }else{
            //支付失败->直接跳转到待支付物流订单
            wx.showToast({
              title: "订单支付失败",
              icon: 'none',
              duration: 1000
            })
            setTimeout(function(){
              that.goOrder()
            },1000)
          }
      })
  },

  //donothing
  _doNothing: function () {
    //空function
  },

  //微信小程序loading
  _showLoading:function(){
    wx.showLoading({
      title: '支付中...'
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 3000)
  }
})