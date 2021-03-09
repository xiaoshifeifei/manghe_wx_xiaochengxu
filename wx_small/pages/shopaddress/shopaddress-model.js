/**
 * Created by Bamboo&Pany on 2019/6/17.
 */
import {Base} from "../../utils/base.js";
class Shopaddress extends Base {
    constructor() {
        super();
        this._storageKeyName = 'addressId';
    }

    /*获取我的所有地址*/
    getAllAddress(callback){
        var param = {
            url:"v1/user/address",
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    execSetStorageSync(data){
        wx.setStorageSync(this._storageKeyName,data);
    };
}
export {Shopaddress};
