// pages/materorder/materorder.js
import { Materorder } from 'materorder-model.js'
var materorder = new Materorder() //实例化 首页 对象
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
        sharetitle: '',
        shareimg: '',
        encode: '',
        back_url: '',
        pay_status: 'display:none;',
        class_name1: '',
        class_name2: '',
        blpay: 0,
        wxpay: 1,
        paytype: 2,
        pindex: 0,
        is_fit: 0,
        pretype: 0,
        from: 0,
        reduce_money: 0, //随机立减金额
        is_reduce: 0, //0不立减1立减
        tm_key: 0,
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

        if (option.from) {
            this.setData({
                from: option.from,
            })
        }

        if (option.tm_key) {
            this.setData({
                tm_key: option.tm_key,
            })
        }
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
                data.otime = materorder.formatTimeTwo(data.otime, 'Y-M-D h:m:s')
                    //有没有随机立减
                if (data.is_reduce == 1) {
                    var nmoney = data.money - data.reduce_money >= 0 ? (data.money - data.reduce_money).toFixed(2) : 0
                    var coupon = data.reduce_money
                    var reduce_money = data.reduce_money
                } else {
                    var nmoney = data.money.toFixed(2)
                    var coupon = 0
                }
                that.setData({
                    order_arr: data,
                    money: nmoney,
                    coupon: coupon,
                    reduce_money: reduce_money,
                    is_reduce: data.is_reduce ? data.is_reduce : 0,
                    order_id: data.order_id,
                    s_id: data.s_id,
                    imgurl1: materorder.ImgUrl1,
                    pay_fail: 'display:none;',
                    ticket_status: data.ticket_status,
                    pretype: data.pretype,
                })

                //如果存在符合要求的优惠券，就默认显示第一张
                if (data.ticket_status == 0) {
                    if (data.new_ticket_list[1]) {
                        if (data.new_ticket_list[1].t_type == 1) {
                            //满减券
                            if (data.money < data.new_ticket_list[1].full_money) {
                                //未达条件
                                //有没有随机立减
                                if (data.is_reduce == 1) {
                                    var nmoney = data.money - data.reduce_money >= 0 ? (data.money - data.reduce_money).toFixed(2) : 0
                                    var coupon = data.reduce_money
                                } else {
                                    var nmoney = data.money.toFixed(2)
                                    var coupon = 0
                                }
                                that.setData({
                                    pindex: 0,
                                    money: nmoney,
                                    coupon: coupon,
                                    coupon_id: 0,
                                })
                            } else {
                                //已达条件
                                var coupon_id = data.new_ticket_list[1].id //个人满减券id
                                var cmoney = data.new_ticket_list[1].reduce_money //可减的金额

                                //有没有随机立减
                                if (data.is_reduce == 1) {
                                    var nmoney =
                                        data.money - data.reduce_money - cmoney >= 0 ?
                                        (data.money - data.reduce_money - cmoney).toFixed(2) :
                                        0
                                    var coupon = (parseFloat(data.reduce_money) + parseFloat(cmoney)).toFixed(2)
                                } else {
                                    var nmoney = data.money - cmoney >= 0 ? (data.money - cmoney).toFixed(2) : 0
                                    var coupon = cmoney
                                }

                                // var nmoney = data.money - cmoney>=0?data.money - cmoney:0;
                                that.setData({
                                    pindex: 1,
                                    money: nmoney,
                                    coupon: coupon,
                                    coupon_id: coupon_id,
                                })
                            }
                        } else {
                            //抵扣券
                            var coupon_id = data.new_ticket_list[1].id //个人优惠券id
                            var cmoney = data.new_ticket_list[1].money //优惠的金额

                            //有没有随机立减
                            if (data.is_reduce == 1) {
                                var nmoney =
                                    data.money - data.reduce_money - cmoney >= 0 ?
                                    (data.money - data.reduce_money - cmoney).toFixed(2) :
                                    0
                                var coupon = (parseFloat(data.reduce_money) + parseFloat(cmoney)).toFixed(2)
                            } else {
                                var nmoney = data.money - cmoney >= 0 ? (data.money - cmoney).toFixed(2) : 0
                                var coupon = cmoney
                            }
                            // var nmoney = data.money - cmoney>=0?data.money - cmoney:0;
                            that.setData({
                                pindex: 1,
                                money: nmoney,
                                coupon: coupon,
                                coupon_id: coupon_id,
                            })
                        }
                    }
                }

                //微信支付产生的待支付订单，优惠券不可更改
                if (data.ticket_status == 1) {
                    //有没有随机立减
                    if (data.is_reduce == 1) {
                        var nmoney =
                            data.money - data.reduce_money - data.coupon_money >= 0 ?
                            (data.money - data.reduce_money - data.coupon_money).toFixed(2) :
                            0
                        var coupon = (parseFloat(data.reduce_money) + parseFloat(data.coupon_money)).toFixed(2)
                    } else {
                        var nmoney = data.money - data.coupon_money >= 0 ? (data.money - data.coupon_money).toFixed(2) : 0
                        var coupon = data.coupon_money
                    }
                    // var nmoney = data.money - data.coupon_money>=0?data.money - data.coupon_money:0;
                    that.setData({
                        coupon_money: data.coupon_money,
                        money: nmoney,
                        coupon: coupon,
                    })
                }
            },
        }

        materorder.getpreorderinfo(par)

        //查询分享图和对应标题
        //        var type =1;//首页
        //        materorder.getShareConfig(type,(data)=>{
        //            if(data.err == 0){
        //                var back_url = encodeURIComponent('/pages/login/login');
        //                that.setData({
        //                    sharetitle:data.data.title,
        //                    shareimg:data.data.imgurl,
        //                    encode:data.data.encode,
        //                    back_url:back_url
        //                })
        //            }
        //        })
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

    /**
     * 用户点击右上角分享
     */
    //  onShareAppMessage: function () {
    //    //from menu
    //    return {
    //        title: that.data.sharetitle,
    //        path: '/pages/login/login?encode='+that.data.encode+'&back_url='+that.data.back_url,
    //        imageUrl:that.data.shareimg
    //    }
    //  },
    //支付成功，返回首页、店铺、盒柜
    tocart: function(event) {
        var jumptype = materorder.getDataSet(event, 'jumptype')
        if (jumptype == 1) {
            //回首页
            // wx.switchTab({
            //     url: '/pages/index/index'
            // })
            if (this.data.tm_key.length > 1) {
                //去带货个人主页
                wx.redirectTo({
                    url: '../myhome/myhome?tg=' + this.data.tm_key,
                })
            } else {
                //回首页
                wx.switchTab({
                    url: '/pages/index/index',
                })
            }
        }
        if (jumptype == 2) {
            //回店铺
            // wx.reLaunch({
            //    url: '/pages/shop/shop?id='+this.data.s_id,
            // })
            //继续买
            wx.navigateBack({
                delta: 1,
            })
        }
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
    //显示代金券列表
    //  loockcoupon:function (event){
    //      this.setData({
    //        c_style:'display:block;'
    //      });
    //  },
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
                        //有没有随机立减
                    if (that.data.is_reduce == 1) {
                        var nmoney =
                            that.data.order_arr.money - that.data.reduce_money - cmoney >= 0 ?
                            (that.data.order_arr.money - that.data.reduce_money - cmoney).toFixed(2) :
                            0
                        var coupon = (parseFloat(that.data.reduce_money) + parseFloat(cmoney)).toFixed(2)
                    } else {
                        var nmoney = that.data.order_arr.money - cmoney >= 0 ? (that.data.order_arr.money - cmoney).toFixed(2) : 0
                        var coupon = cmoney
                    }

                    // var nmoney =  that.data.order_arr.money - cmoney>=0? that.data.order_arr.money - cmoney:0;
                    that.setData({
                        is_fit: 0,
                        pindex: val,
                        money: nmoney,
                        coupon: coupon,
                        coupon_id: coupon_id,
                    })
                } else {
                    //未达条件
                    wx.showToast({
                        title: '使用条件不符',
                        icon: 'none',
                        duration: 2000,
                    })

                    //有没有随机立减
                    if (that.data.is_reduce == 1) {
                        var nmoney =
                            that.data.order_arr.money - that.data.reduce_money >= 0 ?
                            (that.data.order_arr.money - that.data.reduce_money).toFixed(2) :
                            0
                        var coupon = that.data.reduce_money
                    } else {
                        var nmoney = that.data.order_arr.money >= 0 ? that.data.order_arr.money.toFixed(2) : 0
                        var coupon = 0
                    }

                    that.setData({
                        is_fit: 1,
                        money: nmoney,
                        coupon: coupon,
                        coupon_id: 0,
                    })
                }
            } else {
                //抵扣券
                this.data.coupon_id = new_ticket_list[val].id //个人优惠券id
                var cmoney = new_ticket_list[val].money //优惠的金额

                //有没有随机立减
                if (that.data.is_reduce == 1) {
                    var nmoney =
                        that.data.order_arr.money - that.data.reduce_money - cmoney >= 0 ?
                        (that.data.order_arr.money - that.data.reduce_money - cmoney).toFixed(2) :
                        0
                    var coupon = (parseFloat(that.data.reduce_money) + parseFloat(cmoney)).toFixed(2)
                } else {
                    var nmoney = that.data.order_arr.money - cmoney >= 0 ? (that.data.order_arr.money - cmoney).toFixed(2) : 0
                    var coupon = cmoney
                }

                // var nmoney = this.data.order_arr.money - cmoney>=0?this.data.order_arr.money - cmoney:0;

                this.setData({
                    is_fit: 0,
                    pindex: val,
                    money: nmoney,
                    coupon: coupon,
                })
            }
        } else {
            var cmoney = 0 //优惠的金额
                //有没有随机立减
            if (that.data.is_reduce == 1) {
                var nmoney =
                    that.data.order_arr.money - that.data.reduce_money - cmoney >= 0 ?
                    (that.data.order_arr.money - that.data.reduce_money - cmoney).toFixed(2) :
                    0
                var coupon = (parseFloat(that.data.reduce_money) + parseFloat(cmoney)).toFixed(2)
            } else {
                var nmoney = that.data.order_arr.money - cmoney >= 0 ? (that.data.order_arr.money - cmoney).toFixed(2) : 0
                var coupon = cmoney
            }
            // var nmoney = this.data.order_arr.money - cmoney>=0?this.data.order_arr.money - cmoney:0;
            this.setData({
                money: nmoney,
                coupon: coupon,
            })
        }

        this.setData({
            pindex: val,
        })
    },

    //打开付款方式选择界面
    openway: function() {
        wx.requestSubscribeMessage({
            tmplIds: ['d0eB8jRCSRzMGh8ree2vlJAiB3LJ-nrgxdqogyXY63s'], //b2gJCV2YT5YuPCG9GMVhw98u1ivlS0yJmhqGMEKaQSc
            success(res) {
                console.log('789798', res)
            },
        })
        this.setData({
            pay_status: 'display:block;',
        })
        var par = ''
        materorder.gopayment(par, (data) => {
            //微信直接支付再次付款订单，只显示微信支付,不显示余额支付
            // if(this.data.ticket_status==1){
            //     this.setData({
            //         blpay:0,
            //         paytype:2,
            //     });
            // }else{
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
            // }
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
        var paytype = materorder.getDataSet(event, 'id')
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
    toastMsg(msg) {
        wx.showToast({
            title: msg,
            icon: 'none',
            duration: 2000,
        })
    },
    goMessage: function() {
        var that = this
        try {
            if (wx.requestSubscribeMessage) {
                wx.requestSubscribeMessage({
                    tmplIds: ['LCEDC2U8IUdB9qEJXvzs2K8TDdmoW4PYq_BtnwO2iKI'],
                    success(res) {
                        if (res.LCEDC2U8IUdB9qEJXvzs2K8TDdmoW4PYq_BtnwO2iKI == 'accept') {
                            that.toastMsg('预售到货通知订阅成功喽~')
                        } else {
                            that.toastMsg('您取消了订阅哦~')
                        }
                    },
                    fail(res) {
                        that.toastMsg('您取消了订阅哦~')
                    },
                })
            } else {
                console.log('版本太低')
            }
        } catch (e) {
            console.log(e)
        }
    },

    //立即支付
    gopay: function(event) {
        var that = this
            //防重复点击
        materorder.buttonClicked(this)
        if (that.data.paytype == 1) {
            //充值余额支付
            var par = {
                p_id: that.data.order_arr.p_id,
                coupon_id: that.data.coupon_id ? this.data.coupon_id : 0,
                order_id: that.data.order_arr.order_id,
            }
            materorder.gopaymoney(par, (data) => {
                if (data.err == 1000) {
                    if (that.data.pretype == 1) {
                        that.goMessage()
                    }
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
            materorder.wxpaymoney(par, (data) => {
                that.setData({
                    ticket_status: 1,
                    coupon_money: that.data.coupon - that.data.reduce_money,
                    // blpay:0,//微信直接支付再次付款订单，只显示微信支付,不显示余额支付
                })

                //充值成功回调刷新
                if (data == 2) {
                    //支付成功-关闭弹窗
                    that.closeWindow()

                    //获取用户权限，用户预售商品通知发货和货物存放到期通知
                    if (that.data.pretype == 1) {
                        that.goMessage()
                    }

                    //无疆盒子宝界面
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