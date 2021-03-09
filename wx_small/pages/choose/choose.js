// pages/choose/choose.js
// var WxParse = require('../../assets/wxParse/wxParse/wxParse.js');
import { Choose } from 'choose-model.js';
var choose = new Choose(); //实例化 盒子页 对象
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonClicked: false,
    sharetitle: '',
    shareimg: '',
    encode: '',
    back_url: '',
    bb_id: 0,
    style1: '',
    style2: '',
    height: '',
    style_status: '',
    check_cur_box: 0,
    first: 1,
    tm_key: 0,
    style3: 'display:none;',
    html:'',
    from:'',
    guideHide:true
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (option) {
    // console.log(option);

    // this.setData({
    //   p_id: option.p_id,
    //   s_id: option.s_id
    // })
    // if (option.bb_id) {
    //   this.data.bb_id = option.bb_id;
    //   this.data.check_cur_box = 1; //分享进来，需要查找当前盒子
    // } else {
    //   this.data.bb_id = 0;
    //   this.data.check_cur_box = 0;
    // }
    //判断是否来自店铺
    // if (option.from) {
    //   this.setData({
    //     from: option.from
    //   })
    // }
  },

  _getImgHeight: function () {
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.orgin').boundingClientRect(function (rect) {
      console.log(rect);
      var height = rect.height * 0.75
      that.setData({
        height: height
      })
    }).exec();
  },
  /*加载数据*/
  _loadData: function () {
    var that = this;
    //获取盒子页数据 
    // var par = {
    //   p_id: this.data.p_id,
    //   s_id: this.data.s_id,
    //   bb_id: this.data.bb_id,
    //   check_cur_box: this.data.check_cur_box,
    //   callback: function (data) {
    //     wx.setNavigationBarTitle({
    //       title: data.pname
    //     })
    //     //            console.log('/pages/choose/choose?p_id='+that.data.p_id+'&s_id='+that.data.s_id+'&bb_id='+data.box_num);
    //     var back_url = encodeURIComponent('/pages/choose/choose?p_id=' + that.data.p_id + '&s_id=' + that.data.s_id + '&bb_id=' + data.box_num);
    //     if (data.position.length > 6 && data.style_status == 1) {
    //       that.setData({
    //         class_name: 'mh_new_choose_3hang_06'
    //       })
    //     }
    //     that.setData({
    //       boxdata: data,
    //       p_id: data.p_id,
    //       s_id: data.s_id,
    //       sname: data.sname,
    //       shop_img: that.data.shop_img,
    //       box_id: data.box_id,
    //       imgurl1: choose.ImgUrl1,
    //       bb_id: data.box_num,
    //       show_arr: data.show_arr,
    //       people_nums: data.people_nums,
    //       shareimg: 'https:' + data.pimage,
    //       shop_face: data.shop_face,
    //       back_url: back_url
    //     });
    //     if (data.style_status == 1) {
    //       that.setData({
    //         style1: 'mh_new_choose_02_02',
    //         style_status: 1,
    //       })
    //       //                  that._getImgHeight();
    //       //一行3个
    //       that.setData({
    //         style1: 'mh_new_choose_02_01',
    //         style2: 'mh_new_choose_3hang'
    //       })

    //     } else {
    //       //一行4个
    //       that.setData({
    //         style1: 'mh_new_choose_02_01',
    //         style2: 'mh_new_choose_4hang',
    //         style_status: 0,
    //       })
    //     }
    //   }
    // }

    // choose.getBoxData(par);

    //获取盒子页数据 
    var  p_id = this.data.p_id;
    var  s_id = this.data.s_id;
    var  bb_id = this.data.bb_id;
    var  check_cur_box = this.data.check_cur_box;
    choose.getBoxData(p_id,s_id,bb_id,check_cur_box,(data) => {
      if (data.err == 1000) {
          wx.setNavigationBarTitle({
            title: data.data.pname
          })
          //            console.log('/pages/choose/choose?p_id='+that.data.p_id+'&s_id='+that.data.s_id+'&bb_id='+data.box_num);
          var back_url = encodeURIComponent('/pages/choose/choose?p_id=' + that.data.p_id + '&s_id=' + that.data.s_id + '&bb_id=' + data.data.box_num+'&from='+that.data.from+'&tm_key='+that.data.tm_key);
          if (data.data.position.length > 6 && data.data.style_status == 1) {
            that.setData({
              class_name: 'mh_new_choose_3hang_06'
            })
          }
          that.setData({
            boxdata: data.data,
            p_id: data.data.p_id,
            s_id: data.data.s_id,
            sname: data.data.sname,
            shop_img: that.data.shop_img,
            box_id: data.data.box_id,
            imgurl1: choose.ImgUrl1,
            bb_id: data.data.box_num,
            show_arr: data.data.show_arr,
            people_nums: data.data.people_nums,
            shareimg: 'https:' + data.data.pimage,
            shop_face: data.data.shop_face,
            back_url: back_url
          });
          if (data.data.style_status == 1) {
            that.setData({
              style1: 'mh_new_choose_02_02',
              style_status: 1,
            })
            //                  that._getImgHeight();
            //一行3个
            that.setData({
              style1: 'mh_new_choose_02_01',
              style2: 'mh_new_choose_3hang'
            })

          } else {
            //一行4个
            that.setData({
              style1: 'mh_new_choose_02_01',
              style2: 'mh_new_choose_4hang',
              style_status: 0,
            })
          }      
      }else{
          //返回失败，显示库存不足
          wx.showModal({
            title: '温馨提示',
            content: '库存不足,去看其他商品吧~',
            showCancel:false,
            success: function(res) {
              if (res.confirm) {
                  if(that.data.from=='shop'){
                    wx.navigateBack({
                      delta: 1
                    })
                  }else{
                    wx.switchTab({
                        url: '/pages/index/index'
                    });   
                  }
              }
            }
          })
      }
    })

    //查询分享图和对应标题
    var type = 4;//挑盒
    var p_id = this.data.p_id;
    var tm_key = this.data.tm_key;
    choose.getShareConfig(type,p_id,tm_key,(data) => {
      if (data.err == 0) {
        that.setData({
          sharetitle: data.data.title,
          //                    shareimg:data.data.imgurl,
          encode: data.data.encode,
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
    var curPages =  getCurrentPages();
    var currentPage = curPages[curPages.length-1].options;
    // console.log(curPages);
    console.log(currentPage);  
    this.setData({
      p_id: currentPage.p_id,
      s_id: currentPage.s_id
    })
    if(currentPage.tm_key){
      this.setData({
        tm_key: currentPage.tm_key,  
      })
    }
    if (currentPage.from) {
      this.setData({
        from: currentPage.from
      })
    }
    if (currentPage.bb_id) {
      this.setData({
        bb_id : currentPage.bb_id,
        check_cur_box : 1, //分享进来，需要查找当前盒子
      })
      
    }

    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      wx.navigateTo({
        url: '../logauth/logauth'
      })
      return false
    }
    
    //判断是否存在当前盒
    if (this.data.bb_id > 0) {
      this.data.check_cur_box = 1; //分享进来，需要查找当前盒子
    }
    this._loadData();

    var that = this;
    let isPhoneX = app.globalData.isIphoneX;
    if (isPhoneX) {
      this.setData({
        isPhoneX: true,
      })
    }
    app.playMusic('chooseMusic');

    //轮询刷新头像列表
    that.data.interval = setInterval(function () {
      var box_id = that.data.box_id;
      choose.getCurrentNumber(box_id, (data) => {
        that.setData({
          show_arr: data.data.show_arr,
          people_nums: data.data.people_nums
        });
      });
    }, 100000);
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
    var box_id = this.data.box_id;
    clearInterval(this.data.interval);
    choose.getReduceNumber(box_id, (data) => {

    });


  },
  gohome: function () {     //
    wx.switchTab({
      url: '../index/index'
    })
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
    console.log(666666);
    //from menu
    var that = this;
    return {
      title: that.data.sharetitle,
      path: '/pages/login/login?type=1&encode=' + that.data.encode + '&back_url=' + that.data.back_url,
      imageUrl: that.data.shareimg
    }
  },

  goshop: function (event) {
    var id = choose.getDataSet(event, 's_id');
    if (id) {
      //跳转对应的店铺页
      if (this.data.from == 'shop') {
        //店铺出发到店铺，这里防止打开多层页面
        wx.navigateBack({
          delta: 1
        })

      } else {
        wx.navigateTo({
          url: '../shop/shop?id=' + id,
        })
      }

    }

  },

  openbox: function (event) {
    var that1 = this;
    console.log(event);
    var p_id = choose.getDataSet(event, 'p_id');
    var s_id = choose.getDataSet(event, 's_id');
    var bpbp_id = choose.getDataSet(event, 'bpbp_id');
    var pb_id = choose.getDataSet(event, 'pb_id');
    var box_id = this.data.box_id;
    var tm_key = this.data.tm_key;
    //查询当前盒子是否被他人购买
    var par = {
      bpbp_id: bpbp_id,
      callback: function (data) {
        clearInterval(that1.data.interval);

        wx.navigateTo({
          url: '../openbox/openbox?p_id=' + p_id + '&s_id=' + s_id + '&bpbp_id=' + bpbp_id + '&pb_id=' + pb_id + '&box_id=' + box_id + '&tm_key=' +tm_key
        })
      },
      callback1: function () {
        //当前盒子已售出,改变其状态
        var boxdatas = that1.data.boxdata;
        for (var index in boxdatas.position) {
          if (boxdatas.position[index].id == bpbp_id) {
            boxdatas.position[index].status = 2;
          }
        };
        console.log(boxdatas);
        that1.setData({
          boxdata: boxdatas,
        });
      }
    }

    choose.isBuy(par);



  },

  selled: function (event) {
    wx.showToast({
      title: '此盒已售出',
      icon: 'none',
      duration: 2000
    })
  },
  productinfo: function (event) {
    var p_id = choose.getDataSet(event, 'p_id');
    var s_id = choose.getDataSet(event, 's_id');
    var whr = choose.getDataSet(event, 'whr');
    // var pb_id = choose.getDataSet(event, 'pb_id');
    // wx.navigateTo({
    //   url: '../details/details?p_id=' + p_id + '&s_id=' + s_id + '&whr=' + whr + '&pb_id=' + pb_id + '&tm_key='+tm_key,
    // })
    var that = this;
    choose.getDetailData(s_id,p_id,whr,(data)=>{
      if (data.err == 1000) {
          var str = data.data.content_images;

          that.setData({
            html:str.replace(/\<img/g,'<img style="width:100%;height:auto;display:flex"'),
            style3: 'display:block;',
          });
      }  
    })

  },

  changebox: function (event) {
    app.playMusic('btnMusic')
    var that = this;
    //防重复点击
    choose.buttonClicked(that);

    //获取换一盒数据 
    var p_id = choose.getDataSet(event, 'p_id');
    var s_id = choose.getDataSet(event, 's_id');
    var bb_id = choose.getDataSet(event, 'bb_id');
    var check_cur_box = 0;
    // var par = {
    //   p_id: p_id,
    //   s_id: s_id,
    //   bb_id: bb_id,
    //   check_cur_box: check_cur_box,
    //   callback: function (data) {
    //     //换一大盒的动画
    //     that.animation = wx.createAnimation({
    //       duration: 500,
    //       timingFunction: 'ease',
    //     })
    //     that.animation
    //       .translateX(-400).opacity(0).step()
    //       .translateX(0).opacity(0).step()
    //       .scale3d(1, 1, 1).opacity(1).step()
    //     that.setData({ animation: that.animation.export() })

    //     //            console.log('/pages/choose/choose?p_id='+that.data.p_id+'&s_id='+that.data.s_id+'&bb_id='+data.box_num);
    //     var back_url = encodeURIComponent('/pages/choose/choose?p_id=' + that.data.p_id + '&s_id=' + that.data.s_id + '&bb_id=' + data.box_num + '&tm_key=' +that.data.tm_key);
    //     that.setData({
    //       boxdata: data,
    //       p_id: p_id,
    //       s_id: s_id,
    //       box_id: data.box_id,
    //       bb_id: data.box_num,
    //       show_arr: data.show_arr,
    //       people_nums: data.people_nums,
    //       back_url: back_url,
    //       check_cur_box: 1
    //     });
    //   }
    // }

    // choose.getBoxData(par);

    choose.getBoxData(p_id,s_id,bb_id,check_cur_box,(data)=>{
        if(data.err==1000){
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

          //            console.log('/pages/choose/choose?p_id='+that.data.p_id+'&s_id='+that.data.s_id+'&bb_id='+data.box_num);
          var back_url = encodeURIComponent('/pages/choose/choose?p_id=' + that.data.p_id + '&s_id=' + that.data.s_id + '&bb_id=' + data.data.box_num + '&from='+that.data.from+'&tm_key='+that.data.tm_key);
          that.setData({
            boxdata: data.data,
            p_id: p_id,
            s_id: s_id,
            box_id: data.data.box_id,
            bb_id: data.data.box_num,
            show_arr: data.data.show_arr,
            people_nums: data.data.people_nums,
            back_url: back_url,
            check_cur_box: 1
          });    

        }else{
            //返回失败，显示库存不足
            wx.showModal({
              title: '温馨提示',
              content: '库存不足,去看其他商品吧~',
              showCancel:'false',
              success: function(res) {
                if (res.confirm) {
                    if(that.data.from=='shop'){
                      wx.navigateBack({
                        delta: 1
                      })
                    }else{
                      wx.switchTab({
                          url: '/pages/index/index'
                      });   
                    }
                }
              }
            })

        }

    })

  },

  cloose_coupon:function(){
      this.setData({
        'style3':'display:none;'
      })
  },
  open:function(){

  },
  /*获取当前规则*/
  getRule:function(){
    var p_id =this.data.p_id,  that = this
    choose.getRuleData(p_id,(data)=>{
      if(data.err == 0){
      console.log(data)
      that.setData({
        ruleData:data.data,
        guideHide:false
      })
    }
  })
  },

  /*关闭规则弹窗*/
  closeGuide:function(){
    this.setData({
      guideHide:true
    })
  },

  /*跳转到关联端盒*/
  _goBuyAll:function(){
    var s_id = this.data.s_id,p_id=this.data.boxdata.rel_pid
    //跳转
    wx.navigateTo({
      url: '../matterdetails/matterdetails?p_id=' + p_id + '&s_id=' + s_id
    })
  }


})