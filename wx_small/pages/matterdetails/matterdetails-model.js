/**
 * Created by Eric on 19/6/10.
 */
import { Token } from '../../utils/token.js';
import {Base} from '../../utils/base.js';
var WxParse = require('../../assets/wxParse/wxParse/wxParse.js');

class MatterDetails extends Base{
    constructor(){
      super();
      this.getDetailsUrl = this.baseRestUrl+'v2/product/commondetail';//获取普通商品详情
      this.getPreOrderUrl = this.baseRestUrl+'v2/product/precommonorder';//生成普通商品预订单
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
            s_id:par.s_id,
            p_id:par.p_id,
            sku_id:par.sku_id,
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
                
                }else if(res.data.err==1018){
                    wx.showToast({
                      title: '库存不足哦~',
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
              
            }
          },
          fail: function (res) {
            that.hideLoading();
          }
        });
   }
   
    //生成普通商品预订单
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
        myarr['token']= token;
        myarr['sku_id']= par.sku_id;
        myarr['num']= par.num;
        myarr['tm_key']= par.tm_key;
        myarr['spec_code_id']= par.spec_code_id;
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
            sku_id:par.sku_id,
            num:par.num,
            tm_key:par.tm_key,
            spec_code_id:par.spec_code_id,
            time:time
          },
          success: function (res) {
            console.log(999999,res);
            clearTimeout(timerName);  
            that.hideLoading();if (res.data.err==10014) {
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
                if(res.data.err==1032){
                    wx.showToast({
                      title:res.data.msg,
                      icon: 'none',
                      duration: 3000
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

    /*查看该商品购买权情况*/
    getSpecInfo(p_id,sku_id,num,callback){
        var param = {
            url:'v2/product/getspecinfo',
            data: {
                p_id:p_id,
                sku_id:sku_id,
                num:num
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
  

};

export {MatterDetails};