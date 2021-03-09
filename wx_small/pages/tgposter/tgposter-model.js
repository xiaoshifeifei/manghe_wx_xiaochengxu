/**
 * Created by Bamboo&Pany on 2019/6/20.
 */
import {Base} from "../../utils/base.js";
class TgPoster extends Base {
    constructor() {
        super();

    }
    /*获取info*/
    getPoster(callback){
        var param = {
            url: 'v1/tg/tgcode',
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

}
export {TgPoster};