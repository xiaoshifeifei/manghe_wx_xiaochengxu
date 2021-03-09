/**
 * Created by Bamboo&Pany on 2019/9/16.
 */
import {Base} from '../../utils/base.js';
class CodeVerify extends Base{
    constructor(){
        super();
        this.WaveImg = this.restCdnUrl+'ht-app-wx/wx_img/631.png';//波浪图
    }

    /*正品验证*/
    getSceneCode(scenecode, callback) {
        var param = {
            url: 'v1/user/codeverify',
            data: {
                code: scenecode
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

}
export {CodeVerify};