/**
 * Created by Bamboo&Pany on 2019/6/20.
 */
import {Base} from "../../utils/base.js";
class Balance extends Base {
    constructor() {
        super();
        // this.ImgUrl1 = this.restCdnUrl+'ht-app-wx/wx_img/40.png?v=1';
        // this.HeadImg = this.restCdnUrl+'ht-app-wx/wx_img/hetun_01.png';
    }
    /*获取我的余额*/
    getBalanceData(p,callback){
        var param = {
            url:'v2/user/balance',
            data:{
                'p':p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*获取提现记录*/
    getCashLogData(p,callback){
        var param = {
            url:'v2/user/cashlog',
            data:{
                'p':p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
    
    /*去提现*/
    goCash(moneyNum,callback){
        var param = {
            url:'v2/user/cash',
            data:{
                'moneyNum':moneyNum
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
    

}
export {Balance};