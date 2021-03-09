// pages/coupons/coupons.js
import {Coupons} from "coupons-model.js"
var coupons = new Coupons()
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proBar: [{id: 1, name: '代金券'}, {id: 2, name: '满减券'}],
    nowId: 1,
    p1: 1,
    p2: 1,
    isEnd1: 1,
    isEnd2: 1,
    Tickets1:[],
    Tickets2:[],
    BackImg:coupons.BackImg
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this._loadTicket(1)
  },

  /*切换tab*/
  switchTab:function(event){
    let id = parseInt(coupons.getDataSet(event, 'id'))
    let nowId = this.data.nowId
    let that = this
    if (id == nowId) {
      return false
    }
    if (id == 1) {
      //代金券
      var Tickets1 = that.data.Tickets1
      if(Tickets1.length>0){
        that.setData({
          nowId: 1,
          Tickets:Tickets1
        })
        return false
      }else{
        if(that.data.isEnd1 == 0){
          //没有内容
          that.setData({
            nowId: 1,
            Tickets:Tickets1
          })
          return false
        }
      }
      that._loadTicket(1)
    } else if (id == 2) {
      //满减券
      var Tickets2 = that.data.Tickets2
      if(Tickets2.length>0){
        that.setData({
          nowId: 2,
          Tickets:Tickets2
        })
        return false
      }else{
        if(that.data.isEnd2 == 0){
          //没有内容
          that.setData({
            nowId: 2,
            Tickets:Tickets2
          })
          return false
        }
      }
      that._loadTicket(2)
    }
  },


  /*加载优惠券*/
  _loadTicket: function (nowId) {
    var that = this
    if (nowId == 1) {
      var isEnd1 = that.data.isEnd1
      if (isEnd1 == 0) {
        coupons.toastMsg("没有更多记录~")
        return false
      }
      var type = 0;
      var p = that.data.p1
      var Tickets1 = that.data.Tickets1
    } else if (nowId == 2) {
      var isEnd2 = that.data.isEnd2
      if (isEnd2 == 0) {
        coupons.toastMsg("没有更多记录~")
        return false
      }
      var type = 1;
      var p = that.data.p2
      var Tickets2 = that.data.Tickets2
    }
    coupons.getTickets(type,p,(data)=>{
      if(data.err == 0){
      if(nowId == 1){
        var nowData = Tickets1.concat(data.data.list)
          that.setData({
            nowId:nowId,
            p1:p+1,
            Tickets1:nowData,
            Tickets:nowData,
            isEnd1:data.data.nextPage
          })
      } else if (nowId == 2) {
        var nowData = Tickets2.concat(data.data.list)
          that.setData({
            nowId:nowId,
            p2: p + 1,
            Tickets2: nowData,
            Tickets: nowData,
            isEnd2: data.data.nextPage
          })
        }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let nowId = this.data.nowId
    this._loadTicket(nowId)
  }
})