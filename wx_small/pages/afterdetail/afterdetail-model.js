/**
 * Created by Bamboo&Pany on 2019/6/20.
 */
import {Base} from "../../utils/base.js"
class AfterDetail extends Base{
    constructor(){
        super()
    }

    /*获取订单列表*/
    getAfterDetail(id,callback){
        var param = {
            url:'v1/user/applydetail',
            data:{
                id:id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*取消申请*/
    removeApply(id,callback){
        var param = {
            url:'v1/user/applycancel',
            data:{
                id:id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*确认验货*/
    finishApply(id,callback){
        var param = {
            url:'v1/user/applyfinish',
            data:{
                id:id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*确认发货*/
    invoiceApply(id,order,callback){
        var param = {
            url:'v1/user/applyinvoice',
            data:{
                id:id,
                order:order
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
}
export {AfterDetail};