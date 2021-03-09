/**
 * Created by Bamboo&Pany on 2019/6/20.
 */
import {Base} from "../../utils/base.js"
class Allorder extends Base{
    constructor(){
        super()
    }

    /*获取订单列表*/
    getAllOrder(type,p,callback){
        var param = {
            url:'v2/user/orderexpress',
            data:{
                type:type,
                p:p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*确认收货接口*/
    doReceipt(id,callback){
        var param = {
            url:'v1/user/receipt',
            data:{
                id:id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*售后订单列表接口*/
    getReturnOrder(p,callback){
        var param = {
            url:'v1/user/returnlist',
            data:{
                p:p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*取消订单*/
    goCancelOrder(orderid,callback){
        var param = {
            url:'v1/bag/cancelorder',
            type:'post',
            data:{
                orderid:orderid
            },
            //需要签名认证
            needSign:true,
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*继续支付订单*/
    goRePay(orderid,callback){
        var param = {
            url:'v1/bag/repay',
            type:'post',
            data:{
                orderid:orderid
            },
            //需要签名认证
            needSign:true,
            sCallback:function(res){
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
                }else{
                    callback && callback(0);
                }
            }
        };
        this.newrequest(param);
    }
}
export {Allorder};