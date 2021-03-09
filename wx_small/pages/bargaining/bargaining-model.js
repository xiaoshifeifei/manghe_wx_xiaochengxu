import {Base} from '../../utils/base.js';
class BargainIng extends Base{
    constructor(){
        super();
        this.image23 = this.restCdnUrl+'ht-app-wx/wx_img/23.png';

        this.PriceImg = this.restCdnUrl+'ht-app-wx/wx_img/44.png';//价格背景图

        this.WaveImg = this.restCdnUrl+'ht-app-wx/wx_img/631.png';//波浪图
    }

    /*获取砍价商品列表*/
    getShareDetail(icode,callback){
        var param = {
            url:'v2/invite/invitedetail',
            data:{
                icode:icode
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    /*帮助砍价*/
    goHelpCut(icode,callback){
        var param = {
            url:'v2/invite/cutprice',
            data:{
                icode:icode
            },
            //需要签名认证
            needSign:true,
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    /*热门商品列表*/
    getHotList(id,callback){
        var param = {
            url:'v1/invite/invitehot',
            data:{
                id:id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

    /*所有商品列表*/
    getAllProList(p, type, callback) {
        var param = {
            url: 'v1/invite/allpro',
            data: {
                p: p,
                type: type
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
}
export {BargainIng};