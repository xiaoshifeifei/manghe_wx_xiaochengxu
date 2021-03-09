import {BargainList} from 'bargainlist-model.js';
var bargainlist = new BargainList();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bargainHide:true,
    imgurl1:bargainlist.ImgUrl1,
    wClicked:false,
    PageBackImg:bargainlist.PageBackImg,
    PriceImg:bargainlist.PriceImg,
    WaveImg:bargainlist.WaveImg,
    IconUrl:bargainlist.IconUrl,
    sharetitle:'',
    shareimg:'',
    encode:'',
    back_url:'',
    listHide:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this._loadInfo();
    this._loadData();
  },

  /**
   * 用户点击右上角分享
   */
  //自定义分享内容
  onShareAppMessage: function (res) {
    console.log(888888);
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var id = res.target.dataset['id']
      //获取商品图片&商品名称
      var info = that._getProductItem(id)
      var title =  "就差你这一刀了，快来帮我砍价抢"+info['info']['pname']+"吧！"
      var imageUrl = info['info']['images']['pic1']
      var code = that.data.shareData.icode
      return {
        title: title,
        path: '/pages/bargainlog/bargainlog?sharecode=' + code,//分享标识
        imageUrl:imageUrl
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
    var cutList = this.data.cutList
    for (let i = 0; i < cutList.length; i++) {
      if(cutList[i]['id'] == id){
        return cutList[i]
      }
    }
  },
  _loadData:function()
  {
    var that = this;
    bargainlist.getCutProduct((data)=>{
    if(data.err == 0){
      var prosty = null
      if(parseInt(data.data.product.length)%2 == 1){
        prosty = parseInt(data.data.product.length) - 1
      }
    console.log(prosty)
      that.setData({
        actInfo:data.data.act,
        cutList:data.data.product,
        prosty:prosty
      })
      that._countTime(data.data.act['ltime'])
    }
  })
   
   //查询分享图和对应标题
    var type =1;//首页
    bargainlist.getShareConfig(type,(data)=>{
        if(data.err == 0){
            var back_url = encodeURIComponent('/pages/index/index');
            that.setData({
                sharetitle:data.data.title,
                shareimg:data.data.imgurl,
                encode:data.data.encode,
                back_url:back_url
            })
        }
    })
    
  },
  /*获取微信头像*/
  _loadInfo:function()
  {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        console.log(nickName)
        console.log(avatarUrl)
        that.setData({
          userInfo:userInfo
        })
      }
    })
  },
  /*砍价活动倒计时*/
  _countTime: function (count) {
    var that = this
    //计算当前天数小时数、分钟数、秒数
    var day = Math.floor(count/86400)
    if(day<10){
      day = 0+day.toString()
    }
    //console.log(day)
    var hour = Math.floor((count%86400)/3600);
    if(hour<10){
      hour = 0+hour.toString()
    }
    //console.log(hour)
    var minute = Math.floor(((count%86400)%3600)/60);
    if(minute<10){
      minute = 0+minute.toString()
    }
    //console.log(minute)
    var second = ((count%86400)%3600)%60;
    if(second<10){
      second = 0+second.toString()
    }
    if(count == 0){
      that.setData({
        day:'00',
        hour: '00',
        minute:'00',
        second:'00',
        listHide:true
      })
      bargainlist.toastMsg("砍价活动已结束")
      return
    }
    that.setData({
      day:day,
      hour: hour,
      minute:minute,
      second:second
    })
    setTimeout(function () {
      count--;
      that._countTime(count);
    }, 1000);
  },
  /*砍价弹窗关闭*/
  closeWin:function(){
    this.setData({
      bargainHide:true
    })
  },
  /*砍价弹窗展示*/
  shareWin: function (event) {
    if(!app.globalData.isSetting || !app.globalData.is_bind_iphone){
      bargainlist._authCheckWin()
      return false
    }
    //砍价活动配置商品id
    var actid = this.data.actInfo.id
    var id = bargainlist.getDataSet(event, 'id')
    bargainlist.getCutWin(actid,id,(data)=>{
      if(data.err == 0){
        this.setData({
          shareData:data.data.share,
          cutInfoData:data.data.info,
          bargainHide: false
        })
    }
  })
  },
  /*砍价商品详情*/
  toBargainDetail:function(event)
  {
    var id = bargainlist.getDataSet(event,'id')
    wx.navigateTo({
      url: '../bargaindetail/bargaindetail?id='+id
    })
  },
  /*按钮点击失效*/
  _disableButton:function(){
    var that = this
    that.setData({
      wClicked:true
    })
    //按钮还原
    setTimeout(function(){
      that.setData({
        wClicked:false
      })
    },1000)
  }
})