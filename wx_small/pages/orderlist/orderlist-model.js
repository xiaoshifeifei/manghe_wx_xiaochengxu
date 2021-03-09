/**
 * Created by Bamboo&Pany on 2019/6/20.
 */
import {Base} from "../../utils/base.js"
class Orderlist extends Base{
    constructor(){
        super()
    }

    /*获取订单列表*/
    getAllOrder(type,p,callback){
        var param = {
            url:'/v1/user/orderlist',
            data:{
                type:type,
                p:p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
    /*取消订单*/
//    cancelOrder(par){
//        var param = {
//            url:'/v2/user/cancelorder',
//            data:{
//                order_id:par.order_id,
//            },
//            sCallback:function(data){
//                par.callback && par.callback(data);
//            }
//        };
//        this.newrequest(param);
//    }
    /*取消订单*/
    cancelOrder(order_id,callback){
        var param = {
            url:'v2/user/newcancelorder',
            data:{
                order_id:order_id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
        

    
    
    /*获取该订单的预订单信息*/
    getPreorderInfo(par){
        var param = {
            url:'/product/getpreorderinfo',
            data:{
                order_id:par.order_id,
            },
            sCallback:function(data){
                par.callback && par.callback(data);
            }
        };
        this.newrequest(param);
    }
    
}
export {Orderlist};