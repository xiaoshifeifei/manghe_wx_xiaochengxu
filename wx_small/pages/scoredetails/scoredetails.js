// pages/scoredetails/scoredetails.js
import { ScoreDetails } from 'scoredetails-model.js';
var scoredetails = new ScoreDetails(); //实例化 盒子页 对象
var WxParse = require('../../assets/wxParse/wxParse/wxParse.js');
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
        p_id: '',
        s_id: '',
        pic_url: scoredetails.ImgUrl,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (option) {
        this.setData({
            p_id: option.p_id,
            s_id: option.s_id
        })
    },
    _loadData: function () {
        
        //积分商品详情
        var p_id = this.data.p_id;
        var s_id = this.data.s_id;
        var that = this;
        var sku_id = 0;
        scoredetails.getDetailData(s_id, p_id, sku_id, (data) => {

            if (data.err == 0) {
                if (data.data.pretype == 1) {
                    //预售
                    that.setData({
                        pic: '抢先预订',
                    });
                } else {
                    //非预售
                    that.setData({
                        pic: '普通商品',
                    });
                }
                wx.setNavigationBarTitle({
                    title: data.data.title
                })
                that.setData({
                    showdata: data.data,
                    total_money: data.data.price,
                    buy_style: 'display:block;',
                    num: 1,
                    shareimg: 'https:' + data.data.images.pic1,
                    sku_id: data.data.models[0].id,
                });
                var content = data.data.content_images;
                WxParse.wxParse('article','html',content,that,25);
            }

        })


        //查询分享图和对应标题
        var type = 13;//商品详情
        scoredetails.getShareConfig(type, (data) => {
            if (data.err == 0) {
                var back_url = encodeURIComponent('/pages/scoredetails/scoredetails?s_id=' + that.data.s_id + '&p_id=' + that.data.p_id);
                that.setData({
                    sharetitle: data.data.title,
                    encode: data.data.encode,
                    back_url: back_url,
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            wx.navigateTo({
                url: '../logauth/logauth'
            })
            return false
        }
        this._loadData();
    },
    //去对应店铺首页
    goshophome: function (event) {
        var s_id = scoredetails.getDataSet(event, 's_id');
        wx.navigateTo({
            url: '../shop/shop?id=' + s_id,
        })
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
        var type = scoredetails.getDataSet(event, 'type');
        if (type == 1) {
            //减少
            if (this.data.num > 1) {
                var newnum = this.data.num - 1;
                this.data.num = newnum;
                var t_money = this.data.showdata.price * newnum;
                this.setData({
                    num: newnum,
                    total_money: t_money.toFixed(2),
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
            if (this.data.num < 12) {
                var orinum = this.data.num;
                var newnum = orinum + 1;
                this.data.num = newnum;
                var t_money = this.data.showdata.price * newnum;
                this.setData({
                    num: newnum,
                    total_money: t_money.toFixed(2),
                });
            } else {
                wx.showToast({
                    title: '购买数不大于12',
                    icon: 'none',
                    duration: 2000
                })
            }
        }
    },

    //生成积分商品预支付订单
    toorder: function (event) {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            scoredetails._authCheckWin()
            return false
        }
        //防重复点击
        scoredetails.buttonClicked(this);
        var p_id = this.data.p_id;
        var num = this.data.num;
        var sku_id = this.data.sku_id;

        //积分商品
        scoredetails.getpreorder(p_id, sku_id, num, (data) => {
            if(data.err==0){
                var order_id = data.data.order_id;
                wx.navigateTo({
                    url: '../pointorder/pointorder?order_id=' + order_id
                })
            }else{
                //报错
                wx.showToast({
                    title: data.data.msg,
                    icon: 'none',
                    duration: 2000
                })
            }
            
        });

    },
    //选择款式
    choosemodel: function (event) {
        var that = this;
        var p_id = that.data.p_id;
        var s_id = that.data.s_id;
        var sku_id = scoredetails.getDataSet(event, 'sku_id');
        that.data.sku_id = sku_id;
        scoredetails.getDetailData(s_id, p_id, sku_id, (data) => {
            that.setData({
                showdata: data.data,
                total_money: data.data.price,
                buy_style: 'display:block;',
                num: 1,
            });
        })
    },
    //分享效果
    onShareAppMessage: function () {
        //from menu
        var that = this;
        return {
            title: that.data.sharetitle,
            path: '/pages/login/login?type=1&encode=' + that.data.encode + '&back_url=' + that.data.back_url,
            imageUrl: that.data.shareimg
        }
    }
})