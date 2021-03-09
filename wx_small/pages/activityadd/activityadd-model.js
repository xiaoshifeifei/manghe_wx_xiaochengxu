/**
 * Created by Bamboo&Pany on 2019/6/20.
 */
import {Base} from "../../utils/base.js";
class ActivityAdd extends Base {
    constructor() {
        super();

    }


    /*保存活动日期*/
    saveData(date,stime,etime,callback){
        var param = {
            url: 'v1/tg/saveactivitydata',
            type:'post',
            data:{
                date:date,
                stime:stime,
                etime:etime
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

}
export {ActivityAdd};