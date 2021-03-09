import { Base } from '../../utils/base.js'
class Treasury extends Base {
    constructor() {
        super()

        this.WinImg = this.restCdnUrl + 'ht-app-wx/wx_img/75.png' //分享弹窗

        //宝库图片
        this.ImgAward1 = this.restCdnUrl + 'ht-app-wx/wx_img/24.png'
        this.HeadBox = this.restCdnUrl + 'ht-app-wx/wx_img/58.png' //顶部图
    }

    /*获取无疆盒子宝新手引导*/
    getGuideType(callback) {
        var param = {
            url: 'v1/user/newguide',
            data: {
                type: 4, //宝库引导
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
            type: 'post',
            //需要签名认证
            needSign: true,
            sCallback: function(data) {
                callback && callback(data)
            },
        }
        this.newrequest(param)
    }
}
export { Treasury }