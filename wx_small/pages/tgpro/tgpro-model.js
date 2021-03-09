/**
 * Created by Bamboo&Pany on 2019/6/20.
 */
import {Base} from "../../utils/base.js";
class TgPro extends Base {
    constructor() {
        super();

    }
    /*获取info*/
    getInfo(callback){
        var param = {
            url: 'v1/user/setinfo',
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*获取info*/
    getSelfPro(p,callback){
        var param = {
            url: 'v1/tg/managepro',
            data:{
                p:p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*获取活动列表*/
    getActivityList(p,callback){
        var param = {
            url: 'v1/tg/activitylist',
            data:{
                p:p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*获取年度统计信息*/
    getYearData(callback){
        var param = {
            url: 'v1/tg/year',
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*获取资金明细*/
    getMoneyLog(p,callback){
        var param = {
            url: 'v1/tg/moneylog',
            data:{
              p:p
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*更新通知*/
    setNotice(notice,callback){
        var param = {
            url: 'v1/tg/tgnotice',
            type:'post',
            data:{
                notice:notice
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*置顶货取消置顶*/
    dealTop(id,callback){
        var param = {
            url: 'v1/tg/dealtop',
            type:'post',
            data:{
                id:id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*取消推广*/
    cancelTg(id,callback){
        var param = {
            url: 'v1/tg/canceltg',
            type:'post',
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
export {TgPro};