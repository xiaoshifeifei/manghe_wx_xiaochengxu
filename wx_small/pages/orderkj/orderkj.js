// pages/orderkj/orderkj.js
import { OrderKj } from 'orderkj-model.js'
var orderkj = new OrderKj() //实例化 首页 对象
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        order_arr: '',
        coupon: 0,
        c_style: 'display:none;',
        pay_success: 'display:none;',
        pay_success1: 'display:none;',
        pay_fail: 'display:none;',
        buttonClicked: false,
        pay_status: 'display:none;',
        class_name1: '',
        class_name2: '',
        blpay: 0,
        wxpay: 1,
        paytype: 2,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(option) {
        this.data.order_id = option.order_id
            //同步获取token
        var func_param = {
            callback: function() {},
        }
        app.rsncToken(func_param)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this._loadData()
    },

    /*加载数据*/
    _loadData: function() {
        var that = this
        var par = {
            order_id: this.data.order_id,
            callback: function(data) {
                data.otime = orderkj.formatTimeTwo(data.otime, 'Y-M-D h:m:s')
                that.setData({
                    order_arr: data,
                    money: data.money,
                    order_id: data.order_id,
                    s_id: data.s_id,
                    imgurl1: orderkj.ImgUrl1,
                    pay_fail: 'display:none;',
                    ticket_status: data.ticket_status,
                })
                if (data.ticket_status == 1) {
                    var nmoney = data.money - data.coupon_money >= 0 ? data.money - data.coupon_money : 0
                    that.setData({
                        coupon_money: data.coupon_money,
                        money: nmoney.toFixed(2),
                        coupon: data.coupon_money,
                    })
                }
            },
        }

        orderkj.getpreorderinfo(par)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    //支付成功，前往无疆盒子宝
    tobox: function(event) {
        wx.switchTab({
            url: '/pages/box/box',
        })
    },
    //支付成功，可返回首页、盒柜、店铺
    tocart: function(event) {
        var jumptype = orderkj.getDataSet(event, 'jumptype')
        var s_id = orderkj.getDataSet(event, 's_id')
        if (jumptype == 1) {
            //回首页
            wx.switchTab({
                url: '/pages/index/index',
            })
        }
        //        if(jumptype==2){
        //            //回店铺
        //            wx.navigateTo({
        //               url: '/pages/shop/shop?id='+s_id,
        //            })
        //        }
        if (jumptype == 3) {
            //去拆盒
            wx.switchTab({
                url: '/pages/shopping/shopping',
            })
        }
    },
    //余额不足，前往充值
    topup: function(event) {
        console.log(event)
        wx.navigateTo({
            url: '../topup/topup?from=3',
        })
    },
    close: function() {
        this.setData({
            pay_fail: 'display:none;',
        })
    },

    //打开付款方式选择界面
    openway: function() {
        this.setData({
            pay_status: 'display:block;',
        })
        var par = ''
        orderkj.gopayment(par, (data) => {
            //微信直接支付再次付款订单，只显示微信支付,不显示余额支付
            if (this.data.ticket_status == 1) {
                this.setData({
                    blpay: 0,
                    paytype: 2,
                })
            } else {
                if (data.data.blpay == 1 && data.data.wxpay == 1) {
                    this.setData({
                        blpay: 1,
                        wxpay: 1,
                        paytype: 2,
                    })
                }
                if (data.data.blpay == 1 && data.data.wxpay == 0) {
                    this.setData({
                        blpay: 1,
                        wxpay: 0,
                        paytype: 1,
                    })
                }
                if (data.data.blpay == 0 && data.data.wxpay == 1) {
                    this.setData({
                        blpay: 0,
                        wxpay: 1,
                        paytype: 2,
                    })
                }
                //账户余额
                if (data.data.money) {
                    this.setData({
                        account_money: data.data.money,
                    })
                } else {
                    this.setData({
                        account_money: 0,
                    })
                }
            }
        })
    },
    //关闭支付框
    cloose_pay: function(event) {
        this.setData({
            pay_status: 'display:none;',
        })
    },
    //选择付款方式
    chooseway: function(event) {
        var paytype = orderkj.getDataSet(event, 'id')
            // if(this.data.paytype == ''){
            //     this.setData({
            //         paytype:paytype,
            //     });
            // }

        if (paytype == 1) {
            this.setData({
                paytype: 1,
            })
        }
        if (paytype == 2) {
            this.setData({
                paytype: 2,
            })
        }
    },
    /*关闭窗口*/
    closeWindow: function() {
        this.setData({
            popFlag: true,
        })
    },

    //立即支付
    gopay: function(event) {
        var that = this
            //防重复点击
        orderkj.buttonClicked(that)

        if (that.data.paytype == 1) {
            //充值余额支付
            var par = {
                p_id: that.data.order_arr.p_id,
                //                coupon_id:that.data.coupon_id?this.data.coupon_id:0,
                order_id: that.data.order_arr.order_id,
            }
            orderkj.gopaymoney(par, (data) => {
                //                console.log(data);
                if (data.err == 1000) {
                    that.setData({
                        balance: data.data.res_value,
                        pay_success: 'display:block;',
                        pay_status: 'display:none;',
                    })
                }
                // if(data.err==1014){
                //     var short_money = data.data.act_money - data.data.res_value;
                //     that.setData({
                //         balance:data.data.res_value,
                //         short_money:short_money.toFixed(2),
                //         pay_fail:'display:block;',
                //     });
                // }

                // if(data.err==1009){
                //     wx.showToast({
                //         title: data.msg,
                //         icon: 'none',
                //         duration: 2000
                //     })
                // }
            })
        }
        if (that.data.paytype == 2) {
            //微信直接支付
            var par = {
                p_id: that.data.order_arr.p_id,
                coupon_id: that.data.coupon_id ? this.data.coupon_id : 0,
                order_id: that.data.order_arr.order_id,
            }
            orderkj.wxpaymoney(par, (data) => {
                that.setData({
                    ticket_status: 1,
                    coupon_money: that.data.coupon,
                    blpay: 0, //微信直接支付再次付款订单，只显示微信支付,不显示余额支付
                })

                //充值成功回调刷新
                if (data == 2) {
                    //支付成功-关闭弹窗
                    that.closeWindow()
                        //弹出去无疆盒子宝界面
                    that.setData({
                        pay_success1: 'display:block;',
                    })
                } else if (data == 1) {
                    //支付失败&用户取消支付
                    wx.showToast({
                        title: '支付失败',
                        icon: 'none',
                        duration: 2000,
                    })
                }
            })
        }
    },
})