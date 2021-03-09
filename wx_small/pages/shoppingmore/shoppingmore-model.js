/**
 * Created by Bamboo&Pany on 2019/6/17.
 */
import {Base} from "../../utils/base.js";
class Shoppingmore extends Base{
    constructor(){
        super();
    }

    /*获取订单数据*/
    getPostageOrder(ids,callback){
        var param = {
            url:'v1/bag/cartorderlist',
            type:'post',
            data:{
                cartids:ids,
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*支付邮费&下单*/
    payPostage(cartids,addressId,callback){
        var param = {
            url:'v1/bag/payposnew',
            type:'post',
            data:{
                cartids:cartids,
                addressid:addressId
            },
            //需要签名认证
            needSign:true,
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*查询充值配置*/
    getPayConfig(callback){
        var param = {
            url:'v1/pay/payment',
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*微信支付下单*/
    wxPayPostage(cartids,addressId,callback){
        var param = {
            url:'v1/bag/wxpostage',
            type:'post',
            data:{
                cartids:cartids,
                addressid:addressId
            },
            //需要签名认证
            needSign:true,
            sCallback: function (res) {
                if (res.err == 0) {
                    var payData = res.data.pay_data
                    var timeStamp = payData.timeStamp;
                    if (timeStamp) { //可以支付
                        wx.requestPayment({
                            'timeStamp': timeStamp.toString(),
                            'nonceStr': payData.nonceStr,
                            'package': payData.package,
                            'signType': payData.signType,
                            'paySign': payData.paySign,
                            success: function (res) {
                                console.log(res)
                                callback && callback(2);
                            },
                            fail: function (res) {
                                console.log(res)
                                callback && callback(1);
                            }
                        });
                    } else {
                        callback && callback(0);
                    }
                } else {
                    callback && callback(0);
                }
            }
        };
        this.newrequest(param);
    }

}
export {Shoppingmore};