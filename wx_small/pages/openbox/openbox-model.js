/**
 * Created by Eric on 19/6/10.
 */
import { Token } from '../../utils/token.js';
import {Base} from '../../utils/base.js';
var WxParse = require('../../assets/wxParse/wxParse/wxParse.js');

class Openbox extends Base{
    constructor(){
       super();
       this.getOpenBoxUrl = this.baseRestUrl+'v2/box/choosebox';//从大盒进入小盒子
       this.getImgPieceUrl = this.baseRestUrl+'v1/box/looktipsimg'; //消耗积分获取该盒子的提示图
       this.changeBoxUrl = this.baseRestUrl+'v2/box/changebox'; //从同一个大盒子里换小盒子
       this.getPreOrderUrl = this.baseRestUrl+'v2/product/preorderbox';//抽盒生成预订单
       this.getTipsUrl = this.baseRestUrl+'/v1/box/shake';//获取提示语
       this.tokenUrl = this.baseRestUrl+'token/gettoken'; //获取token
       this.ImgUrl1 = this.restCdnUrl+'ht-app-wx/wx_img/24.png';
       this.ImgUrl2 = this.restCdnUrl+'ht-app-wx/wx_img/25.png'; 
       this.ImgUrl3 = this.restCdnUrl+'ht-app-wx/wx_img/26.png'; 
       this.ImgUrl4 = this.restCdnUrl+'ht-app-wx/wx_img/27.png';
       this.ImgUrl5 = this.restCdnUrl+'ht-app-wx/wx_img/28.png';
       this.ImgUrl6 = this.restCdnUrl+'ht-app-wx/wx_img/23.png';
       this.ImgUrl7 = this.restCdnUrl+'ht-app-wx/wx_img/29.png?v=20190907';
       this.ImgUrl8 = this.restCdnUrl+'ht-app-wx/wx_img/22-01.png';
       this.ImgUrl9 = this.restCdnUrl+'ht-app-wx/wx_img/69-1.png';
       this.ImgUrl10 = this.restCdnUrl+'ht-app-wx/wx_img/paichu.png';
    }
    
