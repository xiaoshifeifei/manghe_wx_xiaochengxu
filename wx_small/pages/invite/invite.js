import {Invite} from 'invite-model.js';
var invite = new Invite();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var actid = options.actid;
    if(!actid){
      return false;
    }
    this._loadInfo();
    this._loadData(actid);
  },

  /**
   * 用户点击右上角分享
   */
  //自定义分享内容
  onShareAppMessage: function (res) {
    console.log(555555);
    // return custom share data when user share.
    //var p_id = invite.getDataSet(res,'id')
    //console.log(p_id)
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var p_id = res.target.dataset['id']
      //获取商品图片&商品名称
      var info = that._getProductItem(p_id)
      var title = "就差你这一刀了，快来帮我砍价抢"+info['pname']+"吧！"
      var imageUrl = "http:"+ info['images']
      //获取活动id
      var actid = that.data.actInfo.id
      console.log(actid)
      return {
        title: title,
        path: '/page/index?actid='+actid+'&pid='+p_id,//分享连接包含活动id,商品id,分享用户标识
        imageUrl:imageUrl
      }
    }
    console.log(res)
  },
  _getProductItem: function (p_id) {
    var cutList = this.data.cutList
    for (let i = 0; i < cutList.length; i++) {
      if(cutList[i]['p_id'] == p_id){
        return cutList[i]
      }
    }
  },
  _loadData:function(actid)
  {
    var that = this;
    invite.getCutProduct(actid,(data)=>{
      console.log(data)
      if(data.err == 0){
        that.setData({
            actInfo:data.data.act,
            cutList:data.data.product
        })
        that._countTime(data.data.act['ltime'])
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
        second:'00'
      })
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
  }
})