import {Base} from "../../utils/base.js"
class BindPhone extends Base{
    constructor(){
        super()
        this.headImg = this.restCdnUrl+'ht-app-wx/wx_img/hetun.jpg';
    }
    /*绑定手机号*/
    goBindPhone(endata,iv,callback){
        var param = {
            url:'token/getnumurl',
            data:{
                endata:endata,
                iv:iv
            },
            type:'post',
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

    /*查询是否已经绑定手机号*/
    goCheckPhone(callback){
        var param = {
            url:'v1/user/checkphone',
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
}
export {BindPhone};