// pages/afterdetail/afterdetail.js
import {AfterDetail} from "afterdetail-model.js"
var afterdetail = new AfterDetail();
var timeOut;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideInvoice:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = this.options.id
    if(!id){
      return false
    }
    this.data.id = id
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this._getDetail(this.data.id)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(timeOut)
  },

  /*获取售后详情*/
  _getDetail:function(id){
    var that = this
    afterdetail.getAfterDetail(id,(data)=>{
      if(data.err == 0){
        that.setData({
          order:data.data.order,
          shop:data.data.shop,
          cache:data.data.cache,
          track:data.data.track
        })
        if(data.data.order.ltime>0){
          that._countTime(data.data.order.ltime)
        }
      }
    })
  },

  /*修改申请*/
  changeApply:function(){
    //获取oe_id &cart id-修改完成后返回当前页面并刷新
    wx.navigateTo({
      url: '../aftersale/aftersale?id='+this.data.order.oe_id+'&cartid='+this.data.order.cart_id+'&from=1'
    })
  },

  /*撤销申请*/
  removeApply:function(event){
    var that = this
    var id = afterdetail.getDataSet(event,'id')
    //弹窗展示
    wx.showModal({
      title: '提示',
      content: '是否确认要撤销申请？',
      success (res) {
        if (res.confirm) {
          that._doCancel(id);
        } else if (res.cancel) {

        }
      }
    })
  },

  /*撤销申请*/
  _doCancel:function(id){
    var that = this
    afterdetail.removeApply(id,(data)=>{
      if(data.err == 0){
        afterdetail.toastMsg(data.data)
        //重置数据
        that._getDetail(id)
      }
    })
  },

  /*确认发货*/
  applyInvoice:function(event){
    this.setData({
      hideInvoice:false
    })
  },

  /*获取input值*/
  orderInput: function(e){
    this.data.iorder = e.detail.value
  },

  /*确认发货按钮*/
  submitOrder:function(event){
    var id = afterdetail.getDataSet(event,'id')
    var iorder = this.data.iorder
    var that = this
    if(!iorder){
      afterdetail.toastMsg("请输入运单号")
      return false
    }
    afterdetail.invoiceApply(id,iorder,(data)=>{
      if(data.err == 0){
        afterdetail.toastMsg(data.data)
        that.closeWin()
        that._getDetail(id)
      }
    })
  },

  /*关闭弹窗*/
  closeWin:function(){
    this.setData({
      hideInvoice:true
    })
  },

  /*确认验货*/
  applyFinish:function(event){
    var id = afterdetail.getDataSet(event,'id')
    var that = this
    //弹窗展示
    wx.showModal({
      title: '提示',
      content: '是否确认收到货，并且货没有问题？确认则会关闭此售后订单',
      success (res) {
        if (res.confirm) {
          that._doFinish(id);
        } else if (res.cancel) {

        }
      }
    })
  },

  /*确认验货*/
  _doFinish:function(id){
    var that = this
    afterdetail.finishApply(id,(data)=>{
      if(data.err == 0){
        afterdetail.toastMsg(data.data)
        that._getDetail(id)
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /*商家处理倒计时*/
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
        second:'00'
      })
      return
    }
    that.setData({
      day:day,
      hour: hour,
      minute:minute,
      second:second
    })
    timeOut = setTimeout(function () {
      count--;
      that._countTime(count);
    }, 1000);
  }
})