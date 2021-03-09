/**
 * Created by Bamboo&Pany on 2019/6/24.
 */
import {Base} from "../../utils/base.js";
class Newlist extends Base{
    constructor() {
        super();
        this.PageBackImg = this.restCdnUrl+'ht-app-wx/wx_img/01.png';
        this.ImgUrl1 = this.restCdnUrl+'ht-app-wx/wx_img/631.png';
    }
    getProductList(type,p,callback){
        var param = {
            url:"v1/home/getlist",
            data:{
                type:type,
                sid:1,
                p:p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
}
export {Newlist};