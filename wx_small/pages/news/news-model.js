/**
 * Created by Bamboo&Pany on 2019/6/24.
 */
import {Base} from "../../utils/base.js";
class News extends Base{
    constructor() {
        super();
    }
    getList(p,callback){
        var param = {
            url:"v1/message/artlist",
            data:{
                p:p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
}
export {News};