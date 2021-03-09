import {Base} from "../../utils/base.js"
class Login extends Base{
    constructor()
    {
        super()
        this.verifyUrl = this.baseRestUrl + 'token/verifytoken';
        this.tokenUrl = this.baseRestUrl + 'token/gettoken';
        this.decryptUrl = 'token/decryptdata';
        this.promotUrl = 'token/getjumpurl';
        this.objData = {'from': 0, 'codeItem': 0, 'pc_id': 0,'logscene':1000};
    }

    verify(objData,callback) {
        this.objData = objData;
        var token = wx.getStorageSync('token');
        if (!token) {
            this.getTokenFromServer((data)=>{
                callback(data)
            });
        } else {
            this._veirfyFromServer(token,(data)=>{
                callback(data)
            });
        }
    }

    /*验证token是否过期*/
    _veirfyFromServer(token,callback) {
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
                    that.getTokenFromServer((data)=>{
                        callback(data)
                    });
                }else{
                    callback(res.data)
                }
            }
        })
    }

    /*获取token*/
    getTokenFromServer(callBack) {
        var that  = this;
        var from = this.objData.from;
        var codeItem = this.objData.codeItem;
        var pc_id = this.objData.pc_id;
        var logscene = this.objData.logscene;
        wx.login({
            success: function (res) {
                if (from == 0) {
                    //直接进入
                    var data = {
                        code:res.code,
                        logscene:logscene
                    }
                } else if (from == 1) {
                    //分享进入
                    var data = {
                        code:res.code,
                        logscene:logscene,
                        encode:codeItem
                    }
                } else if (from == 2 || from == 3) {
                    //推广进入
                    var data = {
                        code:res.code,
                        logscene:logscene,
                        pr_id:codeItem,
                        pc_id:pc_id
                    }
                } else if(from == 4){
                    //分享个人主页或海报
                    var data = {
                        code:res.code,
                        logscene:logscene,
                        tg:codeItem
                    }
                }
                wx.request({
                    url: that.tokenUrl,
                    method:'POST',
                    data:data,
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
                    //已授权
                    callback(1)
                } else {
                    //未授权
                    callback(2)
                }
            }
        })
    }

    /*解密用户基本信息*/
    decryptData(params,callback) {
        var param = {
            url:this.decryptUrl,
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

    /*获取推广参数*/
    getPromoteData(a,callback){
        var param = {
            url: this.promotUrl,
            data: {
                pc_id: a
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
         this.newrequest(param);
    }
}
export {Login};