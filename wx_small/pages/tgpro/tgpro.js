// pages/tgpro/tgpro.js
import {TgPro} from "tgpro-model.js"
var tgpro = new TgPro();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tgBar: [{id: 1, name: '设置'},{id: 3, name: '活动'},{id: 2, name: '明细'}],
    nowId:1,

    p0:1,
    nextPage0:1,
    baseData:[],

    p:1,
    nextPage:1,
    orders:[],
    hideTop:true,
    hideDelete:true,
    top_txt:"是否确认置顶该商品？",

    p1:1,
    nextPage1:1,
    activitys:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.nowId==3){
      this.setData({
        nowId:3,
        p1:1,
        nextPage1:1,
        activitys:[]
      })
      this._activityList(0);
    }else{
      //加载公告信息
      this._loadNotice()  
    }
    
  },

  /*切换tab*/
  switchTab:function(event){
    var nowId = this.data.nowId,that=this,id=parseInt(tgpro.getDataSet(event,'id'))
    if(nowId == id){
      return false
    }
    if(id == 1){
      //设置页
      that.setData({
        nowId:1
      })
    }else if(id == 2){
      //明细页
      that.setData({
        nowId:2
      })
      //判断是否需要加载数据
      if(!this.data.yearData){
        //加载年度数据
        this._loadYear()
        //加载订单数据
        this._loadOrder(0)
      }
    }else if(id == 3){
      //活动
      that.setData({
        nowId:3,
        p1:1,
        nextPage1:1,
        activitys:[]
      })
      that._activityList(0);
    }
  },
  /*获取活动列表*/
  _activityList:function(type){
    let that = this,p1=this.data.p1,nextPage1=this.data.nextPage1,activitys=this.data.activitys
    if (type == 1) {
      //上拉加载
      if (nextPage1 == 0) {
        tgpro.toastMsg("没有更多内容了哦~")
        return false
      }
    }
    tgpro.getActivityList(p1,(data)=>{
      if(data.err == 0){
        var nowData = activitys.concat(data.data.list)
        that.setData({
          activitys:nowData,
          p1:p1+1,
          nextPage1:data.data.nextPage
        })
      }
    })
  },

  /*获取公告信息*/
  _loadNotice:function(){
    var that = this
    tgpro.getInfo((data)=>{
      if(data.err == 0){
        that.setData({
          info:data.data.info
        })
      }
    })
  },

  /*获取当前页面商品的信息*/
  _loadPro: function (type) {
    var that = this,p0=this.data.p0,nextPage0=this.data.nextPage0,baseData=this.data.baseData
    if (type == 1) {
      //上拉加载
      if (nextPage0 == 0) {
        tgpro.toastMsg("没有更多内容了哦~")
        return false
      }
    }
    tgpro.getSelfPro(p0,(data)=>{
      if(data.err == 0){
        var nowData = baseData.concat(data.data.list)
        that.setData({
          baseData:nowData,
          p0:p0+1,
          nextPage0:data.data.nextPage
        })
      }
    })
  },

  /*获取资金明细页年度信息*/
  _loadYear:function(){
    var that = this
    tgpro.getYearData((data)=>{
      if(data.err == 0){
        that.setData({
          yearData:data.data.info
        })
      }
    })
  },

  /*获取资金明细*/
  _loadOrder: function (type) {
    var that = this,p=this.data.p,nextPage=this.data.nextPage,orders=this.data.orders
    if(type=1){
      //上拉加载
      if(nextPage == 0){
        tgpro.toastMsg("没有更多内容了哦~")
        return false
      }
    }
    //加载数据
    tgpro.getMoneyLog(p,(data)=>{
      if(data.err == 0){
        var nowData = orders.concat(data.data.list)
        that.setData({
          orders:nowData,
          p:p+1,
          nextPage:data.data.nextPage
        })
      }
    })
  },

  /*input失去焦点-获取内容*/
  getInputData:function(event){
    var value = event.detail.value
    if(!value || !value.trim()){
      tgpro.toastMsg("带货通知信息不能为空哦~")
      return false
    }
    //判断当前内容是否与原始内容相同
    var old = this.data.baseData.notice
    value = value.trim()
    if(value == old){
      return false
    }
    //更新通知
    this._setNotice(value)
  },

  /*设置通知*/
  _setNotice:function(notice){
    var that = this
    tgpro.setNotice(notice,(data)=>{
      if(data.err == 0){
        tgpro.toastMsg(data.data)
      }
    })
  },

  /*置顶*/
  _setTop:function(event){
    var id = tgpro.getDataSet(event,'id'),top = tgpro.getDataSet(event,'top'),top_txt,that = this
    if(top == 0){
      top_txt = "是否确认置顶该商品？";
    }
    if(top == 1){
      top_txt = "是否确认取消置顶该商品？";
    }
    wx.showModal({
      title: '系统提示',
      content: top_txt,
      success(res){
        if(res.confirm){
          //删除接口
          that._dealTop(id)
        }
      }
    })

  },

  /*置顶或非置顶方法*/
  _dealTop:function(id){
    var that = this
    tgpro.dealTop(id,(data)=>{
      if(data.err == 0){
        tgpro.toastMsg(data.data.msg)
        //重置数据为空
        that._restBaseData()
        that._loadPro(0)
      }
  })
  },

  /*置顶弹窗展示不展示*/
  toggleTop:function(){
    this.setData({
      top_txt:this.data.top_txt,
      hideTop:!this.data.hideTop
    })
  },

  /*取消推广*/
  _deleteTg:function(event){
    var id = tgpro.getDataSet(event,'pid'),that = this;
    wx.showModal({
      title: '系统提示',
      content: '是否确认删除该商品？',
      success(res){
        if(res.confirm){
          //删除接口
          that._dealDelete(id)
        }
      }
    })
  },

  /*取消推广方法*/
  _dealDelete:function(id){
    var that = this
    tgpro.cancelTg(id,(data)=>{
      if(data.err == 0){
      tgpro.toastMsg(data.data.msg)
      that._restBaseData()
      that._loadPro(0)
    }
  })
  },

  /*置顶弹窗展示不展示*/
  toggleDelete:function(){
    this.setData({
      hideDelete:!this.data.hideDelete
    })
  },

  /*操作完成置空数据*/
  _restBaseData:function(){
        this.setData({
          p0:1,
          nextPage0:1,
          baseData:[]
        })
  },

  //跳转到选品页
  goChoose:function(){
    wx.navigateTo({
      url: '/pages/tgchoose/tgchoose',
    })
  },

  //跳转到添加随机立减活动
  addActivity:function(){
    wx.navigateTo({
      url: '/pages/activityadd/activityadd',
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
    var curPages =  getCurrentPages();
    var currentPage = curPages[curPages.length-1].options;
    if(currentPage.nowId==3){

    }else{
      this._restBaseData()
      this._loadPro(0)  
    }
    
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
    //下拉刷新
    if(this.data.nowId == 1){

    }
    if(this.data.nowId == 2){

    }
    if(this.data.nowId == 3){
      this.setData({
        p1:1,
        nextPage1:1,
        activitys:[]
      })
      this._activityList(0);
    }
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.nowId == 1){
      this._loadPro(1)
    }
    if(this.data.nowId == 2){
      this._loadOrder(1)
    }
  }
})