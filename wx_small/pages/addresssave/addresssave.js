import {Addresssave} from "addresssave-model.js";
import {Address} from '../../utils/address.js';
var addressave = new Addresssave();
var address = new Address();

var cellId;

var t = 0;

Page({
  data: {
    backStep:0,
    addressId:null,
    buttonText:null,
    wClicked:false,
    allowAddress:true,
    region: ['点击选择所在地区', '', ''],
  },
  formSubmit: function (e) {
    var formData = e.detail.value;
    formData['province']  =this.data.region[0];
    formData['city']  =this.data.region[1];
    formData['county']  =this.data.region[2];
    //验证参数
    this.validateForm(formData);
  },
  validateForm: function (formData) {
    var that = this;
    var msg;
    if (formData) {
      if (!formData['name']) {
        msg = "请输入收货人姓名"
      }
      if (!formData['phone']) {
        msg = "请输入手机号"
      }
      //正则验证手机号是否合法
      var re = /^1\d{10}$/
      if (!re.test(formData['phone'])) {
        msg = "手机号格式错误"
      }
      //验证是否是默认地址
      if(formData['province'] == "点击选择所在地区"){
        msg="请选择所在地区";
      }
      if (!formData['adetail']) {
        msg = "请输入详细地址"
      }
      if(msg){
        that.validateToast(msg)
        return false
      }
      var addressId = that.data.addressId;
      if(addressId > 0){
        formData['id'] = addressId
      }
      //保存用户数据
      address.submitAddress(formData, (data) => {
                if (this.data.myParams == "tiaozhuan") {
                    wx.navigateBack({
                      delta: 1
                    })
                  return
                  }
      if (data.err == '0') {
        //弹窗提示
        that.validateToast("保存成功");
        //设置id缓存
        if(that.data.backStep == 2){
          addressave.execSetStorageSync(data.data.id)
        }
        //跳转到下单页
        var backStep = parseInt(that.data.backStep)
        wx.navigateBack({
          delta: backStep
        })
      }
    })
    }
  },
  /*点击授权setting*/
  _checkSetting:function(){
    var that = this
    wx.getSetting({//先获取用户当前的设置
      success(res) {
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success(res) {
              that.loadWxAddress()
            },
            fail(res){
              //用户拒绝授权后执行-弹出引导授权框
              wx.showModal({
                title: '提示',
                content: '请先授权获取收货地址',
                success (res) {
                  if (res.confirm) {
                    that._guideSetting()
                  } else if (res.cancel) {
                  }
                }
              })
            }
          })
        }else{
          that.loadWxAddress()
        }
      }
    })
  },
  /*引导*/
  _guideSetting:function(){
    wx.openSetting({
      success (res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
    })
  },
  /*从微信中导入地址*/
  loadWxAddress: function () {
    //return
    var that = this;
    wx.chooseAddress({
      success(res){
        that.setData({
          name: res.userName,
          phone: res.telNumber,
          adetail: res.detailInfo,
          region:[res.provinceName,res.cityName,res.countyName],//省市（县、区）
        })
      },
      fail(res){
        console.log(res)
      }
    })
  },

  /*弹窗提示*/
  validateToast:function(msg)
  {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },

  onLoad: function (options) {
    cellId = options.cellId;
     if (options.from == 3) {
            this.setData({
              buttonText:'保存',
              myParams:"tiaozhuan"
            })
          }else if(options.from == 2){
      this.setData({
        buttonText:'保存并使用',
      })
    }else{
      this.setData({
        buttonText:'保存',
      })
    }
    this.setData({
      backStep:options.from
    })
    var id = options.id;
    if(id){
      //获取用户地址
      this.getAddressById(id)
    }
    var that = this;
  },
  //获取对应id的地址
  getAddressById:function(id)
  {
    var that = this
    addressave.getOneAddress(id,(data)=>{
      console.log(data.data.address)
        if(data.err == 0){
          var address = data.data.address;
          //set data
          that.setData({
            addressId:address.id,
            isDefault:address.is_default,
            name:address.recipient,
            phone:address.phone,
            region:[address.province,address.city,address.area],//省市（县、区）
            adetail:address.address,
          })
        }
    })
  },
  /*删除地址*/
  delAddress:function(){
    var addressId = this.data.addressId
    var that = this
    //confirm
    wx.showModal({
      title: '提示',
      content: '确定删除地址？',
      success (res) {
        if (res.confirm) {
          //确定调用删除接口
          that._delAddress(addressId)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /*删除地址*/
  _delAddress:function(id){
    addressave.delOneAddress(id,(data)=>{
      if(data.err == 0){
      //删除成功-返回上一页
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  /*默认地址不可删除*/
  noDelAddress:function(){
    wx.showToast({
      title: "默认地址不能删除",
      icon: 'none',
      duration: 2000
    })
  },
  /*选择地址*/
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  }
})