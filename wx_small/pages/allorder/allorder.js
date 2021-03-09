// pages/allorder/allorder.js
import {Allorder} from "allorder-model.js"
var allorder = new Allorder();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBar:[{id:1,name:"全部"},{id:2,name:"待付款"},{id:3,name:"待发货"},{id:4,name:"待收货"},{id:5,name:"已收货"},{id:6,name:"售后处理"}],
    tabBarIndex:0,
    nowIndex: 1,//当前tabid
    isEnd: 1,
    p: 1,
    orderList: [],
    wClicked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nowIndex = parseInt(options.nowIndex)
    if(!nowIndex){
      nowIndex = 1
    }
    var tabBarIndex = nowIndex-1
    this.setData({
      nowIndex:nowIndex,
      tabBarIndex:tabBarIndex
    })
    this.getOrderList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //判断当前index数据是否加载完全
    var is_end = this.data.isEnd
    if(is_end == 0){
      return
    }
    this.getOrderList()
  },
  /*获取订单数据*/
  getOrderList: function () {
    var that = this;
    var type = this.data.nowIndex
    var p = that.data.p
    if(type == 6){
      //售后订单
      allorder.getReturnOrder(p,(data)=>{
        if(data.err == 0){
        var nowData = that.data.orderList.concat(data.data.express)
        //设置data
        that.setData({
          orderList: nowData,
          p:p+1,
          isEnd:data.data.nextPage
        })
      }
      })
    }else{
      allorder.getAllOrder(type,p,(data)=>{
        if(data.err == 0){
        var nowData = that.data.orderList.concat(data.data.express)
        //设置data
        that.setData({
          orderList: nowData,
          p:p+1,
          isEnd:data.data.nextPage
        })
      }
    });
    }
  },

  /*切换tab*/
  changeOrder: function (event) {
    var that = this
    var index = parseInt(allorder.getDataSet(event,"id"))
    var nowIndex = this.data.nowIndex
    if(index == nowIndex){
      return
    }
    //重置数据
    /*that.data.nowIndex = index
    that.data.tabBarIndex = index-1
    that.data.isEnd = 1
    that.data.p = 1
    that.data.orderList = []*/
    that.setData({
      nowIndex: index,
      tabBarIndex: index - 1,
      isEnd: 1,
      p: 1,
      orderList: [],
    })
    that.getOrderList();
  },
  /*复制快递单号*/
  copyOrder: function (event) {
    var order = allorder.getDataSet(event, 'id')
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: order,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 2000
        });
      },
      fail:function(res){
        wx.showToast({
          title: '失败，请长按单号复制',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  /*取消订单*/
  _goCancel:function(event){
    this._disableButton()
    var orderid = allorder.getDataSet(event,'id');
    var that = this;
    //弹窗展示
    wx.showModal({
      title: '取消订单？',
      content: '取消订单后，可到发货重新下单哦~',
      success (res) {
        if (res.confirm) {
          that._doCancel(orderid);
        } else if (res.cancel) {

        }
      }
    })
  },

  /*确认取消订单*/
  _doCancel:function(orderid){
    this._disableButton()
    var that = this;
    allorder.goCancelOrder(orderid,(data)=>{
      if(data.err == 0){
        wx.showToast({
          title: "订单取消成功",
          icon: 'none',
          duration: 1000
        })
        //重置数据
        that._doResetData(false)
      }
    })
  },

  /*重新支付订单*/
  _goRePay:function(event){
    this._disableButton()
    var orderid = allorder.getDataSet(event,'id');
    var that = this;
    //弹窗展示
    wx.showModal({
      title: '提示',
      content: '确定继续支付订单？',
      success (res) {
        if (res.confirm) {
          that._doRePay(orderid);
        } else if (res.cancel) {

        }
      }
     })
   },
  /*重新支付订单*/
  _doRePay:function(orderid){
    this._disableButton()
    this._showLoading()
    var that = this
    var nowIndex = parseInt(this.data.nowIndex),goPage = false;
    if(nowIndex == 2){
      //待支付-成功后切换到待发货nowIndex=3
      goPage = true
    }
    allorder.goRePay(orderid,(data)=>{
        if(data == 2){
        //支付成功
        that._doResetData(goPage)
      }else{
        //支付失败->

      }
    })
  },

  /*数据重置*/
  _doResetData:function(goPage){
    //取消成功-刷新页面数据-所有数据清空-重置
    var data = {
      isEnd: 1,
      p: 1,
      orderList: []
    }
    if (goPage) {
     data['tabBarIndex']  = 2;
     data['nowIndex'] =  3;
    }
    this.setData(data)
    //获取data
    this.getOrderList()
  },

  /*按钮点击失效*/
  _disableButton:function(){
    var that = this
    that.setData({
      wClicked:true
    })
    //按钮还原
    setTimeout(function(){
      that.setData({
        wClicked:false
      })
    },1000)
  },

  /*查看收货地址*/
  _goAddress:function(event){
    let id = allorder.getDataSet(event,'id');
    let nowIndex = this.data.nowIndex
    let orderList = this.data['orderList'+nowIndex]
    if(orderList){
      for (let i=0 ;i<orderList.length;i++){
        if(id == orderList[i]['id']){
          let address = orderList[i]['receiver']+" "+orderList[i]['rphone']+" "+orderList[i]['address']
          wx.showModal({
            title: '收货地址',
            content: address,
            showCancel:false,
            success (res) {
              if (res.confirm) {

              }
            }
          })
        }
      }
    }
  },

  //微信小程序loading
  _showLoading:function(){
    wx.showLoading({
      title: '支付中...'
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 5000)
  },

  /*确认收货弹窗*/
  goReceipt:function(event){
    var id = allorder.getDataSet(event,'id')
    var that = this
    //弹窗展示
    wx.showModal({
      title: '提示',
      content: '是否确认已经收到货？',
      success (res) {
        if (res.confirm) {
          that._doReceipt(id)
        } else if (res.cancel) {

        }
      }
    })
  },
  /*确认收货*/
  _doReceipt:function(id){
    var that = this
   allorder.doReceipt(id,(data)=>{
     console.log(data)
     if(data.err == 0){
        allorder.toastMsg(data.data)
        that._doResetData(false)
     }
   })
  },

  /*订单详情*/
  goDetail:function(event){
    var id = allorder.getDataSet(event,'id')
    wx.navigateTo({
      url: '../alldetail/alldetail?id='+id
    })
  },

  /*售后订单详情*/
  afterDetail:function(event){
    var id = allorder.getDataSet(event,'id')
    wx.navigateTo({
      url: '../afterdetail/afterdetail?id='+id
    })
  },
  
  /*跳转到店铺详情*/
  goShops:function(event){
    var s_id = allorder.getDataSet(event,'s_id')
    if(s_id == 0){
      return false;
    }
    wx.navigateTo({
      url: '../shop/shop?id='+s_id
    })
  },
})