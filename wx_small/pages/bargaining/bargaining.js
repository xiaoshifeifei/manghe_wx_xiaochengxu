// pages/bargaining/bargaining.js
import { BargainIng } from 'bargaining-model.js'
var bargaining = new BargainIng()
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        image23: bargaining.image23,
        wClicked: false,
        PriceImg: bargaining.PriceImg,
        WaveImg: bargaining.WaveImg,
        allPro: [],
        p: 1,
        nextPage: 1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this._closeShare()
        var icode = options.sharecode
        if (!icode) {
            return false
        }
        //获取砍价分享信息
        this._loadData(icode)
        this.judge_px()
    },

    judge_px: function() {
        let isPhoneX = app.globalData.isIphoneX
        if (isPhoneX) {
            this.setData({
                isIphoneX: true,
            })
        }
    },
    /*关闭顶部share*/
    _closeShare: function() {
        wx.hideShareMenu()
    },
    /*加载数据*/
    _loadData: function(icode) {
        var that = this
        bargaining.getShareDetail(icode, (data) => {
            if (data.err == 0) {
                that.setData({
                    minfo: data.data.minfo,
                    product: data.data.product,
                    shareData: data.data.share,
                    actData: data.data.act,
                    cutInfo: data.data.cut_info,
                })
                that._setTitle(data.data.product.pname)
                    //热门列表
                that._getHotList(data.data.share.act_id)
            }
        })
    },
    /*设置title*/
    _setTitle: function(title) {
        wx.setNavigationBarTitle({
            title: title,
        })
    },

    /*热卖列表*/
    _getHotList: function(id) {
        var that = this
        bargaining.getHotList(id, (data) => {
            if (data.err == 0) {
                that.setData({
                    hotList: data.data.hotlist,
                })
                that._getAllPro()
            }
        })
    },

    /*所有商品列表*/
    _getAllPro: function() {
        var p = this.data.p,
            nextPage = this.data.nextPage,
            allPro = this.data.allPro,
            len = this.data.hotList.length,
            that = this
        if (nextPage == 0) {
            bargaining.toastMsg('没有更多内容了哦~')
            return false
        }
        bargaining.getAllProList(p, len, (data) => {
            if (data.err == 0) {
                var newData = allPro.concat(data.data.list)
                that.setData({
                    allPro: newData,
                    nextPage: data.data.nextPage,
                    p: p + 1,
                })
            }
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this._getAllPro()
    },

    /*跳转奖励立即购买*/
    goLink: function(event) {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            bargaining._authCheckWin()
            return false
        }

        let link = bargaining.getDataSet(event, 'link')
        wx.navigateTo({
            url: link,
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        var that = this
        if (res.from === 'button') {
            // 来自页面内转发按钮
            var title = '就差你这一刀了，快来帮我砍价抢' + that.data.product.pname + '吧！'
            var imageUrl = that.data.product.shareimg
            var code = that.data.shareData.icode
            return {
                title: title,
                path: '/pages/bargainlog/bargainlog?sharecode=' + code, //分享标识
                imageUrl: imageUrl,
            }
        } else {
            // 来自右上角的按钮
            var title = '就差你这一刀了，快来帮我砍价抢' + that.data.product.pname + '吧！'
            var imageUrl = that.data.product.shareimg
            var code = that.data.shareData.icode
            return {
                title: title,
                path: '/pages/bargainlog/bargainlog?sharecode=' + code, //分享标识
                imageUrl: imageUrl,
            }
        }
    },
    /*更多商品-跳转到无疆盒子宝主页*/
    moreProduct: function() {
        //直接跳转首页
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    /*帮助砍价*/
    helpCut: function() {
        var that = this
        var icode = that.data.shareData.icode
        bargaining.goHelpCut(icode, (data) => {
            if (data.err == 0) {
                //展示砍掉价格
                var price = data.data.selfc_price
                    //砍价成功
                wx.showToast({
                        title: data.data.message,
                        icon: 'none',
                        duration: 3000,
                    })
                    //重新加载数据
                that._setCutedData(data.data)
            }
        })
    },
    /*重置数据*/
    _setCutedData: function(res) {
        var shareData = this.data.shareData
        shareData['cut_num'] = res.cut_num
        var product = this.data.product
        product['percent'] = res.percent
        product['percent1'] = res.percent1
        product['cuted_price'] = res.cuted_price
        product['cut_price'] = res.cut_price
        product['left_txt'] = res.left_txt
        product['left_price'] = res.left_price
        this.setData({
            product: product,
            shareData: shareData,
            cutInfo: res.cut_info, //砍价用户列表
        })
    },
    /*领取礼包*/
    getAward: function() {
        var that = this
        var icode = that.data.shareData.icode
        bargaining.getCutAward(icode, (data) => {
            if (data.err == 0) {
                //礼包领取成功
                wx.showToast({
                    title: '礼包领取成功',
                    icon: 'success',
                    duration: 2000,
                })
            }
        })
    },
    /*立即购买*/
    goBuy: function() {
        var id = this.data.product.id
        wx.navigateTo({
            url: '../bargaindetail/bargaindetail?id=' + id,
        })
    },
    /*按钮点击失效*/
    _disableButton: function() {
        var that = this
        that.setData({
                wClicked: true,
            })
            //按钮还原
        setTimeout(function() {
            that.setData({
                wClicked: false,
            })
        }, 1000)
    },
})