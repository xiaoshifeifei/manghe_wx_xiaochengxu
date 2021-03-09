/**
 * Created by Eric on 19/6/10.
 */
import { Token } from '../../utils/token.js';
import {Base} from '../../utils/base.js';


class Topic extends Base{
    constructor(){
      super();
    }

    /*获取当前活动内容*/
    getTopicContent(t_id,callback){
        var param = {
            url:'share/topiccontent',
            data: {
                t_id: t_id,
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
    /*获取分享配置*/
    getShareConfig(type,callback){
        var param = {
            url:'share/getshareconfig',
            data: {
                type: type,
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
};

export {Topic};