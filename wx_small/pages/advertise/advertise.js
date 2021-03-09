// pages/advertise/advertise.js
import { Advertise } from 'advertise-model.js';
var advertise = new Advertise(); //实例化 盒子页 对象
var WxParse = require('../../assets/wxParse/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      title:'',
      image:'',
      content:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
      this.data.act_id = option.act_id;
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
        this.getActivityConfig();
        //查询分享图和对应标题
        var type =3;//活动分享页
        var that = this;
        advertise.getShareConfig(type,(data)=>{
            if(data.err == 0){
                var back_url = encodeURIComponent('/pages/advertise/advertise?act_id='+that.data.act_id);
                that.setData({
                    sharetitle:data.data.title,
                    shareimg:data.data.imgurl,
                    encode:data.data.encode,
                    back_url:back_url
                })
            }
        })
  },
  
  getActivityConfig:function(){
        //获取活动配置
        var that = this;
        var act_id = this.data.act_id;
        advertise.getActivityContent(act_id,(data)=>{
            var content = data.data.content;
            WxParse.wxParse('activity','html',content,that,25);
            if(data.err == 0){
                wx.setNavigationBarTitle({
                    title: data.data.title 
                })
                this.setData({
                    title:data.data.title,
                    image:data.data.image,
                })                
        }
        })
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
  onShareAppMessage: function () {
      console.log(999999);
        //from menu
        var that =this;
        return {
            title: that.data.sharetitle,
            path: '/pages/login/login?type=1&encode='+that.data.encode+'&back_url='+that.data.back_url,
            imageUrl:that.data.shareimg
        }
  }
})