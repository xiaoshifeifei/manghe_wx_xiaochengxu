import {Base} from "../../utils/base.js"
//import { Config } from '../../utils/config.js';
class BargainLog extends Base{
    constructor()
    {
        super()
        this.verifyUrl = this.baseRestUrl + 'token/verifytoken';
        this.tokenUrl = this.baseRestUrl + 'token/gettoken';
        this.HeadImg = this.restCdnUrl+'ht-app-wx/wx_img/hetun.jpg';
        this.decryptUrl = this.baseRestUrl+'token/decryptdata';
    }

    verify(sharecode,callback) {
        var token = wx.getStorageSync('token');
        if (!token) {
            this.getTokenFromServer(sharecode,(data)=>{
                    callback(data)
            });
        } else {
            this._veirfyFromServer(token,sharecode,(data)=>{
                callback(data)
            });
        }
    }

    /*验证token是否过期*/
    _veirfyFromServer(token,sharecode,callback) {
        var that = this;
        wx.request({
            url: that.verifyUrl,
            method: 'POST',
            header: {
                'content-type': "application/x-www-form-urlencoded",
                 'token': token
            },
            success: function (res) {
                var valid = res.data.data.valid;
                if(!valid){
                    that.getTokenFromServer(sharecode,(data)=>{
                        callback(data)
                    });
                }else{
                    callback(res.data)
                }
            }
        })
    }

    /*获取token*/
    getTokenFromServer(sharecode,callBack) {
        var that  = this;
        wx.login({
            success: function (res) {
                wx.request({
                    url: that.tokenUrl,
                    method:'POST',
                    data:{
                        code:res.code,
                        sharecode:sharecode
                    },
                    header: {
                        'content-type': "application/x-www-form-urlencoded"
                    },
                    success:function(res){
                        var token = res.data.data.token
                        wx.setStorageSync('token', token);
                        callBack&&callBack(res.data);
                    }
                })
            }
        })
    }

    /*授权用户信息*/
    issetting(callback) {
        var that = this;
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权-说明用户不是第一次登录-更新用户数据
                    wx.getUserInfo({
                        success: function (res) {
                            var par = {
                                'userInfo': res.userInfo,
                                'encryptedData': res.encryptedData,
                                'iv': res.iv
                            }
                            that.decryptData(par);
                        }
                    })
                    //直接跳跳转到-砍价详情页面
                    callback(1)
                } else {
                    //未授权,引导用户授权
                    wx.setNavigationBarTitle({
                        title: '授权登录'
                    })
                    callback(2)
                }
            }
        })
    }

    /*解密用户基本信息*/
    decryptData(params,callback) {
        var param = {
            url:'token/decryptdata',
            data: {
                userinfo: params.userInfo,
                endata: params.encryptedData,
                iv: encodeURIComponent(params.iv)
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*绑定手机号*/
    goBindPhone(endata,iv,callback){
        var param = {
            url:'token/getnumurl',
            data:{
                endata:endata,
                iv:iv
            },
            type:'post',
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
}
export {BargainLog};