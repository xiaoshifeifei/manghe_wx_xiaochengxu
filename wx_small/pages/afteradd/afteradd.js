// pages/afteradd/afteradd.js
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
    var province= this.options.province
    var city= this.options.city
    var area= this.options.area
    var address_buyer= this.options.address_buyer
    var receiver= this.options.receiver
    var rphone= this.options.rphone

    //设置默认值
    this.setData({
      receiver: receiver,
      rphone: rphone,
      address_buyer: address_buyer,
      region:[province,city,area]//省市（县、区）
    })
  },

  /*选择地址*/
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  /*页面传参*/
  setAddress:function(){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      mydata: {
        id:1,
        b: 125
      }
    })
    wx.navigateBack({//返回
      delta: 1
    })
  },

  formSubmit: function (e) {
    var formData = e.detail.value;
    formData['province']  =this.data.region[0];
    formData['city']  =this.data.region[1];
    formData['area']  =this.data.region[2];
    //验证参数
    this.validateForm(formData);
  },
  validateForm: function (formData) {
    var that = this;
    var msg;
    if (formData) {
      if (!formData['receiver']) {
        msg = "请输入收货人姓名"
      }
      if (!formData['rphone']) {
        msg = "请输入手机号"
      }
      //正则验证手机号是否合法
      var re = /^1\d{10}$/
      if (!re.test(formData['rphone'])) {
        msg = "手机号格式错误"
      }
      if (!formData['address_buyer']) {
        msg = "请输入详细地址"
      }
      if(msg){
        that.validateToast(msg)
        return false
      }
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        mydata: {
          province:formData['province'],
          city:formData['city'],
          area:formData['area'],
          address_buyer:formData['address_buyer'],
          receiver:formData['receiver'],
          rphone:formData['rphone']
        }
      })
      wx.navigateBack({//返回
        delta: 1
      })
    }
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

  }
})