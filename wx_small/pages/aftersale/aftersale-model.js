/**
 * Created by Bamboo&Pany on 2019/6/20.
 */
import {Base} from "../../utils/base.js"
class AfterSale extends Base{
    constructor(){
        super();
        this.uploadUrl = this.restUploadUrl+"v1/user/applyimg";
    }

    /*获取申请售后信息*/
    getAfter(id,cartid,callback){
        var param = {
            url:'v1/user/return',
            data:{
                id:id,
                cartid:cartid
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*申请售后*/
    applyAfter(params,callback){
        var param = {
            url:'v1/user/applyreturn',
            data:params,
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

}
export {AfterSale};