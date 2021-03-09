/**
 * Created by jimmy on 17/03/09.
 */

import {Base} from '../../utils/base.js'

        class Pointorder extends Base {

    constructor() {
        super();
//        this.getPreOrderInfoUrl = this.baseRestUrl+'product/getpreorderinfo';
//        this.payMoneyUrl = this.baseRestUrl+'v2/product/productpayjf';//积分购买支付url
        this.tokenUrl = this.baseRestUrl + 'token/gettoken'; //获取token
        this.ImgUrl1 = this.restCdnUrl + 'ht-app-wx/wx_img/13.png';
    }

    //获取积分预订单信息
    getpreorderinfo(order_id, callback) {
        var param = {
            url: 'v2/product/getpreorderinfojf',
            data: {
                order_id: order_id,
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

    //积分支付
    gopaymoney(p_id, order_id, callback) {
        var param = {
            url: 'v2/product/newpayjf',
            needSign: true,
            data: {
                'p_id': p_id,
                'order_id': order_id,
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

    //余额购买支付
//    gopaymoney(par) {
//        var that = this;
//        var timerName = setTimeout(function() {
//            that.showLoading('玩命加载中...');
//        },500);
//        //生成签名
//        var timestamp = Date.parse(new Date());  
//        var time = timestamp / 1000; 
//        
//        var myarr=new Array();
//        myarr['p_id']=par.p_id;
//        myarr['coupon_id']=par.coupon_id;
//        myarr['time']=time;
//        myarr['order_id']=par.order_id;
//        var key =this.signKey;
//        var sign = this.createsign(myarr,key);
//        wx.request({
//          url: this.payMoneyUrl,
//          header: {
//            'content-type': "application/x-www-form-urlencoded",
//            'token': wx.getStorageSync('token'),
//            'sign': sign,
//          },
//          data:{
//              'p_id':par.p_id,
//              'coupon_id':par.coupon_id,
//              'order_id':par.order_id,
//              'time':time,
//          },
//          method:'post',
//          success: function (res) {
//            clearTimeout(timerName);  
//            that.hideLoading();
//            par.callback && par.callback(res);
//            if(res.data.err==1006){
//                //token过期
//                var action_name = 'gopaymoney';
//                that.getNewToken(par,action_name);
//            }
//          },
//          fail: function (res) {
//            that.hideLoading();
//          }
//        });
//    }

    /*
     *token过期时，获取新的token
     */
    getNewToken(par, action_name) {
        var that = this;
        wx.login({
            success: function (res) {
                wx.request({
                    url: that.tokenUrl,
                    method: 'POST',
                    header: {
                        'content-type': "application/x-www-form-urlencoded"
                    },
                    data: {
                        code: res.code
                    },
                    success: function (res) {
                        var token = res.data.data.token
                        wx.setStorageSync('token', token);
                        if (token) {
                            if (action_name == 'getpreorderinfo') {
                                that.getpreorderinfo(par);
                            }
                            if (action_name == 'gopaymoney') {
                                that.gopaymoney(par);
                            }
                        }
                    }
                })
            }
        })

    }
}

export {Pointorder};