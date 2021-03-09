/**
 * Created by jimmy on 17/03/09.
 */

import {Base} from '../../utils/base.js'

class Order extends Base{

    constructor(){
        super();
        this.getPreOrderInfoUrl = this.baseRestUrl+'product/getpreorderinfo';
        this.payMoneyUrl = this.baseRestUrl+'product/productpayye';//余额购买支付url
        this.tokenUrl = this.baseRestUrl+'token/gettoken'; //获取token
        this.ImgUrl1 = this.restCdnUrl+'ht-app-wx/wx_img/13.png';
    }
    
    //获取支付方式展示状态
    gopayment(par,callback) {
        var param = {
            url:'v1/pay/payment',
            data: {
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
    
    //获取预订单信息
    getpreorderinfo(par){
        var that = this;
        var timerName = setTimeout(function() {
            that.showLoading('玩命加载中...');
        },500);
        var par = par;
        var token = wx.getStorageSync('token');

        wx.request({
          url: this.getPreOrderInfoUrl,
          header: {
            'content-type': 'application/json',
            'token': wx.getStorageSync('token')
          },
          data: {
             order_id:par.order_id,
          },
          success: function (res) {
            clearTimeout(timerName);  
            that.hideLoading();
            
            par.callback && par.callback(res.data.data);
            if(res.data.err==1006){
                //token过期
                var action_name = 'getpreorderinfo';
                that.getNewToken(par,action_name);
                
            }
          },
          fail: function (res) {
            that.hideLoading();
          }
        });
    }
    
    //余额购买支付
    
    gopaymoney(par,callback) {
        var param = {
            url:'product/productpaybox',
            data: {
                'p_id':par.p_id,
                'coupon_id':par.coupon_id,
                'order_id':par.order_id,
            },
            type:'post',
            //需要签名
            needSign:true,
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
    
     //微信直接支付
    
    wxpaymoney(par,callback) {
        var param = {
            url:'v1/pay/wxorder',
            data: {
                'p_id':par.p_id,
                'coupon_id':par.coupon_id,
                'order_id':par.order_id,
            },
            type:'post',
            //需要签名
            needSign:true,
            sCallback:function(res){
                var payData = res.data.pay_data
                var timeStamp = payData.timeStamp;
                if(timeStamp) { //可以支付
                    wx.requestPayment({
                        'timeStamp': timeStamp.toString(),
                        'nonceStr': payData.nonceStr,
                        'package': payData.package,
                        'signType': payData.signType,
                        'paySign': payData.paySign,
                        success: function (res) {
                            callback && callback(2);
                        },
                        fail: function (res) {
                            callback && callback(1);
                        }
                    });
                }else{
                    callback && callback(0);
                }
            }
        };
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
                            if(action_name=='getpreorderinfo'){
                                that.getpreorderinfo(par);
                            }
                            if(action_name=='gopaymoney'){
                                that.gopaymoney(par);
                            }
                        }
                    }
                })
            }
        })
        
    }
}

export {Order};