// pages/shoporder/shoporder.js
import { Shoporder } from 'shoporder-model.js'
var shoporder = new Shoporder() //实例化 首页 对象
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
        paytype: '',
        pindex: 0,
        is_fit: 0,
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
                data.otime = shoporder.formatTimeTwo(data.otime, 'Y-M-D h:m:s')
                that.setData({
                    order_arr: data,
                    money: data.money,
                    order_id: data.order_id,
                    imgurl1: shoporder.ImgUrl1,
                    pay_fail: 'display:none;',
                    ticket_status: data.ticket_status,
                })

                //如果存在符合要求的优惠券，就默认显示第一张
                if (data.ticket_status == 0) {
                    if (data.new_ticket_list[1]) {
                        if (data.new_ticket_list[1].t_type == 1) {
                            //满减券
                            if (data.money < data.new_ticket_list[1].full_money) {
                                //未达条件
                                that.setData({
                                    pindex: 0,
                                    money: data.money.toFixed(2),
                                    coupon: 0,
                                    coupon_id: 0,
                                })
                            } else {
                                //已达条件
                                var coupon_id = data.new_ticket_list[1].id //个人满减券id
                                var cmoney = data.new_ticket_list[1].reduce_money //可减的金额

                                var nmoney = data.money - cmoney >= 0 ? data.money - cmoney : 0
                                that.setData({
                                    pindex: 1,
                                    money: nmoney.toFixed(2),
                                    coupon: cmoney,
                                    coupon_id: coupon_id,
                                })
                            }
                        } else {
                            //抵扣券
                            var coupon_id = data.new_ticket_list[1].id //个人优惠券id
                            var cmoney = data.new_ticket_list[1].money //优惠的金额

                            var nmoney = data.money - cmoney >= 0 ? data.money - cmoney : 0
                            that.setData({
                                pindex: 1,
                                money: nmoney.toFixed(2),
                                coupon: cmoney,
                                coupon_id: coupon_id,
                            })
                        }
                    }
                }

                //微信支付产生的待支付订单，优惠券不可更改
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

        shoporder.getpreorderinfo(par)
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
        console.log(event)
        wx.switchTab({
            url: '/pages/box/box',
        })
    },
    //余额不足，前往充值
    topup: function(event) {
        console.log(event)
        wx.navigateTo({
            url: '../topup/topup?from=3',
        })
    },
    //显示代金券列表
    loockcoupon: function(event) {
        this.setData({
            c_style: 'display:block;',
        })
    },
    close: function() {
        this.setData({
            pay_fail: 'display:none;',
        })
    },

    points_: function(e) {
        var val = e.detail.value

        var new_ticket_list = this.data.order_arr.new_ticket_list
        var that = this
        if (val == 0) {
            that.setData({
                coupon_id: 0,
            })
        }
        if (val != 0) {
            if (new_ticket_list[val].t_type == 1) {
                //满减券
                if (that.data.order_arr.money >= new_ticket_list[val].full_money) {
                    //已达条件
                    var coupon_id = new_ticket_list[val].id //个人满减券id
                    var cmoney = new_ticket_list[val].reduce_money //可减的金额

                    var nmoney = that.data.order_arr.money - cmoney >= 0 ? that.data.order_arr.money - cmoney : 0
                    that.setData({
                        is_fit: 0,
                        pindex: val,
                        money: nmoney.toFixed(2),
                        coupon: cmoney,
                        coupon_id: coupon_id,
                    })
                } else {
                    //未达条件
                    wx.showToast({
                        title: '使用条件不符',
                        icon: 'none',
                        duration: 2000,
                    })

                    that.setData({
                        is_fit: 1,
                        money: that.data.order_arr.money.toFixed(2),
                        coupon: 0,
                        coupon_id: 0,
                    })
                }
            } else {
                //抵扣券
                this.data.coupon_id = new_ticket_list[val].id //个人优惠券id
                var cmoney = new_ticket_list[val].money //优惠的金额

                var nmoney = this.data.order_arr.money - cmoney >= 0 ? this.data.order_arr.money - cmoney : 0

                this.setData({
                    is_fit: 0,
                    pindex: val,
                    money: nmoney.toFixed(2),
                    coupon: cmoney,
                })
            }
        } else {
            var cmoney = 0 //优惠的金额
            var nmoney = this.data.order_arr.money - cmoney >= 0 ? this.data.order_arr.money - cmoney : 0
            this.setData({
                money: nmoney.toFixed(2),
                coupon: cmoney,
            })
        }

        this.setData({
            pindex: val,
        })
    },

    //打开付款方式选择界面
    openway: function() {
        this.setData({
            pay_status: 'display:block;',
        })
        var par = ''
        shoporder.gopayment(par, (data) => {
            //微信直接支付再次付款订单，只显示微信支付,不显示余额支付
            if (this.data.ticket_status == 1) {
                this.setData({
                    blpay: 0,
                    class_name2: 'mh_xzzf_02_02_h',
                    paytype: 2,
                })
            } else {
                if (data.data.blpay == 1 && data.data.wxpay == 1) {
                    this.setData({
                        class_name1: '',
                        class_name2: 'mh_xzzf_02_02_h',
                        blpay: 1,
                        wxpay: 1,
                        paytype: 2,
                    })
                }
                if (data.data.blpay == 1 && data.data.wxpay == 0) {
                    this.setData({
                        class_name1: 'mh_xzzf_02_02_h',
                        class_name2: '',
                        blpay: 1,
                        wxpay: 0,
                        paytype: 1,
                    })
                }
                if (data.data.blpay == 0 && data.data.wxpay == 1) {
                    this.setData({
                        class_name1: '',
                        class_name2: 'mh_xzzf_02_02_h',
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
        var paytype = shoporder.getDataSet(event, 'id')
        if (this.data.paytype == '') {
            this.setData({
                paytype: paytype,
            })
        }

        if (paytype == 1) {
            this.setData({
                class_name1: 'mh_xzzf_02_02_h',
                class_name2: '',
                paytype: 1,
            })
        }
        if (paytype == 2) {
            this.setData({
                class_name1: '',
                class_name2: 'mh_xzzf_02_02_h',
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
        shoporder.buttonClicked(that)

        if (that.data.paytype == 1) {
            //充值余额支付
            var par = {
                p_id: that.data.order_arr.p_id,
                coupon_id: that.data.coupon_id ? this.data.coupon_id : 0,
                order_id: that.data.order_arr.order_id,
            }
            shoporder.gopaymoney(par, (data) => {
                console.log(data)
                if (data.err == 1000) {
                    that.setData({
                        balance: data.data.res_value,
                        pay_success: 'display:block;',
                        pay_status: 'display:none;',
                    })
                }
                if (data.err == 1014) {
                    var short_money = data.data.act_money - data.data.res_value
                    that.setData({
                        balance: data.data.res_value,
                        short_money: short_money.toFixed(2),
                        pay_fail: 'display:block;',
                    })
                }

                if (data.err == 1009) {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none',
                        duration: 2000,
                    })
                }
            })
        }

        if (that.data.paytype == 2) {
            //微信直接支付
            var par = {
                p_id: that.data.order_arr.p_id,
                coupon_id: that.data.coupon_id ? this.data.coupon_id : 0,
                order_id: that.data.order_arr.order_id,
            }
            shoporder.wxpaymoney(par, (data) => {
                that.setData({
                    ticket_status: 1,
                    coupon_money: that.data.coupon,
                    blpay: 0, //微信直接支付再次付款订单，只显示微信支付,不显示余额支付
                })

                //充值成功回调刷新
                if (data == 2) {
                    //支付成功-关闭弹窗
                    that.closeWindow()
                        //弹出无疆盒子宝界面
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

        //        var par = {
        //            p_id:this.data.order_arr.p_id,
        //            coupon_id:this.data.coupon_id?this.data.coupon_id:0,
        //            order_id:this.data.order_arr.order_id,
        //            callback: function(data){
        //                if(data.data.err==1000){
        //                    that.setData({
        //                        balance:data.data.data.res_value,
        //                        pay_success:'display:block;',
        //                    });
        //                }
        //                if(data.data.err==1014){
        //                    var short_money = data.data.data.act_money - data.data.data.res_value;
        //                    that.setData({
        //                        balance:data.data.data.res_value,
        //                        short_money:short_money.toFixed(2),
        //                        pay_fail:'display:block;',
        //                    });
        //                }
        //
        //            }
        //        }
        //        shoporder.gopaymoney(par);
    },
})