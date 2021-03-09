/**
 * Created by Bamboo&Pany on 2019/6/20.
 */
import {Base} from "../../utils/base.js";
class MySet extends Base {
    constructor() {
        super();
        this.uploadUrl = this.restUploadUrl+"v1/user/setting";
        this.removeUrl = this.restUploadUrl+"v1/user/moveimg";
    }

    /*获取info*/
    getInfo(callback){
        var param = {
            url: 'v1/user/setinfo',
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }


    /*设置info*/
    goSetName(params,callback){
        var param = {
            type: 'post',
            url: 'v1/user/setting',
            data: params,
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*图片删除接口*/
    removeImg(name,callback){
        var param = {
            url: this.removeUrl,
            data: {
                name:name
            },
            setUpUrl:false,
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

}
export {MySet};