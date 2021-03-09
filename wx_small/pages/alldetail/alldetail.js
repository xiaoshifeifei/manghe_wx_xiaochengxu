// pages/alldetail/alldetail.js
import {AllDetail} from "alldetail-model.js"
var alldetail = new AllDetail();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = this.options.id
    if (!id) {
      return false
    }
    this.data.id = id
  },

  /*getdetail*/
  getDetail:function(id){
    var that = this
    alldetail.getOrderDetail(id,(data)=>{
      console.log(data)
      if(data.err == 0){
        that.setData({
          Order:data.data
        })
      }
    })
  },

  /*去申请售后页面*/
  goAfter:function(event){
    var cartid = alldetail.getDataSet(event,'id')
    wx.navigateTo({
      url: '../aftersale/aftersale?id='+this.data.id+'&cartid='+cartid+'&from=2'
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
    this.getDetail(this.data.id)
  }
})