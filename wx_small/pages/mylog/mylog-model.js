/**
 * Created by Bamboo&Pany on 2019/8/20.
 */
import {Base} from '../../utils/base.js'

class MyLog extends Base{

    constructor(){
        super();
    }

    /*获取不同类型奖励记录*/
    getLogList(type,p,callback){
        var url
        if(type == 1){
            //活跃
            url = 'v1/log/activelog';
        }else if(type == 2){
            //碎片
            url = 'v1/log/chiplog';
        }else if(type == 3){
            //欧气
            url = 'v1/log/luckylog';
        }
        var param = {
            url:url,
            data: {
                p: p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
}

export {MyLog};