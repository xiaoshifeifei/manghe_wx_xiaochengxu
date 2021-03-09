// pages/allorder/allorder.js
import {Orderlist} from "orderlist-model.js"
        var orderlist = new Orderlist();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabBar: [{id: 1, name: "待支付"}, {id: 2, name: "已支付"}],
        tabBarIndex: 0,
        nowIndex: 1, //当前tabid
        isEnd1: 1,
        isEnd2: 1,
        p1: 1,
        p2: 1,
        orderList1: [],
        orderList2: [],
        loadingHidden: false,
        buttonClicked: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var nowIndex = parseInt(options.nowIndex)
        if (!nowIndex) {
            nowIndex = 1
        }
        var tabBarIndex = nowIndex - 1
        this.setData({
            nowIndex: nowIndex,
            tabBarIndex: tabBarIndex
        })

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getOrderList1();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        
        //判断当前index数据是否加载完全
        var type = this.data.nowIndex
        var is_end = this.data["isEnd" + type]
        if (is_end == 0) {
            wx.showToast({
                title: '没有更多记录~',
                icon: 'none',
                duration: 2000
            })
            return
        }
        this.getOrderList()
    },
    /*加载获取订单数据*/
    getOrderList: function () {
        var that = this;
        var type = this.data.nowIndex
        var p = that.data["p" + type]
        // console.log(p);
        orderlist.getAllOrder(type, p, (data) => {
            if (data.err == 0) {
                for (var x in data.data.express) {
                    if (data.data.express[x]['otime'] != 0) {
                        data.data.express[x]['otime'] = orderlist.formatTimeTwo(data.data.express[x]['otime'], 'Y-M-D h:m:s');
                    }
                    if (data.data.express[x]['ptime'] != 0) {
                        data.data.express[x]['ptime'] = orderlist.formatTimeTwo(data.data.express[x]['ptime'], 'Y-M-D h:m:s');
                    }

                }
                data.data.express.otime = orderlist.formatTimeTwo(data.data.express.otime, 'Y-M-D h:m:s');
                data.data.express.ptime = orderlist.formatTimeTwo(data.data.express.ptime, 'Y-M-D h:m:s');
                var nowData = that.data["orderList" + type].concat(data.data.express)
                // console.log(nowData);
                that.setTypeData(type, p + 1, data.data.nextPage, nowData, that)
            }
            that.setData({
                loadingHidden: true
            })

            wx.pageScrollTo({
                scrollTop: 0,
            })
        });
    },
    /*刷新获取订单数据*/
    getOrderList1: function () {
        var that = this;
        var type = this.data.nowIndex;
        var p = 1;
        orderlist.getAllOrder(type, p, (data) => {
            if (data.err == 0) {
                for (var x in data.data.express) {
                    if (data.data.express[x]['otime'] != 0) {
                        data.data.express[x]['otime'] = orderlist.formatTimeTwo(data.data.express[x]['otime'], 'Y-M-D h:m:s');
                    }
                    if (data.data.express[x]['ptime'] != 0) {
                        data.data.express[x]['ptime'] = orderlist.formatTimeTwo(data.data.express[x]['ptime'], 'Y-M-D h:m:s');
                    }

                }
                data.data.express.otime = orderlist.formatTimeTwo(data.data.express.otime, 'Y-M-D h:m:s');
                data.data.express.ptime = orderlist.formatTimeTwo(data.data.express.ptime, 'Y-M-D h:m:s');
                that.data.newinfo = data.data.express;
                that.data["orderList" + type] = [];
                var nowData = that.data["orderList" + type].concat(data.data.express)
                if (type == 1) {
                    that.setData({
                        isEnd1: data.data.nextPage,
                        p1: 2,
                        orderList1: nowData,
                        nowOrder: nowData
                    })
                }
                if (type == 2) {
                    that.setData({
                        isEnd2: data.data.nextPage,
                        p2: 2,
                        orderList2: nowData,
                        nowOrder: nowData
                    })
                }
            }
            that.setData({
                loadingHidden: true
            })
        });
    },

    /*设置数据*/
    setTypeData: function (type, p, nextPage, nowData, that) {
        if (type == 1) {
            that.setData({
                isEnd1: nextPage,
                p1: p,
                orderList1: nowData,
                nowOrder: nowData
            })
        }
        if (type == 2) {
            that.setData({
                isEnd2: nextPage,
                p2: p,
                orderList2: nowData,
                nowOrder: nowData
            })
        }
    },
    //待支付订单去付款
    toorder: function (event) {
        //防重复点击
        orderlist.buttonClicked(this);
        var order_id = orderlist.getDataSet(event, 'order_id'); //主订单id
        var type = orderlist.getDataSet(event, 'type'); //类型:0是店铺商品/1是积分商品/2艺术家商品/3奖励商品/4砍价商品
        var sell_way = orderlist.getDataSet(event, 'sell_way'); //0抽盒/1直购盲盒/2直购实物/3直购端盒/4虚拟商品
        if (sell_way == 0 || sell_way == 1) {
            if (type == 0) {
                //店铺盲盒商品
                wx.navigateTo({
                    url: '../order/order?order_id=' + order_id+'&from=orderlist'
                })
            }
            if (type == 1) {
                //积分盲盒商品          
                wx.navigateTo({
                    url: '../pointorder/pointorder?order_id=' + order_id+'&from=orderlist'
                })
            }
            if (type == 4) {
                //砍价商品           
                wx.navigateTo({
                    url: '../orderkj/orderkj?order_id=' + order_id+'&from=orderlist'
                })
            }
        }

        if (sell_way == 2 || sell_way == 3) {
            wx.navigateTo({
                url: '../materorder/materorder?order_id=' + order_id+'&from=orderlist'
            })
        }

        if (sell_way == 4) {
            //积分虚拟商品                
            wx.navigateTo({
                url: '../pointorder/pointorder?order_id=' + order_id+'&from=orderlist'
            })
        }
    },

    //取消订单
    cancelorder: function (event) {
        var that = this;
        //防重复点击
        orderlist.buttonClicked(this);
        var order_id = orderlist.getDataSet(event, 'order_id'); //主订单id 
//        var par = {
//            order_id: order_id,
//            callback: function (data) {
//                if (data.err == 0) {
//                    wx.showToast({
//                        title: '取消成功',
//                        icon: 'none',
//                        duration: 2000
//                    })
//                    that.getOrderList1();
//                }
//            }
//        }
//        orderlist.cancelOrder(par);
           orderlist.cancelOrder(order_id,(data)=>{
                if (data.err == 0) {
                    wx.showToast({
                        title: '取消成功',
                        icon: 'none',
                        duration: 2000
                    })
                    that.getOrderList1();
                }
           }); 
    },

    changeOrder: function (event) {
        var that = this
        this.setData({
            nowOrder: ''
        })
        var index = parseInt(orderlist.getDataSet(event, "id"))
        var nowIndex = this.data.nowIndex

        that.setData({
            nowIndex: index,
            tabBarIndex: index - 1
        })

        that.setData({
            loadingHidden: false
        })
        that.getOrderList1();
    },

    /*去盒柜发货*/
    goCart:function(){
        wx.switchTab({
            url: "/pages/shopping/shopping"
        })
    }
})