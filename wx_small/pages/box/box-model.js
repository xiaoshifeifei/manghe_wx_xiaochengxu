import { Base } from '../../utils/base.js'
class Box extends Base {
    constructor() {
            super()
            this.ImgUrl1 = this.restCdnUrl + 'ht-app-wx/wx_img/37.png?v=1'
            this.ImgUrl2 = this.restCdnUrl + 'ht-app-wx/wx_img/38.png'
                //无疆盒子宝动画图片
            this.imgArr = [
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_01.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_02.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_03.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_04.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_05.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_06.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_07.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_08.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_09.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_10.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_11.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_12.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_13.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_14.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_15.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_16.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_17.png',
                    this.restCdnUrl + 'ht-app-wx/wx_img/aanimation_18.png',
                ]
                //宝箱图片
            this.luckyBoxImg = this.restCdnUrl + 'ht-app-wx/wx_img/lucky_box.png?v=2'
            this.NullImg = this.restCdnUrl + 'ht-app-wx/wx_img/52.png' //背景图片
            this.NullBox = this.restCdnUrl + 'ht-app-wx/wx_img/57.png' //背景图片
            this.WinImg = this.restCdnUrl + 'ht-app-wx/wx_img/75.png' //分享弹窗
        }
        /*获取盒子列表*/
    getBoxList(callback) {
        var param = {
            url: 'v2/bag/box',
            sCallback: function(data) {
                callback && callback(data)
            },
        }
        this.newrequest(param)
    }

    /*处理开盒*/
    openBoxData(id, callback) {
        var param = {
            url: 'v1/bag/openbox',
            type: 'post',
            data: {
                boxid: id,
            },
            //需要签名认证
            needSign: true,
            sCallback: function(data) {
                callback && callback(data)
            },
        }
        this.newrequest(param)
    }

    /*兑换幸运值*/
    getLuckyData(callback) {
        var param = {
            url: 'v1/bag/getlucky',
            data: {},
            //需要签名认证
            needSign: true,
            sCallback: function(data) {
                callback && callback(data)
            },
        }
        this.newrequest(param)
    }

    /*获取无疆盒子宝新手引导*/
    getGuideType(type, callback) {
        var param = {
            url: 'v1/user/newguide',
            data: {
                type: type,
            },
            sCallback: function(data) {
                callback && callback(data)
            },
        }
        this.newrequest(param)
    }

    /*记录日志*/
    recordLog(callback) {
        var param = {
            url: 'v1/log/record',
            data: {
                type: 2, //跳转日志
            },
            sCallback: function(data) {
                callback && callback(data)
            },
        }
        this.newrequest(param)
    }

    /*获取用户奖励物品数据*/
    getAwardList(callback) {
        var param = {
            url: 'v1/bag/awardlist',
            sCallback: function(data) {
                callback && callback(data)
            },
        }
        this.newrequest(param)
    }

    /*获取分享配置*/
    getShareConfig(type, callback) {
        var param = {
            url: 'share/getshareconfig',
            data: {
                type: type,
            },
            sCallback: function(data) {
                callback && callback(data)
            },
        }
        this.newrequest(param)
    }

    /*合成奖励*/
    convertBox(id, callback) {
        var param = {
            url: 'v1/bag/convertbox',
            data: {
                type: id,
            },
            //需要签名认证
            needSign: true,
            sCallback: function(data) {
                callback && callback(data)
            },
        }
        this.newrequest(param)
    }
}
export { Box }