/**
 * Created by Bamboo&Pany on 2019/6/20.
 */
import {Base} from "../../utils/base.js";
class Problem extends Base {
    constructor() {
        super();
    }
    /*获取info*/
    getProblemData(p,callback){
        var param = {
            url:'v2/user/problemcash',
            data:{
                'p':p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
    
    

}
export {Problem};