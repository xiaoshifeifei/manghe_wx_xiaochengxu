/**
 * Created by Eric on 19/6/10.
 */
import { Token } from '../../utils/token.js';
import {Base} from '../../utils/base.js';
var WxParse = require('../../assets/wxParse/wxParse/wxParse.js');

class Details extends Base{
    constructor(){
      super();
      this.getDetailsUrl = this.baseRestUrl+'product/productdetail';//获取商品详情
      this.getPreOrderUrl = this.baseRestUrl+'product/preorderjf';//生成积分盲盒预订单
      this.getPreOrderUrl1 = this.baseRestUrl+'product/preorderye';//生成店铺盲盒预订单
      this.tokenUrl = this.baseRestUrl+'token/gettoken'; //获取token
      this.ImgUrl = this.restCdnUrl+'ht-app-wx/wx_img/';//图片网络地址
    }
  
   //获取商品详情
   getDetailData(par){
        var that = this;
        var timerName = setTimeout(function() {
            that.showLoading('玩命加载中...');
        },500); 
        var par = par;
        var token = wx.getStorageSync('token');
        wx.request({
          url: this.getDetailsUrl,
          header: {
            'content-type': 'application/json',
            'token': wx.getStorageSync('token')
          },
          data: {
            sid:par.s_id,
            pid:par.p_id,
            whr:par.whr,
          },
          success: function (res) {
            clearTimeout(timerName); 
            that.hideLoading();  
            if(res.data.err==1000){
                var content = res.data.data.content_images;
                WxParse.wxParse('article','html',content,par.that,25);
                par.callback && par.callback(res.data.data);
            }else{ 
                if(res.data.err==1031){
                    wx.showToast({
                      title: '缺少批次',
                      icon: 'none',
                      duration: 2000
                    })
                }else if(res.data.err==1006){
                    //token过期
                    var action_name = 'getDetailData';
                    that.getNewToken(par,action_name);
                
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
            that.hideLoading()
          }
        });
   }
   
    //生成积分盲盒预订单
    getpreorder(par){
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
        myarr['p_id']= par.p_id;
        myarr['pb_id']= par.pb_id;
        myarr['token']= token;
        myarr['bpbp_id']= par.bpbp_id;
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
            'sign': sign,
          },
          data: {
            p_id:par.p_id,
            pb_id:par.pb_id,
            act_id:par.act_id,
            bpbp_id:par.bpbp_id,
            sku_id:par.sku_id,
            num:par.num,
            time:time,
            
          },
          success: function (res) {
            clearTimeout(timerName);  
            that.hideLoading();
            if(res.data.err==1000){
                par.callback && par.callback(res.data.data);
            }else{
                if(res.data.err==1032){
                    wx.showToast({
                      title:res.data.msg,
                      icon: 'none',
                      duration: 2000
                    })
                   
                }else if(res.data.err==1006){
                //token过期
                var action_name = 'getpreorder';
                that.getNewToken(par,action_name);
                
                }else{
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration: 3000
                    })
                }    
              
            }
          },
          fail: function (res) {
            that.hideLoading()
          }
        });
    }
    
    //生成店铺盲盒预订单
    getpreorder1(par){
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
        myarr['p_id']= par.p_id;
        myarr['pb_id']= par.pb_id;
        myarr['token']= token;
        myarr['bpbp_id']= par.bpbp_id;
        myarr['act_id']=par.act_id;
        myarr['sku_id']= par.sku_id;
        myarr['num']= par.num;
        myarr['time']=time;
        var key =this.signKey;
        var sign =this.createsign(myarr,key);
        wx.request({
          url: this.getPreOrderUrl1,
          header: {
            'content-type': 'application/json',
            'token': wx.getStorageSync('token'),
            'sign': sign,
          },
          data: {
            p_id:par.p_id,
            pb_id:par.pb_id,
            act_id:par.act_id,
            sku_id:par.sku_id,
            bpbp_id:par.bpbp_id,
            num:par.num,
            time:time,
          },
          success: function (res) {
            clearTimeout(timerName);  
            console.log(res.data);
            if(res.data.err==1000){
                par.callback && par.callback(res.data.data);
            }else{
                if(res.data.err==1032){
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration: 3000
                    })
                   
                }else if(res.data.err==1006){
                    //token过期
                    var action_name = 'getpreorder1';
                    that.getNewToken(par,action_name);
                
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
                that.hideLoading()
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
                            if(action_name=='getDetailData'){
                               that.getDetailData(par);
                            }
                            if(action_name=='getpreorder'){
                               that.getpreorder(par);
                            }
                            if(action_name=='getpreorder1'){
                               that.getpreorder1(par);
                            }
                           
                        }
                    }
                })
            }
        })
        
    }
  

};

export {Details};