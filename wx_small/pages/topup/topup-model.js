/**
 * Created by Bamboo&Pany on 2019/6/19.
 */
import {Base} from "../../utils/base.js";
class Topup extends Base{
    constructor(){
        super();
        this.ImgUrl1 = this.restCdnUrl+'ht-app-wx/wx_img/demo-06.png?v=1';
    }

    /*获取充值列表数据*/
    getChargeList(callback){
        var param = {
            url:'v1/pay/getrechargelist',
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
    /*充值完成刷新余额*/
    getNewBalance(callback){
        var param = {
            url:'v1/user/balance',
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
    /*小程序微信充值接口*/
    goPreOrder(id,callback){
        var param = {
            url: 'v1/pay/preorder',
            data: {
                id: id
            },
            sCallback: function (res) {
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
                            console.log(res)
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
}
export {Topup};
