import {Base} from "../../utils/base.js"
class ScoreLog extends Base{
    constructor(){
        super()
        this.NullImg = this.restCdnUrl+'ht-app-wx/wx_img/51_1.png';//背景图片
    }

    /*获取记录*/
    getScoreLog(p,callback){
        var param = {
            url:'v1/user/scorelog',
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
export {ScoreLog};