// pages/promoter/promoter.js
import {Promoter} from "promoter-model.js";
var promoter = new Promoter()
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proBar: [{id: 1, name: '附近'}, {id: 2, name: '全部'}],
    nowId: 1,
    p1: 1,//页码
    p2: 1,
    nextPage1: 1,//1有下一页0没有下一页
    nextPage2: 1,//1有下一页0没有下一页
    ProData1: [],
    ProData2: [],
    waveImg:promoter.waveImg,
    nearPro:false,
    allPro:true,
    showNone:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前位置
    this.getLocation()
    app.playMusic('backMusic');
  },
  onShow: function () {
    app.playMusic('backMusic');
  },

  switchTab:function(event){
    var id = promoter.getDataSet(event,'id')
    var nowId = this.data.nowId
    var that = this
    if(id == nowId){
      return false
    }
    var ProData = this.data["ProData" + id]
    if(id == 1){
      //所有数据
      if (ProData.length > 0) {
        that.setData({
          nowId: id,
          ProData1: ProData,
          nearPro: false,
          allPro: true
        })
        return false
      } else {
        this.setData({
          nowId: id,
          nearPro: false,
          allPro: true
        })
      }

    }else{
      //所有数据
      if (ProData.length > 0) {
        that.setData({
          nowId: id,
          ProData2: ProData,
          nearPro: true,
          allPro: false
        })
        return false
      } else {
        this.setData({
          nowId: id,
          nearPro: true,
          allPro: false
        })
        //加载所有门店数据
        that._loadData()
      }
    }
  },

  /**
   * 获取用户当前经纬度
   */
  getLocation:function(){
    var that = this
      wx.getLocation({
        type: 'wgs84',
        success (res) {
          const latitude = res.latitude
          const longitude = res.longitude
          const speed = res.speed
          const accuracy = res.accuracy
          that.setData({
            locate:res
          })
          that.getNear(latitude,longitude,5000)
        },
        fail(res){
          //展示手动获取位置弹窗
          that.setData({
            showNone:false
          })
        }
      })
  },

  getNear:function(lat,lng,dis){
    var that = this
    var p1 = this.data.p1
    var nextPage1 = that.data.nextPage1
    var ProData1 = that.data.ProData1
    if (nextPage1 == 0) {
      return false
    }
    promoter.getNearPromoterList(lat,lng,dis,p1,(data)=>{
      if(data.err == 0){
        var nowData1 = ProData1.concat(data.data.list)
        p1 = p1+1
        that.setData({
          p1:p1,
          ProData1:nowData1,
          nextPage1:data.data.nextPage
        })
      }
    })
  },

  /*loaddata*/
  _loadData:function(){
    var that = this
    var p2 = that.data.p2
    var nextPage2 = that.data.nextPage2
    var ProData2 = that.data.ProData2
    if (nextPage2 == 0) {
      //没有下一页
      wx.showToast({
        title: "没有更多内容",
        icon: 'none',
        duration: 1000
      })
      return false
    }
    promoter.getNewPromoterList(p2,(data)=>{
      if(data.err == 0){
        p2 = p2+1
        var nowData2 = ProData2.concat(data.data.list)
        that.setData({
          p2:p2,
          ProData2:nowData2,
          nextPage2:data.data.nextPage
        })
    }
  })
  },

  goDetail: function (event) {
    var id = promoter.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../promdetail/promdetail?id='+id
    })
  },

  /*在地图中查看位置*/
  getPosition:function(event) {
    var id = promoter.getDataSet(event,'id')
    var res = this._getLatLng(id)
    var latitude = Number(res.lat)
    var longitude = Number(res.lng)
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },
  
  /*循环获取经纬度*/
  _getLatLng: function (id) {
    var nowId = this.data.nowId
    if (nowId == 1) {
      var prolist = this.data.ProData1
    } else {
      var prolist = this.data.ProData2
    }
    for (let i = 0; i < prolist.length; i++) {
      if (prolist[i]['id'] == id) {
        console.log(prolist[i])
        return prolist[i]
      }
    }
  },

  /*重新请求授权*/
  handleSetting: function (e) {
    var that = this;
    if(!e.detail.authSetting['scope.userLocation']){
      wx.showModal({
        title: '提示',
        content: '若不打开授权，则无法显示附近门店！',
        showCancel: false
      })
    }else{
      //获取数据
      that.setData({
        showNone:true
      })
      that.getLocation()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var id = this.data.nowId
    if(id == 2){
      this._loadData()
    }
  }
})