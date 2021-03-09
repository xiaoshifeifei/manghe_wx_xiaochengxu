/**
 * Created by Bamboo&Pany on 2019/6/17.
 */
import {Base} from "../../utils/base.js";
class Addresslist extends Base {
    constructor() {
        super();
    }

    /*获取我的所有地址*/
    getAllAddress(callback){
        var param = {
            url:"v1/user/address",
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
    /*更换默认地址*/
    changeDefaultAddress(id,callback){
        var param = {
            url:"v1/user/defaultaddress",
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
export {Addresslist};
