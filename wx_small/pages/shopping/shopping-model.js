/**
 * Created by Bamboo&Pany on 2019/6/14.
 */
import {Base} from "../../utils/base.js";
class Shopping extends Base{
    constructor(){
        super();
        this._storageKeyName='cart';
        this.NullImg = this.restCdnUrl+'ht-app-wx/wx_img/51.png';//背景图片
        this.authImg = this.restCdnUrl+'ht-app-wx/wx_img/51_3.png';//登录图片
        this.winImg = this.restCdnUrl+'ht-app-wx/wx_img/34.png';
    }

    /*获取购物车列表*/
    getCartList(type, callback) {
        var param = {
            //url: 'v2/bag/cartlist',
            url: 'v2/bag/shopcart',
            data: {
                type: type
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*查询当前邮费*/
    getPostage(ids,callback)
    {
        var param = {
            url:'v1/bag/cartpostage',
            data:{
                cartids:ids,
            },
            type:'post',
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*商品详情*/
    getCartInfo(id,callback){
        var param = {
            url:'v1/bag/cartinfo',
            data:{
                id:id,
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*设置购物车id缓存*/
    execSetStorageSync(data){
        wx.setStorageSync(this._storageKeyName,data);
    };
}
export {Shopping};