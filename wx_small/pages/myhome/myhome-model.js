/**
 * Created by Bamboo&Pany on 2019/6/20.
 */
import {Base} from "../../utils/base.js";
class MyHome extends Base {
    constructor() {
        super();
        this.WaveImg = this.restCdnUrl+'ht-app-wx/wx_img/631.png';//波浪图
    }
    /*获取info*/
    getHome(invitecode,callback){
        var param = {
            type: 'post',
            url: 'v1/tg/home',
            data: {
                invitecode: invitecode
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*获取推广商品*/
    getProduct(invitecode,type,p,callback){
        var param = {
            type: 'post',
            url: 'v1/tg/product',
            data: {
                invitecode: invitecode,
                type: type,
                p: p
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

}
export {MyHome};