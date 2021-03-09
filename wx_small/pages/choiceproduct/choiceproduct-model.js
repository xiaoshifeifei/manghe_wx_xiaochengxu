/**
 * Created by Bamboo&Pany on 2019/8/20.
 */
import {Base} from '../../utils/base.js'

class ChoiceProduct extends Base{

    constructor(){
        super();
        this.WaveImg = this.restCdnUrl+'ht-app-wx/wx_img/631.png';//波浪图
    }

    /*获取标签绑定的商品*/
    getChoiceProducts(pmc_id,p,callback){
        var url = 'v3/home/choiceproduct';
        var param = {
            url: url,
            data: {
                pmc_id:pmc_id,
                p:p
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
}

export {ChoiceProduct};