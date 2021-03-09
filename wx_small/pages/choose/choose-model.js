/**
 * Created by Eric on 19/6/10.
 */
import { Token } from '../../utils/token.js';
import { Base } from '../../utils/base.js';

class Choose extends Base {
    constructor() {
        super();
        this.getBoxUrl = this.baseRestUrl + 'v2/box/getboxlist';//获取盒子页信息
        this.isBuyUrl = this.baseRestUrl + 'v2/box/isbuy';//判断盒子是否被锁定
        this.tokenUrl = this.baseRestUrl + 'token/gettoken'; //获取token
        this.ImgUrl1 = this.restCdnUrl + 'ht-app-wx/wx_img/20.png';
    }

    //获取盒子页展示信息
    getBoxData(p_id, s_id, bb_id, check_cur_box, callback) {
        var param = {
            url: 'v2/box/getboxlist',
            data: {
                sid: s_id,
                pid: p_id,
                bb_id: bb_id,
                check_cur_box: check_cur_box,
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

    /*获取规则方法*/
    getRuleData(p_id,callback){
        var param = {
            url: 'v1/box/getrule',
            type:'post',
            data: {
                p_id: p_id,
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

    //获取盒子页展示信息
    //    getBoxData(par) {
    //         var that = this;
    //         var timerName = setTimeout(function() {
    //             that.showLoading('玩命加载中...');
    //         },500);
    //         var par = par;
    //         var token = wx.getStorageSync('token');
    //         wx.request({
    //           url: this.getBoxUrl,
    //           header: {
    //             'content-type': 'application/json',
    //             'token': wx.getStorageSync('token')
    //           },
    //           data: {
    //             sid:par.s_id,
    //             pid:par.p_id,
    //             bb_id:par.bb_id,
    //             check_cur_box:par.check_cur_box,
    //           },
    //           success: function (res) {
    //             clearTimeout(timerName);  
    //             that.hideLoading();
    //             if(res.data.err==1000){
    //                 par.callback && par.callback(res.data.data);
    //             }else if(res.data.err==1006){
    //                 //token过期
    //                 var action_name = 'getBoxData';
    //                 that.getNewToken(par,action_name);

    //             }else{
    //                 wx.showToast({
    //                   title: res.data.msg,
    //                   icon: 'none',
    //                   duration: 3000
    //                 })
    //                 setTimeout(function() {
    //                     wx.switchTab({
    //                         url: '/pages/index/index'
    //                     }); 
    //                 },4000);
    //             }
    //           },
    //           fail: function (res) {
    //             that.hideLoading()
    //           }
    //         });
    //   }


    //验证当前盒子是否被他人锁定
    isBuy(par) {
        var that = this;
        var timerName = setTimeout(function () {
            that.showLoading('玩命加载中...');
        }, 500);
        var par = par;
        var token = wx.getStorageSync('token');
        wx.request({
            url: this.isBuyUrl,
            header: {
                'content-type': 'application/json',
                'token': wx.getStorageSync('token')
            },
            data: {
                bpbp_id: par.bpbp_id,
            },
            success: function (res) {
                clearTimeout(timerName);
                that.hideLoading()
                if (res.data.err == 1000) {
                    par.callback && par.callback(res.data.data);
                } else if (res.data.err == 1006) {
                    //token过期
                    var action_name = 'isBuy';
                    that.getNewToken(par, action_name);

                } else if (res.data.err == 2001) {
                    par.callback1 && par.callback1();
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 4000
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 4000
                    })
                }
            },
            fail: function (res) {
                that.hideLoading()
            }
        });
    }

    /*获取分享配置*/
    getShareConfig(type,p_id,tm_key,callback) {
        var param = {
            url: 'share/getshareconfig',
            data: {
                type: type,
                p_id:p_id,
                tm_key:tm_key
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    /*
     * 获取当前页面所在用户的头像以及人数
     */
    getCurrentNumber(box_id, callback) {
        var param = {
            url: '/v1/box/currentnumber',
            data: {
                box_id: box_id,
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

    /*
     * 删除离开当前页面的人
     */
    getReduceNumber(box_id, callback) {
        var param = {
            url: '/v1/box/reducenumber',
            data: {
                box_id: box_id,
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

    /*
    *token过期时，获取新的token
    */
    getNewToken(par, action_name) {
        var that = this;
        wx.login({
            success: function (res) {
                wx.request({
                    url: that.tokenUrl,
                    method: 'POST',
                    header: {
                        'content-type': "application/x-www-form-urlencoded"
                    },
                    data: {
                        code: res.code
                    },
                    success: function (res) {
                        var token = res.data.data.token
                        wx.setStorageSync('token', token);
                        if (token) {
                            if (action_name == 'getBoxData') {
                                that.getBoxData(par);
                            }
                            if (action_name == 'isBuy(') {
                                that.isBuy(par);
                            }
                        }
                    }
                })
            }
        })

    }

    //获取商品详情
    getDetailData(s_id,p_id,whr, callback) {
        var param = {
            url: 'product/productdetail',
            data: {
                sid: s_id,
                pid: p_id,
                whr: whr,
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

    // getDetailData(par) {
    //     var that = this;
    //     var timerName = setTimeout(function () {
    //         that.showLoading('玩命加载中...');
    //     }, 500);
    //     var par = par;
    //     var token = wx.getStorageSync('token');
    //     wx.request({
    //         url: this.getDetailsUrl,
    //         header: {
    //             'content-type': 'application/json',
    //             'token': wx.getStorageSync('token')
    //         },
    //         data: {
    //             sid: par.s_id,
    //             pid: par.p_id,
    //             whr: par.whr,
    //         },
    //         success: function (res) {
    //             clearTimeout(timerName);
    //             that.hideLoading();
    //             if (res.data.err == 1000) {
    //                 var content = res.data.data.content_images;
    //                 WxParse.wxParse('article', 'html', content, par.that, 25);
    //                 par.callback && par.callback(res.data.data);
    //             } else {
    //                 if (res.data.err == 1031) {
    //                     wx.showToast({
    //                         title: '缺少批次',
    //                         icon: 'none',
    //                         duration: 2000
    //                     })
    //                 } else if (res.data.err == 1006) {
    //                     //token过期
    //                     var action_name = 'getDetailData';
    //                     that.getNewToken(par, action_name);

    //                 } else {
    //                     wx.showToast({
    //                         title: res.data.msg,
    //                         icon: 'none',
    //                         duration: 2000
    //                     })
    //                 }

    //             }
    //         },
    //         fail: function (res) {
    //             that.hideLoading()
    //         }
    //     });
    // }



};

export { Choose };