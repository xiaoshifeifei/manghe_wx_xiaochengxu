import {Base} from "../../utils/base.js"
class BargainRecord extends Base{
    constructor(){
        super()
        this.NullImg = this.restCdnUrl+'ht-app-wx/wx_img/51_1.png';//背景图片
    }

    /*获取记录*/
    getBargainLog(p,callback){
        var param = {
            url:'v1/invite/record',
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
export {BargainRecord};