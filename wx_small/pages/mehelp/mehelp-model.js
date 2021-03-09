/**
 * Created by Bamboo&Pany on 2019/9/10.
 */
import {Base} from "../../utils/base.js";
class Mehelp extends Base {
    constructor() {
        super();
    }

    /*获取帮助*/
    getHelp(type,callback){
        var param = {
            url:'v1/user/faq',
            data:{
              type:type
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
}

export {Mehelp};
