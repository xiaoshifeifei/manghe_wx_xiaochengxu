/**
 * Created by Bamboo&Pany on 2019/6/24.
 */
import {Base} from "../../utils/base.js";
class Moreproduct extends Base{
    constructor() {
        super();
        this.PageBackImg = this.restCdnUrl+'ht-app-wx/wx_img/01.png';
        this.ImgUrl1 = this.restCdnUrl+'ht-app-wx/wx_img/631.png';
        this.ImgUrl = this.restCdnUrl+'ht-app-wx/wx_img/';//icon网络地址
    }
    getProductList(pmc_id,p,sell_way,callback){
        var param = {
            url:"v2/home/moreproduct",
            data:{
                pmc_id:pmc_id,
                p:p,
                sell_way:sell_way
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
}
export {Moreproduct};