// pages/signin/signin.js
import { Signin } from 'signin-model.js';
var signin = new Signin(); //实例化 首页 对象
var WxParse = require('../../assets/wxParse/wxParse/wxParse.js');
var app = getApp();
var timeGuide;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      'signlist':'',
      'style_receive':'display:none;',
      buttonClicked:false,
      guideHide:true,
      sharetitle:'',
      shareimg:'',
      encode:'',
      back_url:'',
      signBar: [{id: 1, name: '新人签到'}, {id: 2, name: '每日签到'}],
      nowId: 1,
      signHide:false,
      signDayHide:true,
      imgurl1:signin.ImgUrl1,
      imgurl2:signin.ImgUrl2,
      imgurl3:signin.ImgUrl3,
      WinImg:signin.WinImg
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
      var from = 0;
      if(options.from){
          from = parseInt(options.from)
      }
      this._loadData(from)
      //新手引导
      this._newGuide()
     },

    _loadData: function (from) {
        var that = this
        signin.getNewSignList1((data)=>{
            if(data.err == 0){
                var signData = data.data.res_bs
                var sl = signData.length
                if (sl > 0 && signData[sl - 1]['sign_status'] == 1) {
                    //新手签到已签完-切换展示每日签到
                    var events = {currentTarget: {dataset: {id: 2}}}
                    that._switchTab(events)
                }else{
                    if(from == 1){
                        //任务跳转到签到
                        var events = {currentTarget: {dataset: {id: 2}}}
                        that._switchTab(events)
                    }
                }
                that.setData({
                    signlist:data.data.res_bs
                });
            }
        })
    },

    /*切换tab*/
    _switchTab: function (event) {
        var that = this
        var id = signin.getDataSet(event, 'id')
        var nowId = this.data.nowId
        if (id == nowId) {
            return false
        }
        this.setData({
            nowId: id,
        })
        if(id == 1){
            //展示7日数据
            that.setData({
                signDayHide:true,
                signHide:false,
            })
        }else if(id == 2){
            //获取每日签到
            var signDay = that.data.signDay
            if (signDay) {
                //展示数据
                that.setData({
                    signHide:true,
                    signDayHide:false
                })
            } else {
                //重新加载数据
                that._loadSinDayList()
            }
        }
    },

    /*加载每日签到内容*/
    _loadSinDayList: function () {
        var that = this
        signin.getSignDayList((data)=>{
            if(data.err == 0){
                that.setData({
                    signHide:true,
                    signDayHide:false,
                    signDay:data.data.config
                })
            }
        })
    },

    /*每日签到*/
    clickSign:function(event){
        if(!app.globalData.isSetting || !app.globalData.is_bind_iphone){
            signin._authCheckWin()
            return false
        }
        var that = this
        var id = signin.getDataSet(event, 'id')
        signin.buttonClicked(that);
        //查看当前签到是否已经完成
        var status = parseInt(signin.getDataSet(event,'status'));
        if(status == 0){
            //不可领取
            signin.toastMsg("暂时不能领取哦~")
            return false
        }
        if(status == 2){
            //已领取
            signin.toastMsg("奖励已经领取喽~")
            return false
        }
        //开始签到
        signin.goSignDay((data)=>{
            if(data.err == 0){
                var award = that._resetSignDayList(id)
                that.setData({
                    award_num:award.value,
                    award_name:award.name,
                    style_receive:'display:block;'
                })
            }
        })
    },

    /*获取签到data*/
    _resetSignDayList: function (id) {
        var signDay = this.data.signDay
        var award
        for (let i = 0; i < signDay.length; i++) {
            if (signDay[i]['id'] == id) {
                signDay[i]['status'] = 2;//已领取
                award = signDay[i]['award']
            }
        }
        this.setData({
            signDay:signDay
        })
        return award
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

  },

  /**
   * 用户点击右上角分享
   */
//  onShareAppMessage: function () {
//        var that = this;
//        //from menu
//        return {
//            title: that.data.sharetitle,
//            path: '/pages/login/login?encode='+that.data.encode+'&back_url='+that.data.back_url,
//            imageUrl:that.data.shareimg
//        }    
//
//  },

  /*
   * 去签到
   */
  gosign:function(event){
      if(!app.globalData.isSetting || !app.globalData.is_bind_iphone){
          signin._authCheckWin()
          return false
      }
        var that =this;
         //防重复点击
        signin.buttonClicked(that);
        var sign_id = signin.getDataSet(event,'sign_id');
        
        var par = {
            'sign_id':sign_id,
            callback: function(data){
                console.log(data);
                that.setData({
                    'signlist':data.res_bs,
                    'award_num':data.award_num,
                    'award_name':data.award_name,
                    'style_receive':'display:block;'
                });   
            }
        }
        
        signin.getSign(par);
  },
  goback:function(){
        this.setData({
            'style_receive':'display:none;'
        }); 
  },

    /*签到新手引导*/
    _newGuide:function(){
        var that = this
        var res = signin.BaseGetStorageSync('signinguide')
        if (res) {
            //已经点过引导-do nothing
        } else {
            //没有点过引导-播动画
            that._newGuideComic()
        }
    },
    /*引导动画*/
    _newGuideComic: function () {
        var animationHelp = wx.createAnimation({
            duration: 400,
            timingFunction: 'ease'
        })
        this.animation = animationHelp
        timeGuide = setInterval(function () {
            animationHelp.scale(1.3, 1.3).step()
            animationHelp.scale(1, 1).step()
            this.setData({
                animationHelp: animationHelp.export()
            })
        }.bind(this), 900)
    },
    /*删除引导动画*/
    _delNewGuideComic:function(){
        clearInterval(timeGuide);
    },
    /*引导弹窗*/
    _newGuideWin:function(){
        var that = this
        //请求弹窗数据
        signin.getGuideType((data)=>{
            if(data.err == 0){
            //请求成功-保存缓存-停止动画
            signin.BaseSetStorageSync('signinguide',true)
            that._delNewGuideComic()
            var content = data.data.guide.content
            data.data.guide.content = WxParse.wxParse('content','html',content,that,15);
            //this.setData({
            //  guideContent:data.data.guide.content
            //})
            //弹窗展示
            that._showGuideWin()
        }
    })
    },
    /*展示引导*/
    _showGuideWin:function(){
        this.setData({
            guideHide:false
        })
    },
    /*引导不展示*/
    _hideGuideWin:function(){
        this.setData({
            guideHide:true
        })
    }
  
})