//home2.js 
import { Home2 } from 'home2-model.js';
var home = new Home2(); //实例化 首页 对象
var app = getApp();
Page({
  data: {
      loadingHidden: true,
      showhome: false,
      imgUrls: [],
      indicatorDots: false,
      autoplay: true,
      circular: true,
      interval: 5000,
      duration: 1000,
      bargainHide:true,
      PageBackImg:home.PageBackImg,
      sharetitle:'',
      shareimg:'',
      encode:'',
      back_url:'',
      ImgUrl:home.ImgUrl,
      p:1,
      listData: [],
      scrollHeight: 0,
      score:0
  },
  onShow: function () {
    app.playMusic('backMusic');
    var that = this;
    let systemInfo = wx.getSystemInfoSync()
    // px转换到rpx的比例
    let pxToRpxScale = 750 / systemInfo.windowWidth;
    // window的高度
    let ktxWindowHeight = systemInfo.windowHeight * pxToRpxScale             
    that.setData({
      scrollHeight: ktxWindowHeight
    });
  },
  toindex: function () {     //
    wx.navigateTo({
      url: '../index/index',
    })
  },
  toparadise: function () {     //
    wx.navigateTo({
      url: '../paradise/paradise',
    })
  },
  tobox: function () {     //
    wx.navigateTo({
      url: '../box/box',
    })
  },
  toshopping: function () {     //
    wx.navigateTo({
      url: '../shopping/shopping',
    })
  },
  tome: function () {     //
    wx.navigateTo({
      url: '../me/me',
    })
  },
  qxyd: function (event) {  
    wx.navigateTo({
      url: '../details/details',
    })
  },
  tochoose: function (event) { 
    console.log(event);
    var p_id = home.getDataSet(event,'p_id');
    var s_id = home.getDataSet(event,'s_id');
    console.log(p_id);
    wx.navigateTo({
      url: '../choose/choose?p_id=' + p_id+'&s_id='+s_id,
    })
  },
  totask:function (event) {
    wx.navigateTo({
      url: '../task/task',
    })
  },
  hotmore:function (event) { 
    console.log(event);  
    wx.navigateTo({
      url: '../hot/hot',
    })
  },
  new_more:function (event) {
      var id = home.getDataSet(event, "id");
      wx.navigateTo({
          url: '../new/new?fromid='+id
      })
  },
  //积分详情
  toproductdetail:function (event) {
      app.playMusic('btnMusic')
      var p_id = home.getDataSet(event, "p_id");
      var s_id = home.getDataSet(event, "s_id");
      wx.navigateTo({
          url: '../scoredetails/scoredetails?p_id='+p_id+'&s_id='+s_id
      })
  },
  
//  tomaterialdetail:function (event) {
//      app.playMusic('btnMusic')
//      var p_id = home.getDataSet(event, "p_id");
//      var s_id = home.getDataSet(event, "s_id");
//      var whr = home.getDataSet(event, "whr");//来源于(dp_mat店铺实物/art_mat艺术家实物)
//      wx.navigateTo({
//          url: '../matterdetails/matterdetails?p_id='+p_id+'&s_id='+s_id+'&whr='+whr
//      })
//  },
  
  
  
  onLoad: function () {
        //同步获取token
        this._loadData();  
  },
  
  _getGoodsData(){
        var that = this;
        var p = that.data.p;
        home.getGoodsData(p,(data) => {
            
            if (data.err == 0) {                
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
                  prosty:prosty,
                  showhome:true,
                  imgurl1:home.ImgUrl1,
                  imgurl2:home.ImgUrl2,
                  imgurl3:home.ImgUrl3,
                  m_name : data.m_name,
                  score:data.data.score
                })
            }
        })            
  },
   /**
    * 页面上拉加载
    */
    onReachBottom: function () {
      //判断是否有下一页
      var is_end = this.data.isEnd;
      if(is_end == 0){
        //没有下一页
        return false
      }
      //加载数据
      this._getGoodsData();
    },
  
  /*加载所有数据*/
    _loadData:function(){  
            var that = this;       
            //获取积分商品列表信息 
            this._getGoodsData();
            
            //查询分享图和对应标题
            var type =2;//值购
            home.getShareConfig(type,(data)=>{
                if(data.err == 0){
                    var back_url = encodeURIComponent('/pages/home2/home2');
                    that.setData({
                        sharetitle:data.data.title,
                        shareimg:data.data.imgurl,
                        encode:data.data.encode,
                        back_url:back_url
                    })
                }
            })
       
    },

    /*跳转到商品详情*/
    onProductsItemTap: function (event) {
        var id = home.getDataSet(event, 'id');
        wx.navigateTo({
            url: '../product/product?id=' + id
        })
    },

    /*跳转到主题列表*/
    onThemesItemTap: function (event) {
        var id = home.getDataSet(event, 'id');
        var name = home.getDataSet(event, 'name');
        wx.navigateTo({
            url: '../theme/theme?id=' + id+'&name='+ name
        })
    },

    //下拉刷新
    onPullDownRefresh:function(){
        var that =this;
        wx.showNavigationBarLoading() //在标题栏中显示加载
        
        var that = this;
        var p =1;
        home.getGoodsData(p,(data) => {
            
            if (data.err == 0) {  
                that.setData({
                    listData:[]
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
                  prosty:prosty,
                  showhome:true,
                  imgurl1:home.ImgUrl1,
                  imgurl2:home.ImgUrl2,
                  imgurl3:home.ImgUrl3,
                  m_name : data.m_name
                })
            }
            // complete
            wx.hideNavigationBarLoading() //完成停止加载

            wx.stopPullDownRefresh() //停止下拉刷新
            wx.showToast({
                title: '刷新成功',
                icon: 'none',
                duration: 1000
            })
        })        

    },
    
    //签到
    gosign: function(){
        wx.navigateTo({
            url: '../signin/signin'
        })
    },
    /*砍价商品详情*/
    toBargainDetail:function(event)
    {
        var id = home.getDataSet(event,'id')
        console.log(id)
        wx.navigateTo({
            url: '../bargaindetail/bargaindetail?id='+id
        })
    },
    /*砍价商品列表*/
    bargainList:function(){
        wx.navigateTo({
            url: '../bargainlist/bargainlist'
        })
    },
    /*砍价弹窗展示*/
    shareWin: function (event) {
        //砍价活动配置商品id
        var actid = this.data.homedata.bargain_product[0]['act_id']
        var id = home.getDataSet(event, 'id')
        home.getCutWin(actid,id,(data)=>{
            if(data.err == 0){
            console.log(data.data)
                this.setData({
                    shareData:data.data.share,
                    cutInfoData:data.data.info,
                    bargainHide: false
                })
        }
        })
    },
    /*砍价弹窗关闭*/
    closeWin:function(){
        this.setData({
            bargainHide:true
        })
    },
    //自定义分享内容
    onShareAppMessage: function (res) {
        var that = this
        if (res.from === 'button') {
            // 来自页面内转发按钮
            var id = res.target.dataset['id']
            //获取商品图片&商品名称
            var info = that._getProductItem(id)
            var title = "就差你这一刀了，快来帮我砍价抢"+info['info']['pname']+"吧！"
            var imageUrl = "http:"+ info['info']['images']
            var code = that.data.shareData.icode
            return {
                title: title,
                path: '/pages/bargaining/bargaining?sharecode=' + code,//分享标识
                imageUrl: imageUrl
            }
        }else{
            //from menu
            return {
                title: that.data.sharetitle,
                path: '/pages/login/login?encode='+that.data.encode+'&back_url='+that.data.back_url,
                imageUrl:that.data.shareimg
            }   
        }
    },
    _getProductItem: function (id) {
        var cutList = this.data.homedata.bargain_product
        for (let i = 0; i < cutList.length; i++) {
            if(cutList[i]['id'] == id){
                return cutList[i]
            }
        }
    },

    goscorelist:function(){
      if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
        //登录弹窗
        me._authCheckWin()
        return false
      }
      wx.navigateTo({
        url: '../scorelog/scorelog'
      })

    }
})

