/**
 * Created by Bamboo&Pany on 2019/6/24.
 */
import {Base} from "../../utils/base.js";
class HotActivities extends Base{
    constructor(){
        super()
//        this.PageBackImg = this.restCdnUrl+'ht-app-wx/wx_img/01.png';
    }
    getSpecialList(callback){
        var param = {
            url:"v2/home/getspeciallist",
            data:{},
            sCallback :function(data) {
                callback && callback(data)
            }
        };
        this.newrequest(param);
    }
}
export {HotActivities};