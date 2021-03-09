// pages/bigbox/bigbox.js
import { Bigbox } from 'bigbox-model.js';
var bigbox = new Bigbox(); //实例化 盒子页 对象
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      buttonClicked:false,
      sharetitle:'',
      shareimg:'',
      encode:'',
      back_url:'',
      bb_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (option) {
        this.data.p_id = option.p_id;
        this.data.s_id = option.s_id;
        if(option.bb_id){
            this.data.bb_id = option.bb_id;   
        }else{
            this.data.bb_id = 0;
        }
        this._loadData();  
  },
  
  /*加载数据*/
    _loadData:function(){
        var that = this;
        //获取盒子页数据 
        var par = {
          p_id:this.data.p_id,
          s_id:this.data.s_id,
          bb_id:that.data.bb_id,
          callback: function (data) {
            wx.setNavigationBarTitle({
               title: data.pname 
            })  
            that.setData({
              boxdata:data,
              p_id:that.data.p_id,
              s_id:that.data.s_id,
              box_id:data.box_id,
              imgurl1:bigbox.ImgUrl1,
              imgurl2:bigbox.ImgUrl2,
              imgurl4:bigbox.ImgUrl4,
              imgurl5:bigbox.ImgUrl5,
            });            
          }
        }
                
        bigbox.getBoxData(par);
        
        //查询分享图和对应标题
        var type =11;//端一盒
        bigbox.getShareConfig(type,(data)=>{
            if(data.err == 0){
                var back_url = encodeURIComponent('/pages/bigbox/bigbox?p_id='+this.data.p_id+'&s_id='+this.data.s_id+'&bb_id='+this.data.bb_id);
                that.setData({
                    sharetitle:data.data.title,
                    shareimg:data.data.imgurl,
                    encode:data.data.encode,
                    back_url:back_url
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(777777);
        //from menu
        var that =this;
        return {
            title: that.data.sharetitle,
            path: '/pages/login/login?type=1&encode='+that.data.encode+'&back_url='+that.data.back_url,
            imageUrl:that.data.shareimg
        }    

  },
  
  openbox:function (event) {
    var that1 = this;   
    console.log(event);
    var p_id = bigbox.getDataSet(event,'p_id');
    var s_id = bigbox.getDataSet(event,'s_id');
    var bpbp_id = bigbox.getDataSet(event,'bpbp_id');
    var pb_id = bigbox.getDataSet(event,'pb_id'); 
    var box_id = this.data.box_id; 
    //查询当前盒子是否被他人购买
    var par = {          
          bpbp_id:bpbp_id,
          callback: function (data) {
            wx.navigateTo({
              url: '../openbox/openbox?p_id=' + p_id+'&s_id='+s_id+'&bpbp_id='+bpbp_id+'&pb_id='+pb_id+'&box_id='+box_id
            })          
          },
          callback1: function () {
                //当前盒子已售出,改变其状态
                var boxdatas = that1.data.boxdata;
                for (var index in boxdatas.position) {
                    if(boxdatas.position[index].id==bpbp_id){
                        boxdatas.position[index].status=2;
                    }
                };
                console.log(boxdatas);
                that1.setData({
                  boxdata:boxdatas,
                });       
          }
        }
                
    bigbox.isBuy(par);
    
    
    
  },
  
  selled:function (event){ 
    wx.showToast({
        title: '商品已售罄',
        icon: 'none',
        duration: 2000
    })
  },
  productinfo:function (event) { 
    var p_id = bigbox.getDataSet(event,'p_id');
    var s_id = bigbox.getDataSet(event,'s_id');
    var whr = bigbox.getDataSet(event,'whr'); 
    var pb_id = bigbox.getDataSet(event,'pb_id'); 
    wx.navigateTo({
      url: '../details/details?p_id=' + p_id+'&s_id='+s_id+'&whr='+whr,
    })
  },
  
  changebox:function(event){
        app.playMusic('btnMusic');
          if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
              //登录弹窗
              bigbox._authCheckWin()
              return false
          }
        var that = this;
        //防重复点击
        bigbox.buttonClicked(that);
        
        //获取换一盒数据 
        var p_id = bigbox.getDataSet(event,'p_id');
        var s_id = bigbox.getDataSet(event,'s_id');
        var bpbp_id = bigbox.getDataSet(event,'bpbp_id');
        var par = {
          p_id:p_id,
          s_id:s_id,
          bb_id:bpbp_id,
          callback: function (data) {
            //换一大盒的动画
            that.animation = wx.createAnimation({
                duration: 500,
                timingFunction: 'ease',
            })
            that.animation
            .translateX(-400).opacity(0).step()
            .translateX(0).opacity(0).step()
            .scale3d(1, 1, 1).opacity(1).step()
            that.setData({ animation: that.animation.export() })
            setTimeout(function(){
                that.setData({
                    boxdata:data,
                    p_id:p_id,
                    s_id:s_id
                });
            },1000);     
          }
        }
                
        bigbox.getBoxData(par);
  },
  toorder: function (event) {
      if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
          //登录弹窗
          bigbox._authCheckWin()
          return false
      }
    //防重复点击
    bigbox.buttonClicked(this);  
    var p_id = bigbox.getDataSet(event,'p_id');
    var bpbp_id = bigbox.getDataSet(event,'bpbp_id');
    var sku_id = bigbox.getDataSet(event,'sku_id');
    var num = 1; 
    
    var par = {
        p_id:p_id,
        pb_id:'',
        bpbp_id:bpbp_id,
        act_id:'',
        sku_id:sku_id,
        num:num,
        callback: function(data){
                console.log(data);
                var order_id = data.order_id;
                wx.navigateTo({
                    url: '../materorder/materorder?order_id='+order_id
                }) 

        }
    }
    bigbox.getpreorder(par);  
                  
  }
})