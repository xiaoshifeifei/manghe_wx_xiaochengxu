/**
 * Created by jimmy on 17/03/09.
 */

import {Base} from '../../utils/base.js'

class Signin extends Base{

    constructor(){
        super();
        this.getNewSignUrl = this.baseRestUrl+'sign/getsignlist';//新手签到任务列表
        this.goSignUrl = this.baseRestUrl+'sign/gosign';//去签到
        this.tokenUrl = this.baseRestUrl+'token/gettoken'; //获取token
        this.ImgUrl1 = this.restCdnUrl+'ht-app-wx/wx_img/35.png';
        this.ImgUrl2 = this.restCdnUrl+'ht-app-wx/wx_img/demo-09.png';
        this.ImgUrl3 = this.restCdnUrl+'ht-app-wx/wx_img/34.png';

        this.WinImg = this.restCdnUrl+'ht-app-wx/wx_img/75.png';//分享弹窗
    }

    /*new获取新手签到list*/
    getNewSignList1(callback){
        var param = {
            url: 'sign/getsignlist',
            sCallback: function(data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
    //进行新手签到
    getSign(par){
        var that = this;
        var timerName = setTimeout(function() {
            that.showLoading('玩命加载中...');
        },500);
        //生成签名
        var timestamp = Date.parse(new Date());  
        var time = timestamp / 1000; 
        //获得token
        var token = wx.getStorageSync('token');
        
        var myarr=new Array();
        myarr['sign_id']= par.sign_id;
        myarr['token']= token;
        myarr['time']=time;
        var key =this.signKey;
        var sign =this.createsign(myarr,key);
        wx.request({
          url: this.goSignUrl,
          header: {
            'content-type': 'application/json',
            'token': wx.getStorageSync('token'),
            'sign': sign,
          },
          data:{
            'sign_id':par.sign_id,
            'time':time,
          },
          success: function (res) {
            clearTimeout(timerName);  
            that.hideLoading();
            if(res.data.err==1000){
                par.callback && par.callback(res.data.data);
            }else if(res.data.err==1006){
                //token过期
                var action_name = 'getSign';
                that.getNewToken(par,action_name);
                
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function (res) {
            that.hideLoading();
          }
        });
    }
    
     /*获取分享配置*/
    getShareConfig(type,callback){
        var param = {
            url:'share/getshareconfig',
            data: {
                type: type,
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
    /*
     *token过期时，获取新的token
     */
    getNewToken(par,action_name){
        var that  = this;
        wx.login({
            success: function (res) {
                wx.request({
                    url: that.tokenUrl,
                    method:'POST',
                    header: {
                        'content-type': "application/x-www-form-urlencoded"
                    },
                    data:{
                        code:res.code
                    },
                    success:function(res){
                        var token = res.data.data.token
                        wx.setStorageSync('token', token);
                        if(token){
                            if(action_name=='getNewSignList'){
                                that.getNewSignList(par);
                            }
                            if(action_name=='getSign'){
                                that.getSign(par);
                            }
                        }
                    }
                })
            }
        })
        
    }

    /*获取签到新手引导*/
    getGuideType(callback){
        var param = {
            url: 'v1/user/newguide',
            data:{
                'type':2 //签到引导
            },
            sCallback: function(data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

    /*获取每日签到list*/
    getSignDayList(callback){
        var param = {
            url: 'v1/act/signlist',
            sCallback: function(data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

    /*去每日签到*/
    goSignDay(callback){
        var param = {
            url: 'v1/act/gosign',
            sCallback: function(data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
}

export {Signin};