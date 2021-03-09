// pages/shopsmore/shopsmore.js
import {ShopsMore} from "shopsmore-model.js"
var shopsmore = new ShopsMore()
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    WaveImg:shopsmore.WaveImg,
    p:1,
    isEnd:1,
    proData:[],
    type:1,
    nav1:'../../img/shops_nav_01_hover.png',
    nav2:'../../img/shops_nav_02.png',
    nav3:'../../img/shops_nav_03.png',
    nav4:'../../img/shops_nav_04.png',
    style1:'display:none;',
    ImgUrl:shopsmore.ImgUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = this.options.id
    this.setData({
      id:id
    })
    // if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
    //   //登录弹窗
    //   shopsmore._authCheckWin()
    //   return false
    // }
    this.getShop(id)
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.playMusic('backMusic');
    let isPhoneX = app.globalData.isIphoneX;
    let isPhoneXI = app.globalData.isIphoneXI;
    if(isPhoneX){
        this.setData({
            isPhoneX:true,
            bottom:'padding-bottom: 38rpx;'
        }) 
    }
    if(isPhoneXI){
      this.setData({
        isPhoneXI:true,
        bottom:'padding-bottom:60rpx;',
      })
    }
    // this.getShop(this.data.id)
  },

  /*获取店铺详情*/
  getShop:function(id){
    var that = this
    shopsmore.getShop(id,(data)=>{
      if(data.err == 0){
        that.setData({
          Shop:data.data.shop
        })
        //设置顶部title
        that._setTitle(data.data.shop.sname)
        //商品列表
        that.getProduct(1)
      }
    })
  },

  /*设置顶部title*/
  _setTitle:function(o){
    wx.setNavigationBarTitle({
      title: o
    })
  },

  /*获取店铺商品列表*/
  getProduct:function(type){
    var that = this
    var id = that.data.id
    var p = that.data.p
//    var type = 1
    var isEnd = that.data.isEnd
    if (isEnd == 0) {
      shopsmore.toastMsg("没有更多内容喽~")
      return false
    }
    var proData = that.data.proData
    shopsmore.getShopProduct(id,type,p,(data)=>{
      if(data.err == 0){
      var newData = proData.concat(data.data.list)
      that.setData({
        proData:newData,
        p:p+1,
        isEnd:data.data.nextPage,
        prosty:data.data.prosty,
        sharetitle:data.data.title,
        shareimg:data.data.share_url,
        encode:data.data.encode,
        cs_weixin:data.data.cs_weixin,
        cs_phone:data.data.cs_phone,
        cs_qq:data.data.cs_qq
        
      })
    }
  })
  },

  /*跳转奖励立即购买*/
  goLink:function(event){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      shopsmore._authCheckWin()
      return false
    }

    let link = shopsmore.getDataSet(event,'link')
    // console.log(link+'&from=shop');
    wx.navigateTo({
      url: link+'&from=shop'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.getProduct(this.data.type);
  },
  
  //自定义分享内容
    onShareAppMessage: function (res) {
            //from menu
            var back_url = encodeURIComponent('/pages/shop/shop?id='+this.data.id);
//            console.log('/pages/login/login?encode='+this.data.encode+'&back_url='+back_url);
//            console.log(this.data.shareimg);
            return {
                title: this.data.sharetitle,
                path: '/pages/login/login?encode='+this.data.encode+'&back_url='+back_url,
                imageUrl:this.data.shareimg
            }

    },
    
    choose:function (event) {
        var type = shopsmore.getDataSet(event, "type");
        if(type==1){
            this.setData({
                type:1,
                isEnd:1,
                p:1,
                proData:[],
                nav1:'../../img/shops_nav_01_hover.png',
                nav2:'../../img/shops_nav_02.png',
                nav3:'../../img/shops_nav_03.png',
                nav4:'../../img/shops_nav_04.png',
                style1:'display:none;'
            })
            this.getProduct(1);
        }
        if(type==2){
            this.setData({
                type:2,
                isEnd:1,
                p:1,
                proData:[],
                nav1:'../../img/shops_nav_01.png',
                nav2:'../../img/shops_nav_02_hover.png',
                nav3:'../../img/shops_nav_03.png',
                nav4:'../../img/shops_nav_04.png',
                style1:'display:none;'
            })
            this.getProduct(2);
        }
        if(type==3){
            this.setData({
                type:3,
                isEnd:1,
                p:1,
                proData:[],
                nav1:'../../img/shops_nav_01.png',
                nav2:'../../img/shops_nav_02.png',
                nav3:'../../img/shops_nav_03_hover.png',
                nav4:'../../img/shops_nav_04.png',
                style1:'display:none;'
            })
            this.getProduct(3);
        }
        if(type==4){
            this.setData({                            
                nav1:'../../img/shops_nav_01.png',
                nav2:'../../img/shops_nav_02.png',
                nav3:'../../img/shops_nav_03.png',
                nav4:'../../img/shops_nav_04_hover.png',
                style1:'display:block;'
            })
        }
        
    },
    cloose_coupon:function(event){
        this.setData({
            style1:'display:none;'
        });   
    },
    openservice:function(event){

    }
})