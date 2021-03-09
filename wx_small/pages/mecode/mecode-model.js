import {Base} from "../../utils/base.js"
class MeCode extends Base{
    constructor(){
        super()
        this.NullImg = this.restCdnUrl+'ht-app-wx/wx_img/51_1.png';//背景图片
    }

    /*获取记录*/
    getCodeLog(p, callback) {
        var param = {
            url: 'v1/user/verifylog',
            data: {
                p: p
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

}
export {MeCode};