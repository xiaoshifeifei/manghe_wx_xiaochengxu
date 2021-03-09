/**
 * Created by Bamboo&Pany on 2019/8/20.
 */
import {Base} from '../../utils/base.js'

class TagProducts extends Base{

    constructor(){
        super();
        this.WaveImg = this.restCdnUrl+'ht-app-wx/wx_img/631.png';//波浪图
        this.ImgUrl = this.restCdnUrl+'ht-app-wx/wx_img/';//icon网络地址
    }

    /*获取标签绑定的商品*/
    getTagProducts(t_id,type,p,callback){
        var url = 'v2/home/gettagproducts';
        var param = {
            url: url,
            data: {
                t_id:t_id,
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

export {TagProducts};