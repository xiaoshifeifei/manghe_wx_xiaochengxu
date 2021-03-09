import {Base} from '../../utils/base.js';
class Invite extends Base{
    constructor(){
        super();
    }

    /*获取砍价商品列表*/
    getCutProduct(actid,callback){
        var param = {
            url:'v1/invite/cutproduct',
            data:{
                actid:actid
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
}
export {Invite};