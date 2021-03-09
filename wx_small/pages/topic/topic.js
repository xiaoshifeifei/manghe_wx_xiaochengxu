// pages/topic/topic.js
import { Topic } from 'topic-model.js';
var topic = new Topic(); //实例化 盒子页 对象
Page({

  /**
   * 页面的初始数据
   */
  data: {
      title:'',
      image:'',
      content:'',
      height:'1500rpx;',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
      this.data.t_id = option.t_id;
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
        this.gettopic();
       
        //查询分享图和对应标题
        var type =12;//专题页分享图
        var that = this;
        topic.getShareConfig(type,(data)=>{
            if(data.err == 0){
                var back_url = encodeURIComponent('/pages/topic/topic?t_id='+that.data.t_id);
                that.setData({
                    sharetitle:data.data.title,
                    shareimg:data.data.imgurl,
                    encode:data.data.encode,
                    back_url:back_url
                })
            }
        })
  },
  
  gettopic:function(){
        //获取专题内容
        var that = this;
        var t_id = this.data.t_id;
        topic.getTopicContent(t_id,(data)=>{
            if(data.err == 0){
                if(data.data.status==1){
                    wx.setNavigationBarTitle({
                        title: data.data.title 
                    })
                    this.setData({
                        title:data.data.title,
                        image:data.data.image,
                        color:data.data.color,
                        height:data.data.height
                    })
                }else{
                    wx.redirectTo({
                        url: '/pages/index/index'
                    })
                }
                             
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
      console.log(123456);
        //from menu
        var that =this;
        return {
            title: that.data.sharetitle,
            path: '/pages/login/login?type=1&encode='+that.data.encode+'&back_url='+that.data.back_url,
            imageUrl:that.data.shareimg
        }
  }
})