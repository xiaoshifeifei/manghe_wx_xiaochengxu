// pages/Login/Login.js
import {Login} from "login-model.js"
var login = new Login()
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        JumpType: 0,//跳转方式0-redirectTo、1-reLaunch
        backUrl: '/pages/index/index',//默认跳转首页
        from: 0,//来源方式0-直接跳转首页、1-分享、2-推广商链接、3历史推广商、4带货员或用户分享个人主页
        pr_id: 0,
        pc_id: 0,
        codeItem: 0,
        updata:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取分享参数
        var encode = options.encode
        if (encode) {
            this.data.codeItem = encode
            this.data.from = 1
            //获取分享跳转类型
            if(options.type){
                this.data.JumpType = options.type
            }
            //获取跳转链接
            if(options.back_url){
                this.data.backUrl = decodeURIComponent(options.back_url)
            }
        }
        //获取扫码or链接推广商参数
        var scene = options.scene
        if (scene) {
            var sceneData = decodeURIComponent(options.scene)
            var paramArr = sceneData.split("&")
            for (var i = 0; i < paramArr.length; i++) {
                var paramItem = paramArr[i].split("=");
                if (paramItem[0] == 'a') {
                    var a = paramItem[1]
                }
                //带货员or用户自己分享首页或海报分享
                if (paramItem[0] == 'tg') {
                    var tg = paramItem[1]
                }
            }
            //推广链接id
            if (typeof a != 'undefined') {
                this.data.from = 2
                this.data.a = a
            }
            //带货推广员 or 用户分享主页或海报
            if (typeof tg != 'undefined') {
                this.data.from = 4
                this.data.tg = tg
                this.data.codeItem = tg
                this.data.backUrl = "/pages/myhome/myhome?tg="+tg
            }
        }
        //历史数据推广商扫码进入
        var pr_id = options.pr_id
        if(pr_id){
            this.data.from = 3
            this.data.codeItem = pr_id
        }
        //检查网络状态
        this._checkNetWork(this)
        //加载数据-执行登录流程
        this._loadData()
    },

    /*登录流程开始*/
    _loadData:function(){
        var that = this,logData=this.data,objData,logscene=app.globalData.log_scene
        //推广短链or推广二维码进入-首先获取推广参数
        if (logData.from == 2) {
            login.getPromoteData(this.data.a,(data)=>{
                if (data.err == 0) {
                    that.data.pr_id = data.data.pr_id
                    that.data.JumpType = data.data.type
                    that.data.backUrl = data.data.url
                    that.data.pc_id = data.data.pc_id
                }
                //验证token
                objData ={'from':2,'codeItem':that.data.pr_id,'pc_id':that.data.pc_id,'logscene':logscene}
                    that.checkToken(that,objData)
                })
        }

        //其他方式进入小程序
        if (logData.from != 2) {
            objData = {'from': logData.from, 'codeItem': logData.codeItem, 'pc_id': logData.pc_id,'logscene':logscene}
            that.checkToken(that, objData)
        }
    },

    /*检验token*/
    checkToken:function(that,objData){
        login.verify(objData,(data)=>{
            if(data.err == 1000){
                if(data.data.is_bind_iphone == 1){
                    app.globalData.is_bind_iphone = true
                }
                if(typeof data.data.updata != "undefined"){
                    that.data.updata = data.data.updata
                }
            }
            //检查授权-已授权更新信息-未授权不做处理
            if(that.data.updata){
                //获取授权信息-更新
                that.getSetting(that)
            }else{
                //直接跳转
                that._goPages(that)
            }
        })
    },

    /*是否授权*/
    getSetting:function(that){
        login.issetting((data)=>{
            //跳转到相应页面
            if(data == 1){
                app.globalData.isSetting = true
            }else if(data == 2){
                app.globalData.isSetting = false
            }
            that._goPages(that)
        })
    },

    /*跳转到相应页面*/
    _goPages:function(that){
        if(that.data.JumpType==1){
            wx.redirectTo({
                url: that.data.backUrl
            })
        }else{
            wx.reLaunch({
                url: that.data.backUrl
            })
        }
    },

    /*检查网络状态*/
    _checkNetWork:function(that){
        wx.getNetworkType({
            complete(res){
                if(res.networkType == "none"){
                    that._showModal(that)
                }
            }
        })
    },

    /*弹窗确认网络状态*/
    _showModal:function(that){
        wx.showModal({
            title: '网络溜走了~',
            content: '请检查当前网络状况哦~',
            showCancel:false,
            success (res) {
                if (res.confirm) {
                    that._checkNetWork(that)
                    that._loadData()
                }
            }
        })
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

    }
})