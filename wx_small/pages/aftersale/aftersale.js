// pages/aftersale/aftersale.js
import {AfterSale} from "aftersale-model.js"
var aftersale = new AfterSale();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    addressCheck:true,
    addressHide:true,
    isdefault:1,
    content:'',
    imgHide:false,
    addImg:'',
    upImg:'',
    wClicked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = this.options.id
    var cartid = this.options.cartid
    var from = this.options.from
    console.log(id,cartid)
    if(!id || !cartid){
      return false
    }
    this.data.id = id
    this.data.cartid = cartid
    this.data.from = from
    this.getAfterData(id,cartid)
  },

  /*获取售后页面数据*/
  getAfterData:function(id,cartid){
    var that = this
    aftersale.getAfter(id,cartid,(data)=>{
      if(data.err == 0){
        that.setData({
          cart: data.data.cart,
          Reasons: data.data.reasons,
          order: data.data.order,
          province: data.data.order.province,
          city: data.data.order.city,
          area: data.data.order.area,
          address_buyer: data.data.order.address_buyer,
          receiver: data.data.order.receiver,
          rphone: data.data.order.rphone,
          upImg:data.data.order.images,
          index:data.data.order.reason,
          content:data.data.order.des_problem
        })
        if(data.data.order.iscreate == false){
          that.setData({
            addressHide:false
          })
        }
        if(data.data.order.images){
          that.setData({
            imgHide:true,
            addImg:data.data.order.images
          })
        }
      }
    })
  },

  /*选择reason*/
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  /*选择图片*/
  _bindChooseImg: function () {
    var that = this
    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.data.tempFilePaths = res.tempFilePaths;
        that.setData({
          addImg:res.tempFilePaths[0],
          imgHide:true
        })
        //开始上传图片
        that._bindApply()
      },
      fail:function(res){
        console.log(res)
      }
    })
  },

  /*上传图片*/
  _bindApply: function () {
    var that = this
    //判断是否上传图片
    var tempFilePaths = that.data.tempFilePaths;
    if (tempFilePaths.length <= 0) {
      wx.showToast({
        title: "请选选择图片",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    //启动上传等待中...
    wx.showToast({
      title: '正在上传...',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
    var uploadImgCount = 0;
    for (var i = 0, h = tempFilePaths.length; i < h; i++) {
      console.log(i,tempFilePaths[i])
      wx.uploadFile({
        url: aftersale.uploadUrl,
        filePath: tempFilePaths[i],
        name: 'img',
        header: {
          "Content-Type": "multipart/form-data",
          'token': wx.getStorageSync('token')
        },
        success: function (res) {
          uploadImgCount++;
          var data = JSON.parse(res.data);
          console.log(data)
          if(data.err == 0){
            that.data.upImg = data.data.url
          }
          //如果是最后一张,则隐藏等待中
          if (uploadImgCount == tempFilePaths.length) {
            wx.hideToast();
          }
        },
        fail: function (res) {
          console.log(res)
          wx.hideToast();
        }
      });
    }
  },

  /*切换是否使用默认地址*/
  addressChange:function(e){
    var res = e.detail.value
    if(res == true){
      //使用默认地址
      this.data.isdefault = 1;
    }else{
      //不使用默认地址
      this.data.isdefault = 2;
    }
    this.setData({
      addressHide:res
    })
  },

  /*更换收货地址*/
  changeAdd:function() {
    var data = this.data
    var province = data.province,
        city=data.city,
        area=data.area,
        address_buyer=data.address_buyer,
        receiver=data.receiver,
        rphone=data.rphone
    wx.navigateTo({
      url: '../afteradd/afteradd?province='+province+'&city='+city+'&area='+area+'&address_buyer='+address_buyer+'&receiver='+receiver+'&rphone='+rphone
    })
  },

  /*提交售后*/
  goApply:function(){
    this._disableButton()
    var that = this
    var alldata = that.data
    var params = {
      id: alldata.id,
      cartid: alldata.cartid,
      reason: alldata.index,
      content: alldata.content,
      isdefault: alldata.isdefault,
      province: alldata.province,
      city: alldata.city,
      area: alldata.area,
      address_buyer: alldata.address_buyer,
      receiver: alldata.receiver,
      rphone: alldata.rphone,
      upimg:alldata.upImg
    }
      aftersale.applyAfter(params,(data)=>{
        if(data.err == 0){
            //关闭当前页面，跳转到申请售后页面
          if(that.data.from == 1){
            //返回到上一页
            wx.navigateBack({
              delta: 1
            })
          }else if(that.data.from == 2){
            wx.redirectTo({
              url: '../afterdetail/afterdetail?id='+ data.data.id
            })
          }
        }
      })
  },

  /*说明*/
  contentInput: function(e){
    this.data.content = e.detail.value
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
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    let json = currPage.data.mydata;
    if(json){
      this.setData(
          json
      )
    }
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
})