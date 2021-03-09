import {Base} from "../../utils/base.js"
class Weldetail extends Base{
    constructor(){
        super()

        this.verifyUrl = this.baseRestUrl + 'token/verifytoken';
        this.tokenUrl = this.baseRestUrl + 'token/gettoken';
        this.WaveImg = this.restCdnUrl+'ht-app-wx/wx_img/631.png';//波浪图
        this.backImg = this.restCdnUrl+'ht-app-wx/wx_img/back.png';//海报背景图

        this.WinImg = this.restCdnUrl+'ht-app-wx/wx_img/75.png';//分享弹窗
    }

    verify(lotcode,callback) {
        var token = wx.getStorageSync('token');
        if (!token) {
            this.getTokenFromServer(lotcode,(data)=>{
                callback(data)
            });
        } else {
            this._veirfyFromServer(token,lotcode,(data)=>{
                callback(data)
            });
        }
    }

    /*验证token是否过期*/
    _veirfyFromServer(token,lotcode,callback) {
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
                    that.getTokenFromServer(lotcode,(data)=>{
                        callback(data)
                    });
                }else{
                    callback(res.data)
                }
            }
        })
    }

    /*获取token*/
    getTokenFromServer(lotcode,callBack) {
        var that  = this;
        wx.login({
            success: function (res) {
                wx.request({
                    url: that.tokenUrl,
                    method:'POST',
                    data:{
                        code:res.code,
                        lotcode:lotcode
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

    /*获取福利列表*/
    getWeldetail(id, callback) {
        var param = {
            url:'v1/act/lotdetail',
            data:{
              id:id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*用户参与*/
    getPartIn(id, encode,callback) {
        var param = {
            url:'v1/act/lotpartin',
            data:{
                id:id,
                encode:encode
            },
            type:'post',
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*用户参与*/
    getCode(lotid, callback) {
        var param = {
            url: 'v1/act/lotcode',
            data: {
                lotid: lotid
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*助力榜列表*/
    getRank(lotid, callback){
        var param = {
            url: 'v1/act/lotrank',
            data: {
                lotid: lotid
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

}
export {Weldetail};