// pages/address/address.js
import {Addresslist} from "address-model.js";
var addresslist = new Addresslist();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this._loadData()
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

  /*获取用户所有地址*/
  _loadData:function(callback)
  {
    var that = this;
    addresslist.getAllAddress((data)=>{
      console.log(data);
    that.setData({
      addressList:data.data.address,
      loadingHidden: true
    });
  });
  },
  /*跳转到添加收货地址页面*/
  editAddress: function (event) {
    var id = addresslist.getDataSet(event, 'id');
    console.log(id)
    wx.navigateTo({
      url: '../addresssave/addresssave?from=1&id=' + id
    })
  },
  /*跳转到添加收货地址页*/
  addAddress:function(event){
    wx.navigateTo({
      url: '../addresssave/addresssave?from=1'
    })
  },
  changeDefault:function(event)
  {
    var that = this;
    var id = addresslist.getDataSet(event,'id');
    //查看id是否为默认地址
    var res = this._isDefault(id)
    if(res){
      //请求更换默认地址
      addresslist.changeDefaultAddress(id,(data)=>{
        if(data.err == 0){
          //reset addresslist
          var newAddress =that._resetAddress(id)
          that.setData({
            addressList:newAddress
          })
        }
      })
    }
  },
  _isDefault: function (id) {
    var addressList = this.data.addressList;
    for (let i = 0; i < addressList.length; i++) {
      if (addressList[i].id == id) {
        if (addressList[i].is_default == 1) {
          return false;
        }
        if (addressList[i].is_default == 0) {
          return true;
        }
      }
    }
  },
  _resetAddress: function (id) {
    var addressList = this.data.addressList;
    for (let i = 0; i < addressList.length; i++) {
      if (addressList[i].id == id) {
        addressList[i].is_default = 1
      }
      if(addressList[i].id != id){
        addressList[i].is_default = 0
      }
    }
    return addressList
  }
})