import {Base} from '../../utils/base.js';
class BargainList extends Base{
    constructor(){
        super();
        this.ImgUrl1 = this.restCdnUrl+'ht-app-wx/wx_img/42.png';
        this.PageBackImg = this.restCdnUrl+'ht-app-wx/wx_img/01.png';

        this.PriceImg = this.restCdnUrl+'ht-app-wx/wx_img/44.png';//价格背景图
        this.WaveImg = this.restCdnUrl+'ht-app-wx/wx_img/631.png';//波浪图
        this.IconUrl = this.restCdnUrl+'ht-app-wx/wx_img/';//icon网络地址
    }

    /*获取砍价商品列表*/
    getCutProduct(callback){
        var param = {
            url:'v1/invite/cutproduct',
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    /*获取砍价弹窗信息*/
    getCutWin(actid,id,callback){
        var param = {
            url:'v1/invite/cutdetail',
            data: {
                actid: actid,
                id: id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
    /*获取分享配置*/
    getShareConfig(type,callback){
        var param = {
            url:'share/getshareconfig',
            data: {
                type: type,
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
}
export {BargainList};