   //获取盒子页展示信息
    getOpenBoxData(par) {
        var that = this;
        var timerName = setTimeout(function() {
            that.showLoading('玩命加载中...');
        },500); 
        var par = par;
        var token = wx.getStorageSync('token');
        wx.request({
          url: this.getOpenBoxUrl,
          header: {
            'content-type': 'application/json',
            'token': wx.getStorageSync('token')
          },
          data: {
            bpbp_id:par.bpbp_id,
          },
          success: function (res) {
            clearTimeout(timerName);  
            that.hideLoading();
            if(res.data.err==1000){
                par.callback && par.callback(res.data.data);
            }else if(res.data.err==1006){
                //token过期
                var action_name = 'getOpenBoxData';
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
            clearTimeout(timerName);  
            that.hideLoading();
          }
        });
    }
    
     /*
     * 获取拼手气提示语(无效提示+精准提示(明盒提示))
     */
    shakeLuck(bpbp_id,callback){
        var param = {
            url:'/v1/box/shakeluck',
            data: {
                bpbp_id:bpbp_id,
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
    
    //获取摇一摇提示语
    getTips(par) {
        var that = this;
        
        var par = par;
        var token = wx.getStorageSync('token');
        wx.request({
          url: this.getTipsUrl,
          header: {
            'content-type': 'application/json',
            'token': wx.getStorageSync('token')
          },
          data: {
            bpbp_id:par.bpbp_id,
          },
          success: function (res) {
           
            if(res.data.err==1000){
                par.callback && par.callback(res.data.data);
            }else if(res.data.err==1006){
                //token过期
                var action_name = 'getTips';
                that.getNewToken(par,action_name);
                
            }else if(res.data.err==1047){
               wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              }) 
                
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function (res) {
            
          }
        });
    }
    
    //看一看，获取碎片信息
    getImgPieceData(par) {
        var that = this;
        var timerName = setTimeout(function() {
            that.showLoading('玩命加载中...');
        },500); 
        var par = par;
        var token = wx.getStorageSync('token');
        wx.request({
          url: this.getImgPieceUrl,
          header: {
            'content-type': 'application/json',
            'token': wx.getStorageSync('token')
          },
          data: {
            bpbp_id:par.bpbp_id,
          },
          success: function (res) {
            clearTimeout(timerName);  
            that.hideLoading();
            if(res.data.err==1000){
                par.callback && par.callback(res.data.data);
            }else if(res.data.err==1006){
                //token过期
                var action_name = 'getImgPieceData';
                that.getNewToken(par,action_name);
                
            }else{
              wx.showToast({
                title:res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function (res) {
            clearTimeout(timerName); 
            that.hideLoading();
          }
        });
    }
    
    //在同一个大盒子里换一个小盒子的信息
    change_small_box(par){
        var that = this;
        var timerName = setTimeout(function() {
            that.showLoading('玩命加载中...');
        },500); 
        var par = par;
        var token = wx.getStorageSync('token');
        wx.request({
          url: this.changeBoxUrl,
          header: {
            'content-type': 'application/json',
            'token': wx.getStorageSync('token')
          },
          data: {
            box_id:par.box_id,
            pos_id:par.bpbp_id,
          },
          success: function (res) {
            clearTimeout(timerName);  
            that.hideLoading();
            if(res.data.err==1000){
                par.callback && par.callback(res.data.data);
            }else{
              if(res.data.err==2004){
                  wx.showToast({
                    title: '没有更多盒子~',
                    icon: 'none',
                    duration: 2000
                  })
                  
              }else if(res.data.err==2007){
                  wx.showToast({
                    title: '仅剩当前盒子~',
                    icon: 'none',
                    duration: 2000
                  })
                  
              }else if(res.data.err==1006){
                //token过期
                var action_name = 'change_small_box';
                that.getNewToken(par,action_name);
                
              }else{
                  wx.showToast({
                    title: '网络开小差了~',
                    icon: 'none',
                    duration: 2000
                  })
              }
              
            }
          },
          fail: function (res) {
            clearTimeout(timerName);  
            that.hideLoading();
          }
        });
    }
    
    //生成预订单
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
        myarr['bpbp_id']= par.bpbp_id;
        myarr['token']= token;
        myarr['num']= par.num;
        myarr['tm_key']=par.tm_key;
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
            bpbp_id:par.bpbp_id,
            num:par.num,
            tm_key:par.tm_key,          
            time:time
          },
          success: function (res) {
            clearTimeout(timerName);  
            that.hideLoading();
             if (res.data.err==10014) {
                            wx.showModal({
                                title: '提示',
                                content: res.data.msg,
                                success (res) {
                                  if (res.confirm) {
                                    console.log('用户点击确定')
                                    wx.navigateTo({
                                        url: '../addresssave/addresssave?from=3'
                                      })
                                  } else if (res.cancel) {
                                    console.log('用户点击取消')
                                    return false
                                  }
                                }
                              })
                              return
                           }else if(res.data.err==1000){
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
            clearTimeout(timerName);  
            that.hideLoading();
          }
        });
    }
    
     /*获取分享配置*/
    getShareConfig(type,p_id,tm_key,callback){
        var param = {
            url:'share/getshareconfig',
            data: {
                type: type,
                p_id:p_id,
                tm_key:tm_key
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
    /*
     * 获取当前页面所在用户的头像以及人数
     */
    getCurrentNumber(box_id,callback){
        var param = {
            url:'/v1/box/currentnumber',
            data: {
                box_id: box_id,
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
    /*
     * 获取提示语记录
     */
    getLoglist(bpbp_id,type,callback){
        var param = {
            url:'/v1/box/newloglist',
            data: {
                bpbp_id: bpbp_id,
                type:type,
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
    /*
    * 获取拼手气儿剩余次数和相应提示
    */
    getTipsConfig(bpbp_id,callback){
        var param = {
            url:'/v1/box/getluckconfig',
            data: {
                bpbp_id: bpbp_id,
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
     /*
     * 类似于泡泡，出有效提示语
     */
    getVaildTips(bpbp_id,callback){
        var param = {
            url:'/v1/box/geteffectivetips',
            data: {
                bpbp_id: bpbp_id,
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
    
     /*
     * 删除离开当前页面的人
     */
    getReduceNumber(box_id,callback){
        var param = {
            url:'/v1/box/reducenumber',
            data: {
                box_id: box_id,
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
                            if(action_name=='getOpenBoxData'){
                                that.getOpenBoxData(par);
                            }
                            if(action_name=='getImgPieceData'){
                                that.getImgPieceData(par);
                            }
                            if(action_name=='change_small_box'){
                                that.change_small_box(par);
                            }
                            if(action_name=='getpreorder'){
                                that.getpreorder(par);
                            }
                            
                            if(action_name=='getTips'){
                                that.getTips(par);
                            }
                        }
                    }
                })
            }
        })
        
    }
  

};

export {Openbox};