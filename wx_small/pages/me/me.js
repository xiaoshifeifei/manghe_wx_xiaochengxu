//index.js
import {Me} from "me-model.js";
var me = new Me();
var app = getApp();
Page({
  data: {
    MCount:0,
    Count0:0,
    Count2:0,
    Count4:0,
    MMoney:0.00,
    MScore:0,
    loadingHidden: false,
    musicCheck:false,
    sharetitle:'',
    shareimg:'',
    encode:'',
    back_url:'',
    Mname:'点击登录',
    HeadImg:me.HeadImg,
    showNone:true,
    imgurl1:me.ImgUrl1,
    is_tg:0,
    dh_nums:0,
    year_money:0,
    tg:0,
    OrderCount:0,
    CodeCount:0,
    TicketCount:0
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
      })
    }
    app.playMusic('backMusic');
    //未授权-不调接口
    if (app.globalData.isSetting && app.globalData.is_bind_iphone) {
      this._loadData()
      this.setData({
        showNone: false
      })
    }
    //检查音乐状态
    this.checkMusic()
  },
  onLoad: function () {
    //this._loadData()
    app.playMusic('backMusic')
    this._loadBaseData()
  },

  /*加载基本信息*/
  _loadBaseData:function(){
    var that = this
    me.getBaseConfig((data)=>{
      if(data.err == 0){
        that.setData({
          configData:data.data
        })
      }
    })
  },

  _loadData: function () {
    var that = this;
    me.getBaseInfo((data)=>{
    if(data.err == 0){
      //授权前-特殊逻辑
      that.setData({
        MCount:data.data.count,
        Count0:data.data.count0,
        Count2:data.data.count2,
        Count4:data.data.count4,
        MMoney:data.data.money,
        MScore:data.data.score,
        is_tg :data.data.is_tg,
        dh_nums :data.data.dh_nums,
        year_money :data.data.year_money,
        OrderCount:data.data.order_count,
        CodeCount:data.data.code_count,
        TicketCount:data.data.tickets_count
      })
      if(data.data.is_tg==1){
        that.setData({
          tg: data.data.tg
        })  
      }
    }
    that.setData({
      loadingHidden: true
    })
    })
  },

  expressList: function (event) {
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
   var id =  me.getDataSet(event,"id");
    wx.navigateTo({
      url: '../allorder/allorder?nowIndex='+id
    })
  },
  
  orderList: function (event) {
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
   var id =  me.getDataSet(event,"id");
    wx.navigateTo({
      url: '../orderlist/orderlist?nowIndex='+id
    })
  },

  goHomePage:function(){

    //去个人主页
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '../myhome/myhome?tg='+this.data.tg
    })
  },
  
  goAddressList: function () {
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '../address/address'
    })
  },
  topUp:function(){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
    //检查余额支付开关
    me.getPayClose((data)=>{
      if(data.err == 0 && data.data.mepay == 1){
        wx.navigateTo({
          url: '../topup/topup?from=1'
        })
      }
    })
  },
  //去我的余额
  toBalance:function(){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
    //去我的余额
    wx.navigateTo({
      url: '../balance/balance'
    })
  },

  /*跳转到砍价列表*/
  bargainList:function(){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '../bargainrecord/bargainrecord'
    })
  },
  /*跳转开盒记录*/
  logBox:function(){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '../boxlog/boxlog'
    })
  },
  /*跳转奖励记录*/
  logList:function(){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '../mylog/mylog'
    })
  },
  /*跳转到正品验证记录*/
  codeList: function () {
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '../mecode/mecode'
    })
  },

  /*跳转到宝库*/
  goTreasury:function(){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '../treasury/treasury'
    })
  },

  /*检查缓存是否关闭*/
  checkMusic:function(){
    var res = app._checkCloseMusic()
    var type
    if(res){
      type = false
    }else{
      type = true
    }
    this.setData({
      musicCheck:type
    })
  },
  /*音乐开关*/
  musicChange:function(e){
    var res = e.detail.value
    if(res == true){
      //打开音乐
      app._btnOpenMusic()
    }else if(res == false){
      //关闭音乐
      app._btnCloseMusic()
    }
  },
  /*跳转到我的积分*/
  /*积分明细*/
  scoreLog:function(){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '../scorelog/scorelog'
    })
  },

  /*跳转到优惠券*/
  goTicket:function(){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '../coupons/coupons'
    })
  },

  /*跳转到获取的购买权码列表*/
  goSpecCode:function(){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '../speccode/speccode'
    })
  },

  /*点击登录*/
  nameGoAuth:function(){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      me._authCheckWin()
      return false
    }
  },

  /*跳转帮助文档*/
  mehelp:function(event){
    var type = me.getDataSet(event,'type');
    wx.navigateTo({
      url: '../mehelp/mehelp?type='+type
    })
  },

  /*跳转到更多设置*/
  meSet:function(){
    wx.navigateTo({
      url: '../meset/meset'
    })
  }
})
