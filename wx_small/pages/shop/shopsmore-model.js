/**
 * Created by Bamboo&Pany on 2019/8/20.
 */
import {Base} from '../../utils/base.js'

class ShopsMore extends Base{

    constructor(){
        super();

        this.WaveImg = this.restCdnUrl+'ht-app-wx/wx_img/631.png';//波浪图
        this.ImgUrl = this.restCdnUrl+'ht-app-wx/wx_img/';//icon网络地址
    }

    /*店铺信息*/
    getShop(id,callback){
        var url = 'v1/home/shopdetail';
        var param = {
            url: url,
            data: {
                id: id
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

    /*店铺信息*/
    getShopProduct(id,type,p,callback){
        var url = 'v1/home/shopproduct';
        var param = {
            url: url,
            data: {
                id: id,
                type:type,
                p:p
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
}

export {ShopsMore};