// pages/treasury/treasury.js
import {Treasury} from 'treasury-model.js';
var WxParse = require('../../assets/wxParse/wxParse/wxParse.js');
var app = getApp();
var treasury = new Treasury();
var timeAwardGuide;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideCvtBox:true,//碎片合成分享弹窗
    guideHide:true,//引导弹窗
    hideFly:true,//飞入动画
    HeadBox:treasury.HeadBox,//宝库顶部图
    hideChip:true,//宝库碎片合成弹窗
    hideTicket:true,//宝库奖券信息弹窗
    ImgAward1:treasury.ImgAward1,

    WinImg:treasury.WinImg,

    wClicked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
    this._getShare()
    //宝库新手引导
    this._newGuideAward()
  },

  /*加载宝库数据*/
  _loadData:function(){
    var that = this;
    treasury.getAwardList((data)=>{
      if(data.err == 0){
      this.setData({
        chipData:data.data.chip,
        tips:data.data.tips
      })
      if(data.data.ticket){
        this.setData({
          ticketData:data.data.ticket
        })
      }
    }
  })
  },

  /*加载宝库分享数据*/
  _getShare:function(){
    var that =this;
    treasury.getShareConfig(6,(data)=>{
      if(data.err == 0){
        var back_url  = encodeURIComponent('/pages/index/index');
        that.setData({
          sharetitle:data.data.title,
          shareimg:data.data.imgurl,
          encode:data.data.encode,
          back_url:back_url
        })
    }
  })
  },

  /*加载物品信息*/
  rewardInfo:function(event){
    var that = this;
    var id = treasury.getDataSet(event, 'id');
    var index = this._getIndexByType(id,1)
    var typeData = this.data.chipData[index]
    that.setData({
      typeId:typeData['type'],
      typeImg: typeData['img'],
      convertText: typeData['num']+"/"+typeData['rate'],
      productInfo:typeData['pinfo'],
      hideChip: false
    })
  },
  /*根据奖券id得到 物品所在下标*/
  _getIndexByType: function (id, num) {
    if(num == 1){
      var data = this.data.chipData,
          len = data.length;
      for (let i = 0; i < len; i++) {
        if (data[i].type == id) {
          return i;
        }
      }
    }else{
      var data = this.data.ticketData,
          len = data.length;
      for (let i = 0; i < len; i++) {
        if (data[i].id == id) {
          return i;
        }
      }
    }
  },

  /*弹出奖券信息*/
  ticketInfo:function(event){
    var that = this;
    var id = treasury.getDataSet(event,'id')
    var index = this._getIndexByType(id,2)
    var typeData = this.data.ticketData[index]
    that.setData({
      ticketId:typeData['id'],
      ticketImg: typeData['img'],
      ticketInfo:typeData['name']+' 有效期至'+typeData['formate_etime'],
      hideTicket: false
    })
  },

  /*关闭合成弹窗*/
  closeChip:function(){
    this.setData({
      hideChip:true
    })
  },

  /*关闭奖券信息弹窗*/
  closeReward:function(){
    this.setData({
      hideTicket:true
    })
  },

  /*关闭分享弹窗*/
  closeShareWin:function(){
    this.setData({
      hideCvtBox:true
    })
  },

  /*宝库新手引导*/
  _newGuideAward:function(){
    var that = this
    var res = treasury.BaseGetStorageSync('box1guide')
    if (res) {
      //已经点过引导-do nothing
    } else {
      //没有点过引导-播动画
      that._newGuideComicAward()
    }
  },

  /*宝库引导动画*/
  _newGuideComicAward: function () {
    this._reloadGuideComicAward()
    var animationHelpAward = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease'
    })
    this.animation = animationHelpAward
    timeAwardGuide = setInterval(function () {
      animationHelpAward.scale(1.3, 1.3).step()
      animationHelpAward.scale(1, 1).step()
      this.setData({
        animationHelpAward: animationHelpAward.export()
      })
    }.bind(this), 900)
  },

  /*初始化宝库引导动画*/
  _reloadGuideComicAward:function(){
    var animationHelpAward = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease'
    })
    this.animation = animationHelpAward
    animationHelpAward.scale(1, 1).step()
    this.setData({
      animationHelpAward: animationHelpAward.export()
    })
  },

  /*引导弹窗*/
  _newGuideWin:function(){
    var that = this
    //请求弹窗数据
    treasury.getGuideType((data)=>{
      if(data.err == 0){
        //请求成功-保存缓存-停止动画
        treasury.BaseSetStorageSync('box1guide',true)
        that._delNewGuideComic1(timeAwardGuide)
        var content = data.data.guide.content
        data.data.guide.content = WxParse.wxParse('content','html',content,that,15);
        //弹窗展示
        that._showGuideWin()
      }
    })
  },

  /*删除宝库引导动画*/
  _delNewGuideComic1:function(){
    clearInterval(timeAwardGuide);
  },

  /*展示引导*/
  _showGuideWin:function(){
    this.setData({
      guideHide:false
    })
  },
  /*引导不展示*/
  _hideGuideWin:function(){
    this.setData({
      guideHide:true
    })
  },

  /*兑换碎片*/
  convertData:function(event) {
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      treasury._authCheckWin()
      return false
    }
    var that = this;
    //按钮失效
    that._disableButton()
    var id = treasury.getDataSet(event,'id')
    treasury.convertBox(id,(data)=>{
      if(data.err == 0){
      that.setData({
        hideChip:true,//关闭弹窗
        hiddenData:true,
        conBoxInfo:data.data.box
      })
      //震动手机
      that._longShake()
      //分享弹窗
      that._showConShareWin()
      //兑换成功-微信弹窗
      wx.showToast({
        title: "碎片兑换成功",
        icon: 'none',
        duration: 1000
      })
      //重载数据
      that._loadData()
    }
  });
  },

  /*弹出分享信息*/
  _showConShareWin:function() {
    var that = this
    var conBoxInfo = this.data.conBoxInfo
    //var congText = "恭喜您合成了"+conBoxInfo.pname + conBoxInfo.scsi_name+"一个"
    var congText = "恭喜您合成了奖励"
    var congText1 = conBoxInfo.wintip
    that.setData({
      hideCvtBox:false,//展示弹窗
      cvtText:congText,
      cvtText1:congText1,
      cvtImg:conBoxInfo.img
    })
  },


  /*添加动画震动反馈效果*/
  _longShake:function(){
    wx.vibrateLong()
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
    },2000)
  },

  /*跳转到购物车*/
  goCart:function(){
    wx.reLaunch({
      url: '/pages/shopping/shopping'
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
    app.playMusic('boxMusic')
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      //from button
      //合成数据
      var conBoxInfo = that.data.conBoxInfo
      var title = conBoxInfo.sharetip
      var imageUrl = conBoxInfo.img
      return {
        title: title,
        path: '/pages/login/login?encode=' + that.data.encode + '&back_url=' + that.data.back_url,
        imageUrl: imageUrl
      }
    } else {
      //from menu
      return {
        title: that.data.sharetitle,
        path: '/pages/login/login?encode='+that.data.encode+'&back_url='+that.data.back_url,
        imageUrl:that.data.shareimg
      }
    }
  }
})