// pages/address/address.js
import {Shopaddress} from "shopaddress-model.js";
var shopaddress = new Shopaddress();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this._loadData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this._loadData()
  },

  /*获取用户所有地址*/
  _loadData:function(callback)
  {
    var that = this;
    shopaddress.getAllAddress((data)=>{
      if(data.err == 0){
        that.setData({
          addressList:data.data.address
        });
        if(data.data.address.length == 0){
          //提示添加地址
          shopaddress.toastMsg("请添加地址")
        }else{
          shopaddress.toastMsg("请选择地址")
        }
    }
  });
  },
  /*跳转到添加收货地址页面*/
  useAddress: function (event,e) {
    var id = shopaddress.getDataSet(event, 'id');
    //设置地址id到缓存数据
    shopaddress.execSetStorageSync(id);
    wx.navigateBack({
      delta: 1
    })
  },
  changeDefault:function()
  {

  },
  /*跳转到新增地址界面*/
  addAddress:function()
  {
    wx.navigateTo({
      url: '../addresssave/addresssave?from=2'
    })
  }
})