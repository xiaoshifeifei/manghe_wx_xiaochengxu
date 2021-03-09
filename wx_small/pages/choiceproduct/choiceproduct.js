// pages/choiceproduct/choiceproduct.js
import {ChoiceProduct} from "choiceproduct-model.js"
        var choiceproduct = new ChoiceProduct()
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        WaveImg: choiceproduct.WaveImg,
        p: 1,
        isEnd: 1,
        proData: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var pmc_id = this.options.pmc_id //模块id
        this.setData({
            pmc_id: pmc_id
        })
        this.getProduct()
    },

    /*获取标签对应的商品列表*/
    getProduct: function () {
        var that = this
        var pmc_id = that.data.pmc_id
        var p = that.data.p
        var isEnd = that.data.isEnd
        if (isEnd == 0) {
//            choiceproduct.toastMsg("没有更多内容喽~")
            return false
        }
        var proData = that.data.proData
        choiceproduct.getChoiceProducts(pmc_id, p, (data) => {
            if (data.err == 0) {
                var newData = proData.concat(data.data.list)
                var prosty = null
                if (parseInt(newData.length) % 2 == 1) {
                    prosty = parseInt(newData.length) - 1
                }
                wx.setNavigationBarTitle({
                    title: data.data.title
                })
                that.setData({
                    proData: newData,
                    p: p + 1,
                    isEnd: data.data.nextPage,
                    prosty: prosty
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
        app.playMusic('backMusic')
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
        var that = this
        var pmc_id = that.data.pmc_id
        var p = 1 
        wx.showNavigationBarLoading() //在标题栏中显示加载
        choiceproduct.getChoiceProducts(pmc_id, p, (data) => {
            if (data.err == 0) {
                that.setData({
                    proData: []
                })
                
                var newData = that.data.proData.concat(data.data.list)
                var prosty = null
                if (parseInt(newData.length) % 2 == 1) {
                    prosty = parseInt(newData.length) - 1
                }
                wx.setNavigationBarTitle({
                    title: data.data.title
                })
                that.setData({
                    proData: newData,
                    p: p + 1,
                    isEnd: data.data.nextPage,
                    prosty: prosty
                })
            }
            
            // complete
            wx.hideNavigationBarLoading() //完成停止加载

            wx.stopPullDownRefresh() //停止下拉刷新
            wx.showToast({
                title: '刷新成功',
                icon: 'none',
                duration: 1000
            })
        })
    },

    /*跳转详情页*/
    goLink: function (event) {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            choiceproduct._authCheckWin()
            return false
        }

        let link = choiceproduct.getDataSet(event, 'link')
        wx.navigateTo({
            url: link
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getProduct()
    }
})