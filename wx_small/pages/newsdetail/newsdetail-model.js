/**
 * Created by Bamboo&Pany on 2019/6/24.
 */
import {Base} from "../../utils/base.js";
class NewsDetail extends Base{
    constructor() {
        super();
    }
    getDetail(id,callback){
        var param = {
            url:"v1/message/artdetail",
            data:{
                id:id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
}
export {NewsDetail};