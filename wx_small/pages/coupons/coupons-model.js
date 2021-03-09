/**
 * Created by Bamboo&Pany on 2019/8/20.
 */
import {Base} from '../../utils/base.js'

class Coupons extends Base{

    constructor(){
        super();

        this.BackImg = this.restCdnUrl+'ht-app-wx/wx_img/87.png';//分享弹窗
    }

    /*获取不同类型奖励记录*/
    getTickets(type,p,callback){
        var url
        //奖券
        url = 'v1/log/tickets';
        var param = {
            url: url,
            data: {
                type: type,
                p: p
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
}

export {Coupons};