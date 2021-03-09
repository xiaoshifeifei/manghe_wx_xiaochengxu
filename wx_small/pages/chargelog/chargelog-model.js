import {Base} from "../../utils/base.js"
class ChargeLog extends Base{
    constructor(){
        super()
    }

    /*获取记录*/
    getMoneyLog(p,callback){
        var param = {
            url:'v1/user/chargelist',
            data:{
                p:p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
}
export {ChargeLog};