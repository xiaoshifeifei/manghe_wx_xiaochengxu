import {Base} from "../../utils/base.js"
class BoxLog extends Base{
    constructor(){
        super()
        this.NullImg = this.restCdnUrl+'ht-app-wx/wx_img/51_1.png';//背景图片
    }

    /*获取记录*/
    getBoxLog(p,callback){
        var param = {
            url:'v1/log/boxlog',
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
export {BoxLog};