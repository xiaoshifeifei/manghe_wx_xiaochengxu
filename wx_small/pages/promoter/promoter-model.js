import {Base} from '../../utils/base.js'
class Promoter extends Base{
    constructor(){
        super()
        this.waveImg = this.restCdnUrl+'ht-app-wx/wx_img/631.png';
    }

    /*获取推广列表*/
    getPromoterList(callback){
        var param = {
            url:'v1/home/promoter',
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*获取推广列表-new*/
    getNewPromoterList(p,callback){
        var param = {
            url:'v1/home/newpromot',
            data:{
                p:p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*获取推广列表-new*/
    getNearPromoterList(lat,lng,dis,p,callback){
        var param = {
            url: '/v1/home/nearpromot',
            data: {
                lat: lat,
                lng: lng,
                dis: dis,
                p: p
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
}
export {Promoter};