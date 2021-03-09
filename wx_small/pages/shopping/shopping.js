//index.js
import {Shopping} from "shopping-model.js";
var shop = new Shopping();
var app = getApp();
Page({
  data: {
    cartBar: [{id: 1, name: '全部'}, {id: 2, name: '抽盒'}, {id: 3, name: '预售'}, {id: 4, name: '其他'}],
    nowId:1,
    selectedCounts: 0,//总选择物品数
    selectedTypeCounts: 0, //总的物品数
    selectedIds: '',
    cartList: [],
    hidePop: true,
    wClicked: false,
    NullImg: shop.NullImg,
    cartListHide: true,
    imageHide: true,
    bottom: '',
    authHide: true,
    authImg: shop.authImg,
    winImg:shop.winImg,
    hideInfo:true
  },
  onShow: function () {
    let isPhoneX = app.globalData.isIphoneX;
    let isPhoneXI = app.globalData.isIphoneXI;
    if(isPhoneX){
        this.setData({
            isPhoneX:true,
            bottom:'bottom:138rpx'
        }) 
    }
    if(isPhoneXI){
      this.setData({
        isPhoneXI:true,
        bottom:'bottom:160rpx',
        padding:'padding-bottom: 280rpx'
      })
    }
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
    app.playMusic('backMusic');
    //重新载入数据
    this._unsetSelect()
    //判断用户是否授权
    if(app.globalData.isSetting && app.globalData.is_bind_iphone){
      var nowId = this.data.nowId
      this._loadData(nowId)
    }else{
      this.setData({
        authHide:false
      })
    }
  },

  /*初始化数据*/
  _unsetSelect: function () {
    //初始化data
    this.setData({
      selectedCounts: 0,//总选择物品数
      selectedTypeCounts: 0, //总的物品数
      selectedIds: '',
      cartList: [],
      hidePop: true,
      hideInfo:true
    })
  },

  /*监听页面隐藏*/
  onHide:function(){
    this.setData({
      authHide:true,
      cartListHide:true,
      imageHide:true
    })
  },
  onLoad: function () {
    app.playMusic('backMusic')
  },

  goAuth:function(){
    shop._authCheckWin()
  },

  /*tab切换*/
  switchTab:function(event){
    if (app.globalData.isSetting && app.globalData.is_bind_iphone) {
      var that = this
      var id = parseInt(shop.getDataSet(event, 'id'))
      var nowId = that.data.nowId
      if (id == nowId) {
        return false;
      }
      //重置数据
      that._unsetSelect()
      //加载数据
      that.setData({
        nowId: id
      })
      that._loadData(id)
    }else{
      shop._authCheckWin()
    }
  },

  /*获取购物车所有商品*/
  _loadData: function(type) {
    var that = this;
    shop.getCartList(type,(data)=>{
      if(data.err == 0){
          //if(data.data.shopcart.length == 0){
          //  that.setData({
          //    imageHide:false
          //  })
          //}
          that.setData({
            cartList:data.data.shopcart,
            cartNum:data.data.cartNum,
            imageHide:data.data.nocart
          })
        }
        that.setData({
          cartListHide:false
        })
    })
  },

  /*跳转到店铺详情*/
  goShops:function(event){
    var id = shop.getDataSet(event,'id')
    wx.navigateTo({
      url: '../shop/shop?id='+id
    })
  },

  /*new 选择商品*/
  itemSelect:function(event){
    var shopId = shop.getDataSet(event,'shop'),
        status=shop.getDataSet(event,'status'),
        index = shop.getDataSet(event,'index'),
        id = shop.getDataSet(event,'id');
    //判断当前商品是否是预售商品
    var preType = parseInt(this.data.cartList[shopId]['cart'][index].pretype),
        preTime = parseInt(this.data.cartList[shopId]['cart'][index].pretime)
    if (preType == 1 && this._getTime() < preTime) {
      shop.toastMsg("预售产品未到发货时间")
      return false
    }
    this.data.cartList[shopId]['cart'][index].selectStatus=!status;
    this._resetData()
  },

  /*new shop店铺全选*/
  shopSelect:function(event){
    var status=shop.getDataSet(event,'status'),
        index = shop.getDataSet(event, 'index'),
        shopId = shop.getDataSet(event, 'id');
    //全选-全不选
    var data=this.data.cartList,
        len=data[shopId]['cart'].length;
    for(let i=0;i<len;i++) {
      //判断是否预售
      if (parseInt(data[shopId]['cart'][i].pretype) == 1 &&
          this._getTime() < parseInt(data[shopId]['cart'][i].pretime)) {
          shop.toastMsg("存在预售产品未到发货时间，只能选择部分哦~")
      } else {
        data[shopId]['cart'][i].selectStatus = !status;
      }
    }
    this._resetData()
  },

  /*全选全不选*/
  itemSelectAll: function (event) {
    var status=shop.getDataSet(event,'status') == 'true',
     data=this.data.cartList;
    for (let key  in data) {
      var itemLen = data[key]['cart'].length
      for (let i = 0; i < itemLen; i++) {
        //判断是否预售
        if (parseInt(data[key]['cart'][i].pretype) == 1
            && this._getTime() < parseInt(data[key]['cart'][i].pretime)) {
          shop.toastMsg("存在预售产品未到发货时间，只能选择部分哦~")
        } else {
          data[key]['cart'][i].selectStatus = !status;
        }
      }
    }
    this._resetData();
  },

  /*重置盒柜列表*/
  _resetData: function () {
    var newData = this._calCountData(this.data.cartList);
    this.setData({
      selectedCounts:newData.selectedCounts,
      selectedTypeCounts:newData.selectedTypeCounts,
      cartList:this.data.cartList
    });
  },

  /*计算选择数量*/
  _calCountData: function (data) {
    var selectedCounts= 0,
        selectedTypeCounts = 0;
    for (let key  in data) {
      this.data.cartList[key]['shop']['selectedItemCount'] = 0
      //内部循环
      var itemLen = data[key]['cart'].length
      for (let i = 0; i < itemLen; i++) {
        if (data[key]['cart'][i].selectStatus) {
          this.data.cartList[key]['shop']['selectedItemCount']++
          selectedCounts++;
          selectedTypeCounts++;
        }
      }
      if (data[key]['shop']['selectedItemCount'] == itemLen) {
        this.data.cartList[key]['shop']['selectStatus'] = true
      }else{
        this.data.cartList[key]['shop']['selectStatus'] = false
      }
    }
    return{
      selectedCounts:selectedCounts,
      selectedTypeCounts:selectedTypeCounts
    }
  },

  /*获取当前时间戳*/
  _getTime: function () {
    return parseInt(new Date().getTime() / 1000);
  },

  /*查询是否存在邮费*/
  submitSearch: function () {
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      shop._authCheckWin()
      return false
    }
    //按钮点击失效&还原
    this._disableButton()
    var selectId = this._getSelectId();
    var that = this;
    if(selectId){
      shop.getPostage(selectId,(data)=>{
        if(data.err == 0){
          //判断邮费展示
          that.setData({
            shopPostage: data.data.shopPostage,
            scorePostage: data.data.scorePostage,
            rewardPostage: data.data.rewardPostage,
            artPostage: data.data.artPostage,
            invitePostage: data.data.invitePostage,
            is_postage: data.data.is_postage,
            hidePop: false
          })
        }
      })
    }
  },

  /*弹窗确认*/
  _confirmWindow:function(){
    var that = this;
    that.setData({
      cartListHide:true,
      hidePop:true
    })
    wx.navigateTo({
      url:'../shoppingmore/shoppingmore?selectIds='+that.data.selectedIds,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataShoppingMore: function(data) {
          that.setData({
            cartListHide:true
          })
        }
      }
    });
  },

  /*拼接选择的物品id*/
  _getSelectId:function()
  {
    var data = this.data.cartList,
        newCart='';
    for (let key  in data) {
      var itemLen = data[key]['cart'].length
      for(let i=0;i<itemLen;i++){
        if (data[key]['cart'][i].selectStatus) {
          newCart += data[key]['cart'][i].id + ","
        }
      }
    }
    if(newCart){
      newCart = newCart.slice(0,-1)
    }
    this.data.selectedIds = newCart
    return newCart
  },
  /*关闭邮费弹窗*/
  closePop:function()
  {
    this.setData({
      hidePop:true
    })
  },

  /*弹出发货车商品订单信息*/
  getInfo:function(event){
   var shopId = shop.getDataSet(event,'shop'),
        status=shop.getDataSet(event,'status'),
        index = shop.getDataSet(event,'index'),
       id = shop.getDataSet(event,'id');
    //获取当前商品名
    var that = this
    var cartList = that.data.cartList
    var name1 = cartList[shopId]['cart'][index].type_name
    var name2 = cartList[shopId]['cart'][index].cache.pname
    var name3 = cartList[shopId]['cart'][index].cache.scsi_name
    shop.getCartInfo(id,(data)=>{
      if(data.err == 0){
        var info = data.data
        info.name = name1+name2+name3
        that.setData({
          hideInfo:false,
          cartInfo:info
        })
      }
    })
  },

  /*关闭购物车弹窗*/
  _closeInfo:function(){
    this.setData({
      hideInfo:true
    })
  },

  _doInfo:function(){

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
  }
})
