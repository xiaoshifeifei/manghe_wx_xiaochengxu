// pages/openbox/openbox.js
import { Openbox } from 'openbox-model.js';
var openbox = new Openbox(); //实例化 盒子页 对象
var app = getApp();
var timePhoneShake;
var timeLookShake;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xy_style: 'transform: translateY(0rpx)',
        piece_style: 'display:none;',
        piece_class: '',
        piece_img: '',
        buttonClicked: false,
        status: true,
        status1: true,
        sharetitle: '',
        shareimg: '',
        encode: '',
        back_url: '',
        c_style: 'display:none;',
        c_style1: 'display:none;',
        c_style2: 'display:none;',
        c_style3: 'display:none;',
        c_style6: 'display:none;',
        loglist: '',
        remain_num: 0,
        c_style4: 'mh_pop_new_tab_hover',
        c_style5: '',
        log_status: 0,
        tm_key: 0,
        is_show_img:0,
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (option) {
        // this._phoneShake();//手机摇动
        // this._lookShake();//看一看摇动
        // this.data.p_id =option.p_id;
        // this.data.s_id = option.s_id;
        // this.data.pb_id = option.pb_id;
        // this.data.bpbp_id = option.bpbp_id;
        // this.data.box_id = option.box_id;
        this.setData({
            bpbp_id: option.bpbp_id,
        })
    },

    /**
      * 生命周期函数--监听页面显示
      */
    onShow: function () {
        var curPages = getCurrentPages();
        var currentPage = curPages[curPages.length - 1].options;
        // console.log(curPages);
        // console.log(currentPage);  
        this.setData({
            p_id: currentPage.p_id,
            s_id: currentPage.s_id,
            pb_id: currentPage.pb_id,
            // bpbp_id: currentPage.bpbp_id,
            box_id: currentPage.box_id,
        })
        if (currentPage.tm_key) {
            this.setData({
                tm_key: currentPage.tm_key,
            })
        }


        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            wx.navigateTo({
                url: '../logauth/logauth'
            })
            return false
        }

        this._phoneShake();//手机摇动
        this._lookShake();//看一看摇动

        //播放音乐
        app.playMusic('chooseMusic')
        this._loadData();
        this.animation1 = wx.createAnimation({
            transformOrigin: "center bottom",
            duration: 150,
            timingFunction: 'ease',
        })
        var that = this
        wx.startAccelerometer({
            interval: "normal",
            success(res) {
                that.onG()
            },
            complete(res) {

            }
        })

        //轮询刷新头像列表
        that.data.interval = setInterval(function () {
            var box_id = that.data.box_id;
            openbox.getCurrentNumber(box_id, (data) => {
                that.setData({
                    show_arr: data.data.show_arr,
                    people_nums: data.data.people_nums
                });
            });
        }, 100000);

    },

    /*加载数据*/
    _loadData: function () {
        var that = this;
        //获取盒子页数据 
        var par = {
            bpbp_id: this.data.bpbp_id,
            callback: function (data) {
                wx.setNavigationBarTitle({
                    title: data.pname
                })
                that.setData({
                    openboxdata: data,
                    box_num: data.box_num,
                    order_num: data.order_num,
                    img_piece: data.img_piece,
                    img_tip: data.img_tip,
                    postion: data.postion,
                    remain_num: data.remain_num,
                    log_status: data.log_status,
                    sku_id: 0,
                    imgurl1: openbox.ImgUrl1,
                    imgurl2: openbox.ImgUrl2,
                    imgurl3: openbox.ImgUrl3,
                    imgurl4: openbox.ImgUrl4,
                    imgurl5: openbox.ImgUrl5,
                    imgurl6: openbox.ImgUrl6,
                    imgurl7: openbox.ImgUrl7,
                    imgurl8: openbox.ImgUrl8,
                    imgurl9: openbox.ImgUrl9,
                    imgurl10: openbox.ImgUrl10,
                    show_arr: data.show_arr,
                    people_nums: data.people_nums,
                    shareimg: 'http:' + data.pimage,
                    tips1: data.tips1,
                    tips2: data.tips2,
                    tips3: data.tips3,
                    tips4: data.tips4,
                    tips5: data.tips5,
                    tips6: data.tips6,
                    tips10: data.tips10,
                    tips11: data.tips11,
                    tips12: data.tips12,
                    tips13: data.tips13,
                    is_look: data.is_look,
                    card1: data.card1,
                    card2: data.card2,
                    card3: data.card3,
                    is_show_img:data.is_show_img
                });

            }
        }

        openbox.getOpenBoxData(par);

        //查询分享图和对应标题
        var type = 5;//猜盒
        var p_id = this.data.p_id;
        var tm_key = this.data.tm_key;
        openbox.getShareConfig(type,p_id,tm_key,(data) => {
            if (data.err == 0) {
                //                console.log('/pages/openbox/openbox?bpbp_id='+this.data.bpbp_id+'&box_id='+this.data.box_id+'&p_id='+this.data.p_id+'&s_id='+this.data.s_id+'&pb_id='+this.data.pb_id);
                var back_url = encodeURIComponent('/pages/openbox/openbox?bpbp_id=' + this.data.bpbp_id+'&box_id='+this.data.box_id+'&p_id='+this.data.p_id+'&s_id='+this.data.s_id+'&pb_id='+this.data.pb_id + '&tm_key=' + this.data.tm_key);
                that.setData({
                    sharetitle: data.data.title,
                    //                    shareimg:data.data.imgurl,
                    encode: data.data.encode,
                    back_url: back_url
                })
            }
        })


    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    gohome: function () {     //
        wx.switchTab({
            url: '../index/index'
        })
    },
    cloose_coupon: function (event) {
        this.setData({
            c_style: 'display:none;'
        });
    },
    cloose_coupon1: function (event) {
        this.setData({
            c_style1: 'display:none;'
        });
    },
    cloose_coupon2: function (event) {
        this.setData({
            c_style2: 'display:none;'
        });
    },
    cloose_coupon3: function (event) {
        this.setData({
            c_style3: 'display:none;'
        });
    },
    cloose_coupon4: function (event) {
        this.setData({
            c_style6: 'display:none;'
        });
    },


    cloose: function (event) {

    },
    openlog: function (event) {
        var type = openbox.getDataSet(event, 'type');
        //摇一摇记录
        if (type == 5) {
            this.setData({
                c_style4: 'mh_pop_new_tab_hover',
                c_style5: ''
            });
        }
        //手气卡记录
        if (type == 6) {
            this.setData({
                c_style4: '',
                c_style5: 'mh_pop_new_tab_hover'
            });
        }
        var that = this;
        var bpbp_id = that.data.bpbp_id;
        openbox.getLoglist(bpbp_id, type, (data) => {
            this.setData({
                c_style: 'display:block;',
                loglist: data.data,
                log_status: data.data.log_status
            });
        });


    },
    openlook: function (event) {
        if(this.data.is_show_img==0){
            wx.showToast({
                title: '暂不支持该玩法',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if (this.data.is_look) {
            this.setData({
                c_style1: 'display:block;',
            });
        } else {
            this.setData({
                c_style3: 'display:block;',
            });
        }


    },


    //手气卡弹框
    opentips: function (event) {
        var bpbp_id = this.data.bpbp_id;
        openbox.getTipsConfig(bpbp_id, (data) => {
            if (data.err == 0) {
                this.setData({
                    c_style2: 'display:block;',
                    remain_num: data.data.remain_num,
                    tips7: data.data.tips7,
                    tips8: data.data.tips8,
                    tips9: data.data.tips9,
                });
            } else {
                wx.showToast({
                    title: data.msg,
                    icon: 'none',
                    duration: 2000
                })
            }
        })


    },
    //类似于泡泡,出有效提示
    getvalidtips: function (event) {
        var bpbp_id = this.data.bpbp_id;
        var that = this;
        if (that.data.status1 == true) {
            app.playMusic('shakeMusic');
            that.setData({
                status1: false
            })
            if (that.data.postion) {
                var pos = that.data.postion;
            } else {
                var pos = 10;
            }
            wx.vibrateLong({})
            var max_rotate = 20;
            var t_y = -100;
            var t_x = 10;
            that.animation1
                .rotate(max_rotate)
                .translateY(t_y)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 1)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 9.5)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 1.5)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 9)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 2)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 8.5)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 2.5)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 8)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 3)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 7.5)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 3.5)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 7)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 4)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 6.5)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 4.5)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 6)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 5)
                .translateX(0)
                .step()


                .rotate(0)
                .translateY(0)
                .translateX(0)
                .step()


            that.setData({ animation: that.animation1.export() });

            openbox.getVaildTips(bpbp_id, (data) => {

                //                    if(that.data.log_status==0){
                that.setData({
                    log_status: data.data.log_status
                })
                //                    }

                if (data.err == 0) {
                    wx.showToast({
                        title: data.data.message,
                        icon: 'none',
                        duration: 4000
                    })
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            })

            setTimeout(function () {
                that.setData({
                    status1: true
                })
            }, 3000);
        }
    },


    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.stopG();

        clearInterval(this.data.interval);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        console.log(333333);
        var that = this
        if (res.from === 'button') {
            // 来自页面内转发按钮
            //            var id = res.target.dataset['id']
            //            //获取商品图片&商品名称
            //            var info = that._getProductItem(id)
            //            var title = "就差你这一刀了，快来帮我砍价抢"+info['info']['pname']+"吧！"
            //            var imageUrl = "https:"+ info['info']['images']
            //            var code = that.data.shareData.icode
            //            return {
            //                title: title,
            //                path: '/pages/bargaining/bargaining?sharecode=' + code,//分享标识
            //                imageUrl: imageUrl
            //            }
        } else {
            //from menu
            return {
                title: that.data.sharetitle,
                path: '/pages/login/login?type=1&encode=' + that.data.encode + '&back_url=' + that.data.back_url,
                imageUrl: that.data.shareimg
            }
        }

    },

    /**
     * 
     * 看一看
     */
    look: function (event) {
        var that = this;
        this.setData({
            c_style1: 'display:none;',
        });
        //防重复点击
        openbox.buttonClicked(that);
        var bpbp_id = this.data.bpbp_id;
        var par = {
            bpbp_id: bpbp_id,
            callback: function (data) {
                //           console.log(Object.keys(data.img_piece).length) 
                //判断碎片动画播放的时间
                if (Object.keys(data.img_piece).length == 1) {
                    that.setData({
                        piece_style: 'display:block;',
                        piece_class: 'mh_me_aanimation mh_me_aanimation_03',
                        piece_img: data.img_piece.pic1,
                    });
                    wx.showToast({
                        title: data.tips_intro,
                        icon: 'none',
                        duration: 4000
                    })
                }

                setTimeout(function () {
                    that.setData({
                        img_piece: data.img_piece,
                        img_tip: data.img_tip,
                        piece_style: 'display:none;',
                        piece_class: '',
                        piece_img: '',
                    });
                }, 2000);

            }
        }

        openbox.getImgPieceData(par);

    },

    toorder: function (event) {

        //防重复点击
        openbox.buttonClicked(this);
        var p_id = this.data.p_id;
        var bpbp_id = this.data.bpbp_id;
        var num = 1;
        var tm_key = this.data.tm_key;
        clearInterval(this.data.interval);
        var box_id = this.data.box_id;
        openbox.getReduceNumber(box_id, (data) => {

        });
        var par = {
            p_id: p_id,
            bpbp_id: bpbp_id,
            num: num,
            tm_key:tm_key,
            callback: function (data) {
                var order_id = data.order_id;
                wx.navigateTo({
                    url: '../order/order?order_id=' + order_id+ '&tm_key='+tm_key
                })

            }
        }
        openbox.getpreorder(par);

    },

    change_small_box: function (event) {
        app.playMusic('btnMusic');
        var that = this;
        //防重复点击
        openbox.buttonClicked(that);
        var par = {
            bpbp_id: this.data.bpbp_id,
            box_id: this.data.box_id,
            callback: function (data) {
                that.setData({
                    bpbp_id: data.bpbp_id,
                })
                //播放动画
                that.animation = wx.createAnimation({
                    duration: 500,
                    timingFunction: 'ease',
                })
                that.animation
                    .scale3d(0.5, 0.5, 0.5).step()
                    .translateX(-300).opacity(0).step()
                    .translateY(-400).step()
                    .translateX(0).step()
                    .scale3d(1, 1, 1).opacity(1).step()
                    .translateY(0).step()
                that.setData({ animation: that.animation.export() })
                var back_url = encodeURIComponent('/pages/openbox/openbox?bpbp_id=' + data.bpbp_id+'&box_id='+that.data.box_id+'&p_id='+that.data.p_id+'&s_id='+that.data.s_id+'&pb_id='+that.data.pb_id + '&tm_key=' + that.data.tm_key);
                setTimeout(function () {
                    that.setData({
                        box_num: data.box_num,
                        order_num: data.order_num,
                        img_piece: data.img_piece,
                        img_tip: data.img_tip,
                        // bpbp_id: data.bpbp_id,
                        postion: data.postion,
                        remain_num: data.remain_num,
                        log_status: data.log_status,
                        sku_id: 0,
                        tips1: data.tips1,
                        tips2: data.tips2,
                        // tips3: data.tips3,
                        back_url: back_url,
                    });
                }, 3000);

            }
        }

        openbox.change_small_box(par);
    },

    onAccelerometerChange: function (res) {

        var that = this;
        if (Math.abs(res.x) >= 2) {
            if (that.data.status == true) {
                that.setData({
                    status: false
                })
                if (that.data.postion) {
                    var pos = that.data.postion;
                } else {
                    var pos = 10;
                }

                wx.vibrateLong({})
                var max_rotate = 20;
                var t_y = -100;
                var t_x = 10;
                that.animation1
                    .rotate(max_rotate)
                    .translateY(t_y)
                    .translateX(t_x)
                    .step()
                    .rotate(0)
                    .translateY(t_y / 10 * 1)
                    .translateX(0)
                    .step()

                    .rotate(max_rotate)
                    .translateY(t_y / 10 * 9.5)
                    .translateX(t_x)
                    .step()
                    .rotate(0)
                    .translateY(t_y / 10 * 1.5)
                    .translateX(0)
                    .step()

                    .rotate(max_rotate)
                    .translateY(t_y / 10 * 9)
                    .translateX(t_x)
                    .step()
                    .rotate(0)
                    .translateY(t_y / 10 * 2)
                    .translateX(0)
                    .step()

                    .rotate(max_rotate)
                    .translateY(t_y / 10 * 8.5)
                    .translateX(t_x)
                    .step()
                    .rotate(0)
                    .translateY(t_y / 10 * 2.5)
                    .translateX(0)
                    .step()

                    .rotate(max_rotate)
                    .translateY(t_y / 10 * 8)
                    .translateX(t_x)
                    .step()
                    .rotate(0)
                    .translateY(t_y / 10 * 3)
                    .translateX(0)
                    .step()

                    .rotate(max_rotate)
                    .translateY(t_y / 10 * 7.5)
                    .translateX(t_x)
                    .step()
                    .rotate(0)
                    .translateY(t_y / 10 * 3.5)
                    .translateX(0)
                    .step()

                    .rotate(max_rotate)
                    .translateY(t_y / 10 * 7)
                    .translateX(t_x)
                    .step()
                    .rotate(0)
                    .translateY(t_y / 10 * 4)
                    .translateX(0)
                    .step()

                    .rotate(max_rotate)
                    .translateY(t_y / 10 * 6.5)
                    .translateX(t_x)
                    .step()
                    .rotate(0)
                    .translateY(t_y / 10 * 4.5)
                    .translateX(0)
                    .step()

                    .rotate(max_rotate)
                    .translateY(t_y / 10 * 6)
                    .translateX(t_x)
                    .step()
                    .rotate(0)
                    .translateY(t_y / 10 * 5)
                    .translateX(0)
                    .step()


                    .rotate(0)
                    .translateY(0)
                    .translateX(0)
                    .step()


                that.setData({ animation: that.animation1.export() });

                app.playMusic('shakeMusic');

                var bpbp_id = that.data.bpbp_id;
                openbox.getVaildTips(bpbp_id, (data) => {
                    //            if(that.data.log_status==0){
                    that.setData({
                        log_status: data.data.log_status
                    })
                    //            }

                    if (data.err == 0) {
                        wx.showToast({
                            title: data.data.message,
                            icon: 'none',
                            duration: 4000
                        })
                    } else {
                        wx.showToast({
                            title: data.msg,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                })

                setTimeout(function () {
                    that.setData({
                        status: true
                    })
                }, 3000);
            }

        }
    },
    //手气卡机会消耗
    startG: function () {
        var that = this;
        that.setData({
            c_style2: 'display:none'
        })
        app.playMusic('shakeMusic');

        if (that.data.status == true) {
            that.setData({
                status: false
            })
            if (that.data.postion) {
                var pos = that.data.postion;
            } else {
                var pos = 10;
            }
            wx.vibrateLong({})
            var max_rotate = 20;
            var t_y = -100;
            var t_x = 10;
            that.animation1
                .rotate(max_rotate)
                .translateY(t_y)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 1)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 9.5)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 1.5)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 9)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 2)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 8.5)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 2.5)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 8)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 3)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 7.5)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 3.5)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 7)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 4)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 6.5)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 4.5)
                .translateX(0)
                .step()

                .rotate(max_rotate)
                .translateY(t_y / 10 * 6)
                .translateX(t_x)
                .step()
                .rotate(0)
                .translateY(t_y / 10 * 5)
                .translateX(0)
                .step()


                .rotate(0)
                .translateY(0)
                .translateX(0)
                .step()


            that.setData({ animation: that.animation1.export() });
            var bpbp_id = that.data.bpbp_id;
            openbox.shakeLuck(bpbp_id, (data) => {
                //            if(that.data.log_status==0){
                that.setData({
                    log_status: data.data.log_status
                })
                //            }
                that.setData({
                    remain_num: data.data.remain_num
                })
                if (data.err == 0) {
                    wx.showToast({
                        title: data.data.message,
                        icon: 'none',
                        duration: 6000
                    })
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none',
                        duration: 4000
                    })
                }
            })


            setTimeout(function () {
                that.setData({
                    status: true
                })
            }, 3000);
        }
    },

    onG: function () {
        var that = this
        wx.onAccelerometerChange((res) => {
            var pages = getCurrentPages();
            var currentPage = pages[pages.length - 1];
            if (currentPage.onAccelerometerChange) {
                currentPage.onAccelerometerChange(res)
            }
        }

        )

    },
    stopG: function () {
        var that = this;
        wx.stopAccelerometer({
            success(res) {

            }
        })
    },
    clickimg: function (event) {
        // var currenturl1 = openbox.getDataSet(event, 'currenturl1');
        // var currenturl2 = openbox.getDataSet(event, 'currenturl2');

        // var arr = [];
        // var img_piece = this.data.img_piece;
        // for (let i in img_piece) {
        //     arr.push('https:' + img_piece[i]); //属性
        // }
        // if (currenturl1) {
        //     wx.previewImage({
        //         current: 'https:' + currenturl1, // 当前显示图片的http链接
        //         urls: arr, // 需要预览的图片http链接列表
        //     })
        // }
        // if (currenturl2) {
        //     wx.previewImage({
        //         current: 'https:' + currenturl2, // 当前显示图片的http链接
        //         urls: arr, // 需要预览的图片http链接列表
        //     })
        // }

        this.setData({
            c_style6: 'display:block;'
        });


    },
    //手机摇动
    _phoneShake: function () {
        var animationShake = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease'
        })
        timePhoneShake = setInterval(function () {
            animationShake.rotate(15).step()
            animationShake.rotate(-15).step()
            this.setData({
                animationShake: animationShake.export()
            })
        }.bind(this), 1100)
    },
    //看一看放大
    _lookShake: function () {
        var animationLook = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease'
        })
        timeLookShake = setInterval(function () {
            animationLook.scale(1.2, 1.2).step()
            animationLook.scale(1, 1).step()
            this.setData({
                animationLook: animationLook.export()
            })
        }.bind(this), 1100)
    }


})