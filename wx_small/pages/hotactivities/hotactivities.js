// pages/hot/hot.js
import {HotActivities} from "hotactivities-model.js";
var hotactivity = new HotActivities();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      c_style:'display:none;'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
    onReachBottom: function () {

    },

    _loadData: function () {
        var that = this
        var p = this.data.p
        hotactivity.getSpecialList((data)=>{
                if(data.err == 0){
                    //设置数据
                    that.setData({
                      showdata: data.data.list,
                      img_size:data.data.img_size,
                    })
                    wx.setNavigationBarTitle({
                        title: data.data.title 
                    })
                }
        });
    },
    touchimg:function(event){
        var  url = hotactivity.getDataSet(event, 'url');
        var  topic_img = hotactivity.getDataSet(event, 'topicimg');
        this.setData({
            c_style:'display:block;',
            url:url,
            topic_img:topic_img
        })
    },
    //关闭活动宣传弹框
    cloose_coupon:function(event){
            this.setData({
                c_style:'display:none;'
            });   
    },
    
    gowhere: function(event){
        var url = hotactivity.getDataSet(event,'url');
        this.setData({
            c_style:'display:none;'
        });  
        wx.navigateTo({
            url: url
        })
        
    },
    
  
})