// pages/codeverify/codeverify.js
import {CodeVerify} from "codeverify-model.js"
var codeverify = new CodeVerify()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideFalse:true,
    hideTrue:true,
    WaveImg:codeverify.WaveImg
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var scenecode = decodeURIComponent(options.scenecode)
    console.log(scenecode)
    this._loadData(scenecode)
  },

  _loadData: function (scenecode) {
    var that = this
    var errMsg = '很遗憾！该验证码已经使用过了！'
    //正品验证开始
    codeverify.getSceneCode(scenecode,(data)=>{
      if(data.err == 0){
        that.setData({
          codeVer:data.data,
          hideFalse:true,//再次隐藏
          hideTrue:false
        })
      }else{
        //判断文案
        if (data.err == 2053) {
          //暂未发布
          errMsg = '很遗憾！该验证码暂未发布，请联系客服！'
        }
        if(data.err == 2052){
          //正品码查询失败
          errMsg = '很遗憾！该验证码验证失败，请联系客服！'
        }
        that.setData({
          errMsg:errMsg,
          hideTrue:true,//再次隐藏
          hideFalse:false
        })
      }
    })
  },

  /*跳转到首页*/
  goHome:function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  /*跳转到正品验证记录*/
  goLog:function(){
    wx.navigateTo({
      url: '../mecode/mecode'
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

  }
})