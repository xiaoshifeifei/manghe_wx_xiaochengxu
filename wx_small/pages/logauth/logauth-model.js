/**
 * Created by Bamboo&Pany on 2019/9/28.
 */
import {Base} from "../../utils/base.js"
class LogAuth extends Base{
    constructor(){
        super()
        this.HeadImg = this.restCdnUrl+'ht-app-wx/wx_img/hetun.jpg';
        this.decryptUrl = this.baseRestUrl+'token/decryptdata';
    }

    /*解密用户基本信息*/
    decryptData(params,callback) {
        var param = {
            url:'token/decryptdata',
            data: {
                userinfo: params.userInfo,
                endata: params.encryptedData,
                iv: encodeURIComponent(params.iv)
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
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
}
export {LogAuth};