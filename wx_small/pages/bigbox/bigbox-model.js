/**
 * Created by Eric on 19/6/10.
 */
import { Token } from '../../utils/token.js';
import {Base} from '../../utils/base.js';

class Bigbox extends Base{
    constructor(){
      super();
      this.getBoxUrl = this.baseRestUrl+'v1/box/getbigboxlist';//获取一整盒信息
      this.isBuyUrl = this.baseRestUrl+'v1/box/isbuy';//判断盒子是否被锁定
      this.tokenUrl = this.baseRestUrl+'token/gettoken'; //获取token\
      this.getPreOrderUrl = this.baseRestUrl+'product/preorderye';//生成预订单
      this.ImgUrl1 = this.restCdnUrl+'ht-app-wx/wx_img/20.png';
      this.ImgUrl2 = this.restCdnUrl+'ht-app-wx/wx_img/demo-07.png';
      this.ImgUrl4 = this.restCdnUrl+'ht-app-wx/wx_img/27.png';
      this.ImgUrl5 = this.restCdnUrl+'ht-app-wx/wx_img/28.png';
    }
  
   //获取盒子页展示信息
   getBoxData(par) {
        var that = this;
        var timerName = setTimeout(function() {
            that.showLoading('玩命加载中...');
        },500);  
        var par = par;
        var token = wx.getStorageSync('token');
        wx.request({
          url: this.getBoxUrl,
          header: {
            'content-type': 'application/json',
            'token': wx.getStorageSync('token')
          },
          data: {
            sid:par.s_id,
            pid:par.p_id,
            bpbp_id:par.bb_id,
          },
          success: function (res) {
            clearTimeout(timerName);  
            that.hideLoading();
            if(res.data.err==1000){
                par.callback && par.callback(res.data.data);
            }else if(res.data.err==1006){
                //token过期
                var action_name = 'getBoxData';
                that.getNewToken(par,action_name);
                
            }else if(res.data.err==2000){
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 2000
                })
                setTimeout(function() {
                    wx.switchTab({
                        url: '/pages/index/index'
                    }); 
                },2000);
            }else{
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
            }
          },
          fail: function (res) {
            that.hideLoading()
          }
        });
  }
  //验证当前盒子是否被他人锁定
  isBuy(par) {
        var that = this;
        that.showLoading('玩命加载中...');
        var par = par;
        var token = wx.getStorageSync('token');
        wx.request({
          url: this.isBuyUrl,
          header: {
            'content-type': 'application/json',
            'token': wx.getStorageSync('token')
          },
          data: {
            bpbp_id:par.bpbp_id,
          },
          success: function (res) {
            that.hideLoading()
            if(res.data.err==1000){
                par.callback && par.callback(res.data.data);
            }else if(res.data.err==1006){
                //token过期
                var action_name = 'isBuy';
                that.getNewToken(par,action_name);
                
            }else{
                par.callback1 && par.callback1();
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
            }
          },
          fail: function (res) {
            that.hideLoading()
          }
        });
    }
    
     //生成预订单
    getpreorder(par){
        var that = this;
        that.showLoading('玩命加载中...');
        
        //生成签名
        var timestamp = Date.parse(new Date());  
        var time = timestamp / 1000; 
        //获得token
        var token = wx.getStorageSync('token');
        var myarr=new Array();
        myarr['p_id']= par.p_id;
        myarr['pb_id']= par.pb_id;
        myarr['bpbp_id']= par.bpbp_id;
        myarr['token']= token;
        myarr['act_id']=par.act_id;
        myarr['sku_id']= par.sku_id;
        myarr['num']= par.num;
        myarr['time']=time;
        var key =this.signKey;
        var sign =this.createsign(myarr,key);
        
        wx.request({
          url: this.getPreOrderUrl,
          header: {
            'content-type': 'application/json',
            'token': wx.getStorageSync('token'),
            'sign':sign
          },
          data: {
            p_id:par.p_id,
            pb_id:par.pb_id,
            act_id:par.act_id,
            bpbp_id:par.bpbp_id,
            sku_id:par.sku_id,
            num:par.num,          
            time:time
          },
          success: function (res) {
            that.hideLoading();
            if(res.data.err==1000){
                par.callback && par.callback(res.data.data);
            }else{
                if(res.data.err==1017){
                    wx.showToast({
                        title: '已被购买哦~',
                        icon: 'none',
                        duration: 2000
                    })
                  
                }else if(res.data.err==1006){
                    //token过期
                    var action_name = 'getpreorder';
                    that.getNewToken(par,action_name);
                
                }else if(res.data.err==2000){
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                    })
                    setTimeout(function() {
                        wx.switchTab({
                            url: '/pages/index/index'
                        }); 
                    },2000);
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                    })  
                }    
              
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
                            if(action_name=='getBoxData'){
                                that.getBoxData(par);
                            }
                            if(action_name=='isBuy('){
                                that.isBuy(par);
                            }
                        }
                    }
                })
            }
        })
        
    }
  

};

export {Bigbox};