/**
 * Created by Bamboo&Pany on 2019/6/20.
 */
import {Base} from "../../utils/base.js";
class Me extends Base {
    constructor() {
        super();
        this.ImgUrl1 = this.restCdnUrl+'ht-app-wx/wx_img/40.png?v=1';
        this.HeadImg = this.restCdnUrl+'ht-app-wx/wx_img/hetun_01.png';
    }
    /*获取info*/
    getBaseInfo(callback){
        var param = {
            url:'v1/user/info',
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
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

    /*余额支付开关*/
    getPayClose(callback) {
        var param = {
            url: 'v1/pay/payment',
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

    /*基本信息*/
    getBaseConfig(callback){
        var param = {
            url: 'v1/user/appconfig',
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

}
export {Me};