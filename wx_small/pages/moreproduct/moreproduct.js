// new.js
import {Moreproduct} from "moreproduct-model.js";
var moreproduct = new Moreproduct();
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
    PageBackImg:moreproduct.PageBackImg,
    ImgUrl:moreproduct.ImgUrl
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
    this.data.pmc_id = options.pmc_id;
    this.data.pmc_name = options.pmc_name;
    this.data.sell_way = options.sell_way;
    
    wx.setNavigationBarTitle({
        title: this.data.pmc_name 
    })
    this._loadData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
 

  /**
   * 根据页面来源加载页面数据
   */
  _loadData:function() {
    var that = this;
    var pmc_id = this.data.pmc_id;
    var p = this.data.p;
    var sell_way = this.data.sell_way;
    moreproduct.getProductList(pmc_id,p,sell_way,(data)=>{
        if(data.err == 0){             
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
              imgurl1:moreproduct.ImgUrl1,
              prosty:prosty
            })
      }
    })
  },
  /*跳转到详情页*/
  goDetail:function(event){
    var p_id = moreproduct.getDataSet(event,'p_id');
    var sell_way = moreproduct.getDataSet(event,'sell_way');
    var s_id = moreproduct.getDataSet(event,'s_id')
    var url;
    if(sell_way == 0){
        //抽盒玩法  
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
          //登录弹窗
          moreproduct._authCheckWin()
          return false
        }
        //抽盒
        url =  '../choose/choose?p_id='+p_id+'&s_id='+s_id;
    } 
    if(sell_way ==2){
      //实物直购(买小盒)
      url = '../matterdetails/matterdetails?p_id='+p_id+'&s_id='+s_id;
    }
    wx.navigateTo({
      url: url
    })
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
    this._loadData()
  }

})