// new.js
import {Newlist} from "new-model.js";
var newlist = new Newlist();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEnd: 1,
    p: 1,
    listData: [],
    loadingHidden: false,
    PageBackImg:newlist.PageBackImg
  },
  onCartTap: function () {
    wx.switchTab({
      url: '../index/index'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.fromid;
    this.setData({
      type: id
    })
    this._loadData(id)
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
    //判断是否有下一页
    var is_end = this.data.isEnd;
    if(is_end == 0){
      //没有下一页
      return false
    }
    //加载数据
    var id = this.data.type
    this._loadData(id)
  },

  /**
   * 根据页面来源加载页面数据
   */
  _loadData:function(id) {
    var that = this
    var p = this.data.p
    newlist.getProductList(id,p,(data)=>{
        if(data.err == 0){
            wx.setNavigationBarTitle({
              title: data.data.m_name 
            })   
        var nowData = that.data.listData.concat(data.data.list)
        var prosty = null
        if(parseInt(nowData.length)%2 == 1){
          prosty = parseInt(nowData.length) - 1
        }
        //设置数据
        that.setData({
          p: p + 1,
          listData: nowData,
          isEnd: data.data.nextPage,
          loadingHidden: true,
          imgurl1:newlist.ImgUrl1,
          prosty:prosty
        })
      }
    })
  },
  /*跳转到详情页*/
  goDetail:function(event){
    var p_id = newlist.getDataSet(event,'p_id')
    var type = this.data.type
    var s_id = 1;
    var url;
    if(type == 2){
      if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
        //登录弹窗
        newlist._authCheckWin()
        return false
      }
      //抽盒
      url =  '../choose/choose?p_id=' + p_id+'&s_id='+s_id
    }else if (type == 3){
      //盲盒
      url = '../details/details?p_id='+p_id+'&s_id='+s_id+'&whr=dp'
    }else if(type == 5){
      //实物直购
      url = '../matterdetails/matterdetails?p_id='+p_id+'&s_id='+s_id+'&whr=dp_mat'
    }else if(type ==6){
      //艺术家商品
      url = '../matterdetails/matterdetails?p_id='+p_id+'&s_id='+s_id+'&whr=art_mat'
    }else if(type == 7){
      //积分商城
      url = '../details/details?p_id='+p_id+'&whr=jf'
    }else if(type == 8){
      //端盒
      url = '../bigbox/bigbox?p_id='+p_id+'&s_id='+s_id
    }
    wx.navigateTo({
      url: url
    })
  }

})