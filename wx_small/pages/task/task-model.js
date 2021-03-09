import {Base} from "../../utils/base.js"
class Task extends Base{
    constructor(){
        super()
        this.ImgUrl1 = this.restCdnUrl+'ht-app-wx/wx_img/30.png?v=2';

        this.WinImg = this.restCdnUrl+'ht-app-wx/wx_img/75.png';//分享弹窗
    }

    /*获取每日列表*/
    getAct(callback){
        var param = {
            url:'v2/act/daily',
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
    /*获取每日任务奖励*/
    getAward(id,callback){
        var param = {
            url:'v2/act/dailyaward',
            data:{
              id:id
            },
            //需要签名认证
            needSign:true,
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
    /*获取宝箱奖励*/
    getBox(type,callback){
        var param = {
            url:'v1/act/dailybox',
            data:{
                type:type
            },
            //需要签名认证
            needSign:true,
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
    getGrowAward(id,callback){
        var param = {
            url:'v1/act/growaward',
            data:{
                id:id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
    /*刷新宝箱数据*/
    getBoxData(callback){
        var param = {
            url:'v1/act/boxdata',

            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*获取任务引导*/
    getGuideType(callback){
        var param = {
            url: 'v1/user/newguide',
            data:{
                'type':3 //任务引导
            },
            sCallback: function(data) {
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

    /*获取每日任务奖励*/
    getGrowList(callback) {
        var param = {
            url: 'v1/act/growact',
            sCallback: function (data) {
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
}
export {Task};