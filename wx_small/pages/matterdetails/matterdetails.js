// pages/details/details.js
import { MatterDetails } from 'matterdetails-model.js';
var matterdetails = new MatterDetails(); //实例化 盒子页 对象
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
        pic_url: matterdetails.ImgUrl,
        tm_key: 0,
        is_spec:0,
        is_code:0,
        spec_code_id:0,
        style1:'display:none;',
        style2:'display:none;',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (option) {
        // this.setData({
        //     p_id:option.p_id,
        //     s_id:option.s_id
        // })  
        // if(option.from){
        //     this.setData({
        //         from:option.from
        //     })  
        // }
    },
    /**
    * 生命周期函数--监听页面显示
    */
    onShow: function () {
        var curPages = getCurrentPages();
        var currentPage = curPages[curPages.length - 1].options;
        // console.log(curPages);
        console.log(currentPage);
        this.setData({
            p_id: currentPage.p_id,
            s_id: currentPage.s_id
        })
        if (currentPage.tm_key) {
            this.setData({
                tm_key: currentPage.tm_key,
            })
        }
        if (currentPage.from) {
            this.setData({
                from: currentPage.from
            })
        }

        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            wx.navigateTo({
                url: '../logauth/logauth'
            })
            return false
        }
        this._loadData();
    },
    _loadData: function () {
        var that = this
        //        that.setData({
        //            pic:'普通商品'
        //        })                                       

        var par = {
            p_id: this.data.p_id,
            s_id: this.data.s_id,
            that: that,
            sku_id: 0,
            callback: function (data) {
                if (data.pretype == 1) {
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
                    title: data.title
                })
                that.data.showdata = data;
                that.data.num = 1;
                that.data.sku_id = data.models[0].id;
                that.setData({
                    showdata: data,
                    total_money: data.price,
                    buy_style: 'display:block;',
                    num: 1,
                    is_spec:data.is_spec,
                    shareimg: 'https:' + data.images.pic1
                });
            }
        }

        matterdetails.getDetailData(par);

        //查询分享图和对应标题
        var type = 13;//商品详情
        var p_id = this.data.p_id;
        var tm_key = this.data.tm_key;
        matterdetails.getShareConfig(type,p_id,tm_key, (data) => {
            if (data.err == 0) {
                var back_url = encodeURIComponent('/pages/matterdetails/matterdetails?s_id=' + that.data.s_id + '&p_id=' + that.data.p_id + '&whr=' + that.data.whr+'&tm_key='+that.data.tm_key);
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


    //去对应店铺首页
    goshophome: function (event) {
        var s_id = matterdetails.getDataSet(event, 's_id');
        if (this.data.from == 'shop') {
            //店铺出发到店铺，这里防止打开多层页面
            console.log('shopshop');
            wx.navigateBack({
                delta: 1
            })

        } else {
            wx.navigateTo({
                url: '../shop/shop?id=' + s_id,
            })
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
        if(this.data.is_spec==1){
            //需要购买权的商品，只能买1个
            wx.showToast({
                title: '购买权商品数量上限为1',
                icon: 'none',
                duration: 2000
            })

        }else{
            var type = matterdetails.getDataSet(event, 'type');
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
        }
        
    },

    //生成普通商品预支付订单
    toorder: function (event) {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            matterdetails._authCheckWin()
            return false
        }
        //防重复点击
        matterdetails.buttonClicked(this);
        var p_id = this.data.p_id;
        var num = this.data.num;
        var sku_id = this.data.sku_id;
        var tm_key = this.data.tm_key;
        let spec_code_id = this.data.spec_code_id;
        //店铺实物
        var par = {
            p_id: p_id,
            sku_id: sku_id,
            num: num,
            tm_key:tm_key,
            spec_code_id:spec_code_id,
            callback: function (data) {
                if(data.golist==1){
                    wx.navigateTo({
                        url: '../orderlist/orderlist'
                    })
                }else{
                    var order_id = data.order_id;
                    wx.navigateTo({
                        url: '../materorder/materorder?order_id=' + order_id + '&tm_key='+tm_key
                    })
                }
                
            }
        }
        matterdetails.getpreorder(par);

    },
    //选择款式
    choosemodel: function (event) {
        var that = this;
        that.data.sku_id = matterdetails.getDataSet(event, 'sku_id');
        var par = {
            p_id: that.data.p_id,
            s_id: that.data.s_id,
            that: that,
            sku_id: that.data.sku_id,
            callback: function (data) {
                that.data.showdata = data;
                that.data.pb_id = data.pb_id;
                that.data.num = 1;
                var price = data.price
                that.setData({
                    showdata: data,
                    total_money: price,
                    buy_style: 'display:block;',
                    num: 1,
                });

            }
        }

        matterdetails.getDetailData(par);
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
    },

    //判断有无购买权
    tospec:function(){
        let that = this;
        let p_id = that.data.p_id;
        let num = that.data.num;
        let sku_id = that.data.sku_id;
        matterdetails.getSpecInfo(p_id,sku_id,num,(data) => {
            if (data.err == 0) {
                // console.log(data.data);
                that.setData({
                    is_code: data.data.is_code,
                    res_bscode:data.data.res_bscode
                })
                if(that.data.is_spec==1 && that.data.is_code==0){
                    wx.showToast({
                        title: data.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }

                if(that.data.is_spec==1 && that.data.is_code==1){
                    that.setData({
                        style2:'display:block;',
                        spec_code_id:data.data.res_bscode.id
                    })
                }
            }
        })

    },

    //关闭购买权码提示框，确定后产生待支付订单
    gospec:function(event){
        let type = matterdetails.getDataSet(event, 'type');
        this.setData({
            style2:'display:none;'
        })
        if(type==1){
            //确定使用购买权去购买
            this.toorder();
        }
    }

})