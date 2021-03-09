// pages/bindphone/bindphone.js
import {BindPhone} from "bindphone-model.js"
var bindphone = new BindPhone()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImg:bindphone.headImg,
    showText:"授权绑定手机号"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
  },

  //加载绑定数据
  _loadData:function(){
    var that = this
    bindphone.goCheckPhone((data)=>{
      if(data.data.status == 1){
        that.setData({
          showText:"重新授权绑定手机号"
        })
      }
    })
  },

  getPhoneNumber: function(e) {
    console.log(e);
    if(e.detail.errMsg == "getPhoneNumber:ok"){
      //获取成功
      var endata = encodeURIComponent(e.detail.encryptedData);
      var iv = encodeURIComponent(e.detail.iv);
      bindphone.goBindPhone(endata,iv,(data)=>{
        if(data.err == 1000){
          //toast
          wx.showToast({
            title: '手机号绑定成功',
            icon: 'success',
            duration: 1000
          })
          //绑定成功-跳回任务
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000);
        }else{
          wx.showToast({
            title: '手机号绑定失败，请重试',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }else{
      //获取失败

    }
  }
})