/**
 * Created by eric on 2020/04/28.
 */
import {Base} from "../../utils/base.js";
class SpecList extends Base {
    constructor() {
        super();
        this.BackImg = this.restCdnUrl+'ht-app-wx/wx_img/icon4.png';//背景图
    }
    /*获取购买权列表*/
    getSpecList(p,callback){
        var param = {
            url:'v1/act/speclist',
            data: {
                p:p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

}
export {SpecList};