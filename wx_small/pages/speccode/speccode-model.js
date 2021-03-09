/**
 * Created by Eric on 2020/04/28.
 */
import {Base} from "../../utils/base.js";
class SpecCode extends Base {
    constructor() {
        super();
    }
    /*获取用户自己的购买权码列表*/
    getSpecCode(p,callback){
        var param = {
            url:'v1/user/speccode',
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
export {SpecCode};