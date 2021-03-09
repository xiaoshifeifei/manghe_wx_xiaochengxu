import {BargainLog} from "bargainlog-model.js"
var bargainlog = new BargainLog()
var app = getApp();
Page({
    data: {
        showPage: true,
        isSet:false,
        isMobile:false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        HeadImg:bargainlog.HeadImg
    },
    onLoad: function (options) {
        var sharecode = options.sharecode
        if (!sharecode || typeof (sharecode) == "undefined") {
            return false
        }
        this.setData({
            sharecode:sharecode
        })
        this._loadData(sharecode)
    },
    /*loaddata*/
    _loadData:function(sharecode){
        var that = this
        bargainlog.verify(sharecode,(data)=>{
            if(data.err == 1000){
                if(data.data.is_bind_iphone == 1){
                    app.globalData.is_bind_iphone = true
                }
            }
            this.getSetting()
        })

    },

    /*跳转到协议*/
    goAgree: function () {
        wx.navigateTo({
            url: '../mehelp/mehelp?type=0'
        })
    },

    /*是否授权*/
    getSetting:function(){
        var that = this
        var sharecode=this.data.sharecode
        bargainlog.issetting((data)=>{
                if(data == 1){
                    if(!app.globalData.is_bind_iphone){
                        that.setData({
                            showPage:false,//页面
                            isSet:false,//授权
                            isMobile:true,//手机号
                        })
                    }else{
                        //跳转到bargaining
                        wx.redirectTo({
                            url: '../bargaining/bargaining?sharecode='+sharecode
                        });
                    }
            }else{
                //展示授权弹窗
                that.setData({
                    showPage:false,//页面
                    isSet:true,//授权
                })
            }
        })
    },

    /*button获取用户信息*/
    bindGetUserInfo: function (e) {
        var that = this;
        var sharecode=this.data.sharecode
        if(e.detail.errMsg =="getUserInfo:ok"){
            //授权成功
            var param = {
                'userInfo': e.detail.userInfo,
                'encryptedData': e.detail.encryptedData,
                'iv': e.detail.iv,
                'type': 1,//手动授权
            }
            //绑定用户信息
            bargainlog.decryptData(param,(data)=>{
                if(data.err == '1000'){
                    app.globalData.isSetting = true
                    if(!app.globalData.is_bind_iphone){
                        that.setData({
                            isSet: false,//授权关闭
                            isMobile: true,//绑定手机开启
                        })
                    }else{
                        wx.showToast({
                            title: '登录成功',
                            icon: 'success',
                            duration: 1000
                        })
                        //跳转到砍价中页面
                        wx.redirectTo({
                            url: '../bargaining/bargaining?sharecode='+sharecode
                        });
                    }
                }
            });
        }
    },

    getPhoneNumber: function(e) {
        var sharecode=this.data.sharecode
        if(e.detail.errMsg == "getPhoneNumber:ok"){
            //获取成功
            var endata = encodeURIComponent(e.detail.encryptedData);
            var iv = encodeURIComponent(e.detail.iv);
            bargainlog.goBindPhone(endata,iv,(data)=>{
                if(data.err == 1000){
                app.globalData.is_bind_iphone = true
                wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 1000
                })
                //跳转到砍价中页面
                wx.redirectTo({
                    url: '../bargaining/bargaining?sharecode='+sharecode
                });
            }else{
                wx.showToast({
                    title: '登录失败，请重试',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
        }else{
            //获取失败
            wx.showToast({
                title: '登录失败，请重试',
                icon: 'none',
                duration: 1000
            })
        }
    }
})