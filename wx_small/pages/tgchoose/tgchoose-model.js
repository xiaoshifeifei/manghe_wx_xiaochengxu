/**
 * Created by Bamboo&Pany on 2019/6/20.
 */
import {Base} from "../../utils/base.js";
class TgChoose extends Base {
    constructor() {
        super();

    }
    /*获取info*/
    getAllPro(name,p,callback){
        var param = {
            url: 'v1/tg/tgproduct',
            type:'post',
            data: {
                'name': name,
                'p': p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

      /*确认选择*/
      chooseTgPro(id, callback) {
        var param = {
          url: 'v1/tg/choosetg',
          type: 'post',
          data: {
            'id': id
          },
          sCallback: function (data) {
            callback && callback(data);
          }
        };
        this.newrequest(param);
      }
    /*取消选择*/
    cancelTgPro(id, callback) {
        var param = {
            url: 'v1/tg/canceltg',
            type: 'post',
            data: {
                'id': id
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

}
export {TgChoose};