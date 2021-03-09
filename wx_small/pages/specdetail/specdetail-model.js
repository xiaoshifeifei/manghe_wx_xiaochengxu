/**
 * Created by eric on 2020/04/28.
 */
import {Base} from "../../utils/base.js";
class SpecDetail extends Base {
    constructor() {
        super();
    }
    /*获取对应的购买权详情*/
    getSpecDetail(id,callback){
        var param = {
            url:'v1/act/specdetail',
            data: {
                id:id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

}
export {SpecDetail};