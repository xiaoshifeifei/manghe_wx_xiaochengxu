// pages/myhome/myhome.js
import { MyHome } from "myhome-model.js";
var myhome = new MyHome();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tgBar: [],
    nowId: 1,
    p: 1,
    nextPage: 1,
    product: [],
    WaveImg: myhome.WaveImg,
    imagePath: '',
    show_reduce:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.tg = options.tg
  },

  /*获取主要信息*/
  _getHome: function (type) {
    var that = this, invitecode = this.data.tg
    if (type == 1) {
      wx.showNavigationBarLoading() //在标题栏中显示加载
    }
    myhome.getHome(invitecode, (data) => {
      if (data.err == 0) {
        that.setData({
          info: data.data.info,
          share: data.data.share,
          tgBar:data.data.tab,
          self_data:data.data.self_data
        })
        that._getProduct(0)
        if (type == 1) {
          // complete
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
          myhome.toastMsg("刷新成功")
        }
      }
    })
  },

  /*获取推广商品*/
  _getProduct: function (from) {
    var that = this, invitecode = this.data.tg, p = this.data.p,
      product = this.data.product, nextPage = this.data.nextPage, prosty = -1
    if (from == 1 && nextPage == 0) {
      myhome.toastMsg("没有更多商品了哦~")
      return
    }
    myhome.getProduct(invitecode, 1, p, (data) => {
      if (data.err == 0) {
        var nowData = product.concat(data.data.list)
        if (nowData.length % 2 == 1) {
          prosty = nowData.length - 1
        }
        that.setData({
          product: nowData,
          p: p + 1,
          nextPage: data.data.nextPage,
          prosty: prosty,
          show_reduce:data.data.show_reduce
        })
        if (from == 0 && p <= 2 && !that.data.share.share_img && !that.data.imagePath) {
          that._loadShareImg()
        }
      }
    })
  },

  /*获取图片信息*/
  getImage: function (url) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: url,
        success: function (res) {
          resolve(res)
        },
        fail: function (res) {
          reject(res)
        }
      })
    })
  },

  /*promise同时下载多图*/
  getImageAll: function (image_src) {
    let that = this;
    var all = [];
    image_src.map(function (item) {
      all.push(that.getImage(item))
    })
    return Promise.all(all)
  },

  /*生成分享海报图*/
  _loadShareImg: function () {
    var that = this, product = this.data.product, proImg = [], proPrice = []
    if (product.length > 0) {
      //开始搞图片
      for(let i=0;i<product.length;i++){
        if(i<=9){
          proImg.push(product[i]['info']['img_pic1'])
          proPrice.push("￥" + product[i]['info']['price1'])
        }
      }
    }
   /* var that = this
    var proImg = [
        'http://ht-cdn.hetunb.com/ht-app/default/upload/6/9/c/69c0edf757bf5323009b141a5f1230e9.jpg',
        'http://ht-cdn/ht-app/default/upload/d/d/f/ddfca30ad45388ca0f0564d26e4a2562.png',
        'http://ht-cdn.hetunb.com/ht-app/default/upload/6/9/c/69c0edf757bf5323009b141a5f1230e9.jpg',
        'http://ht-cdn/ht-app/default/upload/3/9/7/3971e7b22a784038b4541af220b47daf.jpg',
        'http://ht-cdn/ht-app/default/upload/d/d/f/ddfca30ad45388ca0f0564d26e4a2562.png',
        'http://ht-cdn/ht-app/default/upload/d/d/f/ddfca30ad45388ca0f0564d26e4a2562.png',
        'http://ht-cdn/ht-app/default/upload/d/d/f/ddfca30ad45388ca0f0564d26e4a2562.png',
        'http://ht-cdn/ht-app/default/upload/d/d/f/ddfca30ad45388ca0f0564d26e4a2562.png',
        'http://ht-cdn/ht-app/default/upload/d/d/f/ddfca30ad45388ca0f0564d26e4a2562.png',
        //'http://ht-cdn/ht-app/default/upload/d/d/f/ddfca30ad45388ca0f0564d26e4a2562.png',
    ]
    var proPrice = [
        "￥60.0",
        "￥60.1",
        "￥60.2",
        "￥60.3",
        "￥60.4",
        "￥60.5",
        "￥60.6",
        "￥60.7",
        "￥60.8",
        "￥60.9",
    ]*/
    this.data.proPrice = proPrice
    if (proImg.length > 0) {
      this.getImageAll(proImg).then((res) => {
        //循环res写入价格
        for (let i = 0; i < res.length; i++) {
          res[i]['price'] = proPrice[i]
        }
        that.data.proImg = res
        this._createImg().then((res) => {
          that._savePath().then((res) => {
            that.setData({
              imagePath: res.tempFilePath
            })
          }).catch(err => {
            console.log("保存图片报错err" + JSON.stringify(err))
            //that._loadShareImg()
          })
        }).catch(err => {
          console.log("绘制图片报错err" + JSON.stringify(err))
          //that._loadShareImg()
        })
      }).catch(err => {
        console.log("下载图片报错err" + JSON.stringify(err))
        //that._loadShareImg()
      })
    }
  },

  /*生成分享海报图*/
  /*海报绘制方法*/
  _createImg: function () {
    //定义画布宽高
    var that = this
    var width = 375;
    var height = 300;

    let proImg = this.data.proImg, proPrice = this.data.proPrice
    let ctx = wx.createCanvasContext('canvas');

    //绘制背景颜色
    ctx.setFillStyle("#FFFFFF")
    ctx.fillRect(0, 0, width, height)

    //开始绘制商品图
    if (proImg.length > 0) {
      var margin_x = 10, margin_y = 20, proImgLen = proImg.length
      switch (proImg.length) {
        case 1:
          //只有一张图
          ctx.drawImage(proImg[0].path, 87.5, 30, 200, 200);
          //绘制价格
          ctx.setFontSize(40);
          ctx.setTextAlign('center');
          ctx.setFillStyle('#F45A7E');
          ctx.fillText(proPrice[0], width / 2, 270);
          ctx.stroke();
          break;
        case 2:
        case 3:
        case 4:
          let all_num = proImg.length, fontSize = 40 / proImgLen + 10,
            pro_x = width - (all_num + 1) * margin_x,
            pro_width = (width - ((all_num + 1) * margin_x)) / all_num,
            pro_y = (height - pro_width) / 2 - fontSize;
          for (let i = 0; i < proImg.length; i++) {
            let pro = proImg[i].path
            //开始绘制商品图
            ctx.drawImage(pro, pro_x / all_num * i + (i + 1) * margin_x, pro_y, pro_width, pro_width);
            //绘制价格
            ctx.setFontSize(fontSize);
            ctx.setTextAlign('center');
            ctx.setFillStyle('#F45A7E');
            ctx.fillText(proPrice[1], pro_x / all_num * i + (i + 1) * margin_x + pro_width / 2, pro_y + pro_width + fontSize);
            ctx.stroke();
          }
          break;
        case 5:
        case 6:
          var res = this.chunk(proImg, 3), chunk_num = 3
          break;
        case 7:
          var res = this.chunk(proImg, 4), chunk_num = 4
          break;
        case 8:
          var res = this.chunk(proImg, 4), chunk_num = 4
          break;
        case 9:
        case 10:
          var res = this.chunk(proImg, 5), chunk_num = 5
          break;
      }
      if (res) {
        for (let i = 0; i < res.length; i++) {
          let all_num = res[0].length,
            pro_x = width - (all_num + 1) * margin_x,
            pro_width = (width - ((all_num + 1) * margin_x)) / all_num,
            pro_y = height - (res.length + 1) * margin_y
          for (let j = 0; j < res[i].length; j++) {
            if (i == 1) {
              //变化margin_x
              margin_x = (width - (res[i].length * pro_width)) / (res[i].length + 1)
            }
            let pro = res[i][j].path, price = res[i][j]['price']
            ctx.drawImage(pro, pro_x / all_num * j + (j + 1) * margin_x, pro_y / res.length * i + (i + 1) * margin_y, pro_width, pro_width);
            //绘制价格
            ctx.setFontSize(20);
            ctx.setTextAlign('center');
            ctx.setFillStyle('#F45A7E');
            ctx.fillText(price, pro_x / all_num * j + (j + 1) * margin_x + pro_width / 2, pro_y / res.length * i + (i + 1) * margin_y + pro_width + 20);
            ctx.stroke();
          }
        }
      }
    }

    return new Promise((resolve, reject) => {
      ctx.draw(false, (res) => {
        if (res.errMsg == "drawCanvas:ok") {
          resolve(res)
        } else {
          reject(res)
        }
      })
    })
  },

  /*设置图片path*/
  _savePath: function () {
    var that = this
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        canvasId: 'canvas',
        success: function (res) {
          resolve(res)
        },
        fail: function (res) {
          reject(res)
        }
      });
    })
  },

  /*js分割图片*/
  chunk: function (arr, size) {
    var objArr = [];
    var index = 0;
    var objArrLen = arr.length / size;
    for (var i = 0; i < objArrLen; i++) {
      var arrTemp = [];
      for (var j = 0; j < size; j++) {
        arrTemp[j] = arr[index++];
        if (index == arr.length) {
          break;
        }
      }
      objArr[i] = arrTemp;
    }
    return objArr;
  },



  /*跳转到个人昵称设置*/
  goMySet: function () {
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      myhome._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '/pages/myset/myset',
    })
  },

  // 跳转到选择推广商品页面
  goAllPro: function () {
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      myhome._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '/pages/tgpro/tgpro',
    })
  },

  // 跳转到生辰海报页面
  _goPoster: function () {
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      myhome._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '/pages/tgposter/tgposter',
    })
  },

  /*跳转到购买页面*/
  /*跳转奖励立即购买*/
  goLink: function (event) {
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      myhome._authCheckWin()
      return false
    }
    let link = myhome.getDataSet(event, 'link'), status = myhome.getDataSet(event, 'status')
    if (status != 2) {
      myhome.toastMsg("当前商品暂时不能购买哦~")
      return false
    }
    wx.navigateTo({
      url: link
    })
  },

  /*跳转到待支付订单页面*/
  goOrder:function(){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      myhome._authCheckWin()
      return false
    }
    wx.navigateTo({
      url: '/pages/orderlist/orderlist'
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
    this.data.p = 1
    this.data.nextPage = 1
    this.data.product = []
    this._getHome(0)
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
    this.data.p = 1
    this.data.nextPage = 1
    this.data.product = []
    this._getHome(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getProduct(1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(444444);
    var that = this, baseIfo = that.data.share, share_img
    if (baseIfo.share_img) {
      share_img = baseIfo.share_img
    } else {
      share_img = this.data.imagePath
    }
    return {
      title: baseIfo.share_txt,
      path: baseIfo.share_url,
      imageUrl: share_img
    }
  }
})