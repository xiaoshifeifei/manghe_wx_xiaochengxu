// pages/pointorder/pointorder.js
import { Pointorder } from 'pointorder-model.js';
var pointorder = new Pointorder(); //实例化 首页 对象
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      order_arr:'',
      coupon:0,
      c_style:'display:none;',
      pay_success:'display:none;',
      pay_fail:'display:none;',
      buttonClicked:false,
      from:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (option) { 
       this.data.order_id = option.order_id;
        if(option.from){
            this.setData({
                from:option.from
            });  
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
      this._loadData();
      
  },
  
  /*加载数据*/
  _loadData:function(){
        var that = this;
        var order_id = this.data.order_id;
        pointorder.getpreorderinfo(order_id,(data)=>{
            data.data.otime = pointorder.formatTimeTwo(data.data.otime,'Y-M-D h:m:s');                
            that.setData({
                order_arr:data.data,
                money:data.data.money,
                order_id:data.data.order_id,
                s_id:data.data.s_id,
                imgurl1:pointorder.ImgUrl1,
                pay_fail:'display:none;'
            });
        });    
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
  
  //支付成功，返回首页、店铺、盒柜
  tocart:function (event) { 
        var jumptype= pointorder.getDataSet(event,'jumptype');
        if(jumptype==1){
            //回首页
            wx.switchTab({
                url: '/pages/index/index'
            })
        }
        if(jumptype==2){
            //回店铺
            wx.navigateTo({
               url: '/pages/shop/shop?id='+this.data.s_id,
            })
        }
        if(jumptype==3){
            //去盒柜
            wx.switchTab({
                url: '/pages/shopping/shopping'
            })
        }
  },
  //支付成功，返回积分商城继续买
  toscore:function (event) { 
        var jumptype= pointorder.getDataSet(event,'jumptype');
        if(jumptype==3){
            //去积分商城
            // wx.redirectTo({
            //     url: '/pages/home2/home2'
            // })
            wx.navigateBack({
                delta: 2
            })
        }
  },
  
  //余额不足，前往充值
  topup: function (event) {
    wx.navigateTo({
      url: '../topup/topup?from=3',
    })
  },
  
  //立即支付
    gopay:function(event){
        var that =this;
        //防重复点击
        pointorder.buttonClicked(that);
        
        var p_id = this.data.order_arr.p_id;
        var order_id = this.data.order_arr.order_id;
        pointorder.gopaymoney(p_id, order_id,(data)=>{
            if(data.err==1000){                    
                that.setData({
                    balance:data.data.res_value,
                    pay_success:'display:block;',
                });
            }            
            // }else if(data.err==1015){
            //     var short_money = data.data.act_money - data.data.res_value;
            //     that.setData({
            //         balance:data.data.res_value,
            //         short_money:short_money.toFixed(2),
            //         pay_fail:'display:block;',
            //     });
            // }else{
            //     wx.showToast({
            //         title:data.msg,
            //         icon: 'none',
            //         duration: 2000
            //     })
            // }         
        });
    },
    closepoint:function(){
        this.setData({
            pay_fail:'display:none;'
        });
    }             
    
})