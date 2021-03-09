import {Base} from "../../utils/base.js"
class PromDetail extends Base{
    constructor(){
        super()
    }

    /*获取记录*/
    getDetail(id,callback){
        var param = {
            url:'v1/home/promdetail',
            data:{
              id:id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

}
export {PromDetail};