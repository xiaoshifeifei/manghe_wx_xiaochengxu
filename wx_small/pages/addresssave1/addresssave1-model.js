/**
 * Created by Bamboo&Pany on 2019/6/17.
 */
import {Base} from "../../utils/base.js";
class Addresssave extends Base{
    constructor() {
        super();
        this._storageKeyName = 'addressId';
    }

    /*获取对应id地址*/
    getOneAddress(id,callback)
    {
        var param = {
            url:"v1/user/getoneaddress",
            data:{
                id:id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
    /*缓存addressid*/
    execSetStorageSync(data){
        wx.setStorageSync(this._storageKeyName,data);
    };
    /*删除地址*/
    delOneAddress(id,callback){
        var param = {
            url:"v1/user/deladdress",
            data:{
                id:id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
}
export {Addresssave};