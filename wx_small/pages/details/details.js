// pages/details/details.js
import { Details } from 'details-model.js';
var details = new Details(); //实例化 盒子页 对象
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showdata: '',
        buy_style: 'display:none;',
        num: '1',
        total_money: '0',
        buttonClicked: false,
        sharetitle: '',
        shareimg: '',
        encode: '',
        back_url: '',
        pic_url :details.ImgUrl,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (option) {
//        this.data.p_id = option.p_id;
//        this.data.s_id = option.s_id;
        this.setData({
            p_id: option.p_id,
            s_id: option.s_id
        })
        this.data.whr = option.whr;
        this._loadData();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        

    },

    _loadData: function () {
        var that = this
        if (this.data.whr == 'ch') {
//            that.setData({
//                pic: '抽盒玩法',
//            })
        }
        ;
        if (this.data.whr == 'jf') {
            that.setData({
                pic: '积分玩法',
            })
        }
        ;
        if (this.data.whr == 'dp') {
            that.setData({
                pic: '盒子玩法',
            })
        }
        ;
        var par = {
            p_id: this.data.p_id,
            s_id: this.data.s_id,
            whr: this.data.whr,
            that: that,
            callback: function (data) {
                that.data.showdata = data;
                that.data.pb_id = data.pb_id;
                wx.setNavigationBarTitle({
                    title: data.title
                })
                if (that.data.whr == 'ch') {
                    if(data.pretype==1){
                        //预售
                        that.setData({
                            showdata: data,
                            shareimg: 'https:' + data.images.pic1,
                             pic: '抢先预订',
                        });
                    }else{
                        //非预售
                        that.setData({
                            showdata: data,
                            shareimg: 'https:' + data.images.pic1,
                            pic: '抽盒玩法',
                        });
                    }
                    
                }
                ;
                if (that.data.whr == 'jf') {
                    that.data.num = 1;
                    that.setData({
                        showdata: data,
                        total_money: data.point_price,
                        buy_style: 'display:block;',
                        num: 1,
                        shareimg: 'https:' + data.images.pic1
                    });
                }
                ;
                if (that.data.whr == 'dp') {
                    that.data.num = 1;
                    that.setData({
                        showdata: data,
                        total_money: data.price,
                        buy_style: 'display:block;',
                        num: 1,
                        shareimg: 'https:' + data.images.pic1
                    });
                }
                ;
            }
        }

        details.getDetailData(par);

        //查询分享图和对应标题
        var type = 13;//商品详情
        details.getShareConfig(type, (data) => {
            if (data.err == 0) {
                var back_url = encodeURIComponent('/pages/details/details?s_id=' + that.data.s_id + '&p_id=' + that.data.p_id + '&whr=' + that.data.whr);
                that.setData({
                    sharetitle: data.data.title,
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

    cloose_coupon: function (event) {
        this.setData({
            style3: 'display:none;'
        });
    },
    open:function(){

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    //去对应店铺首页
    goshophome: function (event) {
        var s_id = details.getDataSet(event, 's_id');
        wx.navigateTo({
            url: '../shop/shop?id=' + s_id,
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

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

    changenum: function (event) {
        var type = details.getDataSet(event, 'type');
        if (type == 1) {
            //减少
            if (this.data.num > 1) {
                var newnum = this.data.num - 1;
                this.data.num = newnum;
                if (this.data.whr == 'jf') {
                    var t_money = this.data.showdata.point_price * newnum;
                }
                if (this.data.whr == 'dp') {
                    var t_money = this.data.showdata.price * newnum;
                }

                this.setData({
                    num: newnum,
                    total_money: t_money,
                });
            } else {
                wx.showToast({
                    title: '购买数不小于1',
                    icon: 'none',
                    duration: 2000
                })
            }
        }
        if (type == 2) {
            //增加
            if (this.data.num < 10) {
                var orinum = this.data.num;
                var newnum = orinum + 1;
                this.data.num = newnum;

                if (this.data.whr == 'jf') {
                    var t_money = this.data.showdata.point_price * newnum;
                }
                if (this.data.whr == 'dp') {
                    var t_money = this.data.showdata.price * newnum;
                }

                this.setData({
                    num: newnum,
                    total_money: t_money,
                });
            } else {
                wx.showToast({
                    title: '购买数不大于10',
                    icon: 'none',
                    duration: 2000
                })
            }
        }
    },
    //生成积分盲盒和店铺盲盒预支付订单
    toorder: function (event) {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            details._authCheckWin()
            return false
        }
        //防重复点击
        details.buttonClicked(this);
        var p_id = this.data.p_id;
        var pb_id = this.data.pb_id;
        var num = this.data.num;
        var whr = this.data.whr;

        if (whr == 'jf') {
            //积分盲盒预订单
            var par = {
                p_id: p_id,
                pb_id: pb_id,
                bpbp_id: '',
                act_id: '',
                sku_id: 0,
                num: num,
                callback: function (data) {
                    var order_id = data.order_id;
                    wx.navigateTo({
                        url: '../pointorder/pointorder?order_id=' + order_id
                    })
                }
            }
            details.getpreorder(par);

        }

        if (whr == 'dp') {
            //店铺盲盒预订单
            var par = {
                p_id: p_id,
                pb_id: pb_id,
                bpbp_id: '',
                act_id: '',
                sku_id: 0,
                num: num,
                callback: function (data) {
                    var order_id = data.order_id;
                    wx.navigateTo({
                        url: '../shoporder/shoporder?order_id=' + order_id
                    })
                }
            }
            details.getpreorder1(par);

        }
    },

    //自定义分享内容
    onShareAppMessage: function () {
        var that = this
        //from menu
        return {
            title: that.data.sharetitle,
            path: '/pages/login/login?type=1&encode=' + that.data.encode + '&back_url=' + that.data.back_url,
            imageUrl: that.data.shareimg
        }
    }
})