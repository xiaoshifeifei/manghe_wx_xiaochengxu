/**
 * Created by Bamboo&Pany on 2019/8/20.
 */
import {Base} from '../../utils/base.js'

class Shops extends Base{

    constructor(){
        super();

        this.WaveImg = this.restCdnUrl+'ht-app-wx/wx_img/631.png';//波浪图
    }

    /*获取不同类型奖励记录*/
    getShops(p,callback){
        var url = 'v1/home/shoplist';
        var param = {
            url: url,
            data: {
                p: p
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
}

export {Shops};