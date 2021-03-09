// pages/welfare/welfare.js
import {Welfare} from "welfare-model.js"
var welfare = new Welfare()
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proBar: [{id: 1, name: '0元抽奖'}, {id: 2, name: '好友砍价'}],
    nowId: 1,
    WaveImg:welfare.WaveImg,
    imgurl1:welfare.ImgUrl1,
    PriceImg:welfare.PriceImg,
    NullImg:welfare.NullImg,
    IconUrl:welfare.IconUrl,
    bargainHide:true,
    wClicked:false,
    welfareHide:false,
    cutHide:true,
    cutList:null,
    count:false,
    c_style:'display:none;'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getWelfareList()
    //热门活动
    this._getHotList()
    //分享配置
    this._getShare()
  },

  /*获取热门活动*/
  _getHotList:function(){
    var that = this
    var p = this.data.p
    welfare.getSpecialList((data)=>{
      if(data.err == 0){
        //设置数据
        that.setData({
          showdata: data.data.list,
          img_size:data.data.img_size
        })
    }
  });
  },

  touchimg:function(event){
    var  url = welfare.getDataSet(event, 'url');
    var  topic_img = welfare.getDataSet(event, 'topicimg');
    var  link_type = welfare.getDataSet(event,'linktype');
    this.setData({
      c_style:'display:block;',
      url:url,
      topic_img:topic_img,
      link_type:link_type
    })
  },

  gowhere: function(event){
    var url = welfare.getDataSet(event,'url');
    var link_type = welfare.getDataSet(event,'linktype');
    this.setData({
      c_style:'display:none;'
    });
    if(link_type==0){
      wx.navigateTo({
        url: url
      })
    }else{
      wx.switchTab({
        url: url
      })
    }
    
  },

  //关闭活动宣传弹框
  cloose_coupon:function(event){
    this.setData({
      c_style:'display:none;'
    });
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
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    app.playMusic('backMusic')
  },

  /*切换tab*/
  switchTab:function(event){
    let id = welfare.getDataSet(event,'id')
    let nowId = this.data.nowId
    let that = this
    if(id == nowId){
      return false
    }
    if (id == 1) {
      //福利列表
      that.setData({
        nowId:1,
        welfareHide:false,
        cutHide:true,
      })
      that._getWelfareList()
    }else if(id ==2){
      //砍价列表
      that.setData({
        nowId:2,
        welfareHide:true,
        cutHide:false,
      })
      that._getCutList()
    }
  },

  /**
  *获取福利列表
  */
  _getWelfareList: function (type) {
    let that = this
    if(type==1){
      wx.showNavigationBarLoading() //在标题栏中显示加载
    }
    welfare.getWelfare((data)=>{
      if(data.err == 0){
        that.setData({
          Lottery:data.data.lottery
        })
        if (type == 1) {
          // complete
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
          welfare.toastMsg("刷新成功")
        }
      }
    })
  },

  /*获取分享配置*/
  _getShare:function(){
    var that = this
    var type = 14;//首页
    welfare.getShareConfig(type,(data)=>{
      if(data.err == 0){
        var back_url = encodeURIComponent('/pages/welfare/welfare');
        that.setData({
          sharetitle:data.data.title,
          shareimg:data.data.imgurl,
          encode:data.data.encode,
          back_url:back_url
        })
    }
  })
  },

    /**
     * 0元抢购详情
     */
    goDetail:function(event){
      let id = welfare.getDataSet(event,'id')
      wx.navigateTo({
        url: '../weldetail/weldetail?id='+id
      })
    },

  /*获取砍价列表*/
  _getCutList:function(type){
    var that = this;
    if(type==1){
      wx.showNavigationBarLoading() //在标题栏中显示加载
    }
    welfare.getCutProduct((data)=>{
      if(data.err == 0){
      var prosty = null
      if(parseInt(data.data.product.length)%2 == 1){
        prosty = parseInt(data.data.product.length) - 1
      }
      that.setData({
        actInfo:data.data.act,
        cutList:data.data.product,
        prosty:prosty
      })
      if(that.data.count == false){
        that._countTime(data.data.act['ltime'])
      }
      if (type == 1) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        welfare.toastMsg("刷新成功")
      }
    }
  })
  },

  /*砍价活动倒计时*/
  _countTime: function (count) {
    var that = this
    //计算当前天数小时数、分钟数、秒数
    var day = Math.floor(count/86400)
    if(day<10){
      day = 0+day.toString()
    }
    //console.log(day)
    var hour = Math.floor((count%86400)/3600);
    if(hour<10){
      hour = 0+hour.toString()
    }
    //console.log(hour)
    var minute = Math.floor(((count%86400)%3600)/60);
    if(minute<10){
      minute = 0+minute.toString()
    }
    //console.log(minute)
    var second = ((count%86400)%3600)%60;
    if(second<10){
      second = 0+second.toString()
    }
    if(count == 0){
      that.setData({
        day:'00',
        hour: '00',
        minute:'00',
        second:'00',
        listHide:true
      })
      welfare.toastMsg("砍价活动已结束")
      return
    }
    that.setData({
      day:day,
      hour: hour,
      minute:minute,
      second:second,
      count:true
    })
    setTimeout(function () {
      count--;
      that._countTime(count);
    }, 1000);
  },
  /*砍价弹窗关闭*/
  closeWin:function(){
    this.setData({
      bargainHide:true
    })
  },
  /*砍价弹窗展示*/
  shareWin: function (event) {
    if(!app.globalData.isSetting || !app.globalData.is_bind_iphone){
      welfare._authCheckWin()
      return false
    }
    //砍价活动配置商品id
    var actid = this.data.actInfo.id
    var id = welfare.getDataSet(event, 'id')
    welfare.getCutWin(actid,id,(data)=>{
      if(data.err == 0){
      this.setData({
        shareData:data.data.share,
        cutInfoData:data.data.info,
        bargainHide: false
      })
    }
  })
  },
  /*砍价商品详情*/
  toBargainDetail:function(event)
  {
    var id = welfare.getDataSet(event,'id')
    wx.navigateTo({
      url: '../bargaindetail/bargaindetail?id='+id
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
    //获取当前页面的nowId
    var nowId = this.data.nowId
    if (nowId == 1) {
      //0元抽奖
      this._getWelfareList(1)
    } else if (nowId == 2) {
      //好友砍价
      this._getCutList(1)
    }
    //获取轮播图
    this._getHotList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //自定义分享内容
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var id = res.target.dataset['id']
      //获取商品图片&商品名称
      var info = that._getProductItem(id)
      var title =  "就差你这一刀了，快来帮我砍价抢"+info['info']['pname']+"吧！"
      var imageUrl = info['info']['images']['pic1']
      var code = that.data.shareData.icode
      return {
        title: title,
        path: '/pages/bargainlog/bargainlog?sharecode=' + code,//分享标识
        imageUrl:imageUrl
      }
    }else{
      //from menu
      return {
        title: that.data.sharetitle,
        path: '/pages/login/login?encode='+that.data.encode+'&back_url='+that.data.back_url,
        imageUrl:that.data.shareimg
      }
    }
  },
  _getProductItem: function (id) {
    var cutList = this.data.cutList
    for (let i = 0; i < cutList.length; i++) {
      if(cutList[i]['id'] == id){
        return cutList[i]
      }
    }
  },
})