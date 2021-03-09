// pages/weldetail/weldetail.js
import {Weldetail} from 'weldetail-model.js'
var weldetail = new Weldetail()
var app = getApp();
var timeGuide;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    WaveImg:weldetail.WaveImg,
    WinImg:weldetail.WinImg,
    bottomHide:true,
    popHide:true,
    noAward:true,//未中奖弹窗
    hideBox:true,//中奖弹窗
    hideRank:true,//榜单

    backImg:weldetail.backImg,
    code:"",//二维码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.scene){
      //二维码分享入口&链接分享
      var scene = decodeURIComponent(options.scene)
      var paramArr = scene.split("&")
      //0元详情id
      var id = paramArr[0].split("=")[1]
      //分享标识ID
      var encode = paramArr[1].split("=")[1]
    }

    //开奖通知入口
    if (options.id) {
      var id = this.options.id
      var encode = 'default'
    }

    //开奖通知参数
    var from = 0;
    if(options.from){
      var from = options.from
    }

    this.setData({
      id: id,
      encode:encode,
      from:from
    })

    var that = this
    //先verify token
    if (encode != 'default' || from != 0) {
        weldetail.verify(encode,(data)=>{
          if(data.err == 1000){
            if(data.data.is_bind_iphone == 1){
              app.globalData.is_bind_iphone = true
            }
        }
        that._getDetail()
      })
    }else{
      //非分享或非通知进入页面
      this._getDetail()
    }
  },

  /*下载所需图片*/
  _downImg: function (url,callback) {
    let that = this
    const downloadTask = wx.downloadFile({
      url: url,
      success: function (res) {
        if (res.statusCode === 200) {
          callback && callback(res.tempFilePath)
        }
      }
    })
  },

  formSubmit:function(){
    this.setData({
      bottomHide:false,
      popHide:false,
    })
  },

  closeShare:function(){
    this.setData({
      bottomHide:true,
      popHide:true,
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
    var that = this
    try {
      timeGuide = setInterval(function () {
        if (that.data.Lottery && that.data.Lottery.rstatus == 2 && that.data.SelfData.self_status == 1) {
          //已开奖
          that._showAwardWin()
        } else {
          clearInterval(timeGuide);
        }
      }.bind(this), 1000)
    } catch (e) {

    }
    app.playMusic('backMusic')
  },

  /*是否展示中奖弹窗*/
  _showAwardWin:function(){
    //判断是否是通过通知进入页面
    var that = this
    if (app.globalData.isSetting && app.globalData.is_bind_iphone) {
      //判断是否弹窗
      var SelfData = that.data.SelfData
      //判断是否已经弹窗
      var id = that.data.id
      var param = "lotwin"+id
      var value = wx.getStorageSync(param)
      if(value){
        //关闭定时器
        clearInterval(timeGuide);
      }else{
        clearInterval(timeGuide);
        wx.setStorageSync(param, that.data.id);
        if (SelfData.self_award) {
          //已中奖
          that._showSelAward()
        } else {
          //很遗憾未中奖
          that._showNoAward()
        }
      }
    }
  },

  /*未中奖弹窗显示*/
  _showNoAward:function(){
    this.setData({
      noAward:false
    })
  },

  /*已中奖弹窗显示*/
  _showSelAward:function(){
    //显示奖励内容
    var award = this.data.SelfData.self_award
    var str = ''
    for (let i = 0; i < award.length; i++) {
      str += award[i] + '\r\n'
    }
    this.setData({
      hideBox:false,
      congText:str
    })
  },

    /**
     *0元活动详情
     */
  _getDetail:function(){
      let that = this
      let id = that.data.id
      weldetail.getWeldetail(id,(data)=>{
        if(data.err ==0){
          if(data.data.lottery.close_share == 1){
            that._closeShare()
          }
          that.setData({
            Lottery: data.data.lottery,
            Award: data.data.award,
            More: data.data.more,
            Hot: data.data.hot,
            HotIndex: data.data.hot_index,
            SelfData: data.data.self_info,
            Poster: data.data.poster,
          })
          if(data.data.lottery.type ==0){
            that._countTime(data.data.lottery.ltime)
          }
          //获取海报图片
          var head = data.data.self_info.face_wx
          var proImg = data.data.lottery.images.pic1
          //that._getPosterImg(head,proImg)
        }
      })
  },

  //关闭顶部分享
  _closeShare:function(){
    wx.hideShareMenu()
  },

  //获取排行榜
  _getRank:function(){
    //判断是否登陆
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      weldetail._authCheckWin()
      return false;
    }
    var lotid = this.data.id,that = this
    that._disableButton()
    weldetail.getRank(lotid,(data)=>{
      if(data.err == 0){
        that.setData({
          rankData:data.data,
          hideRank:false
        })
      }
    })
  },

  _closeRank:function(){
    this.setData({
      hideRank:true
    })
  },

  _doNothing:function(){

  },

  /*下载海报图片*/
  _getPosterImg: function (head,proImg) {
    var backImg = this.data.backImg
    var that = this
    //下载背景图片
    this._downImg(backImg,(data)=>{
      that.setData({
        path:data
      })
    })
    //下载头像
    this._downImg(head,(data)=>{
      that.setData({
        path1:data
      })
    })
    //下载商品图片
    this._downImg(proImg,(data)=>{
      that.setData({
        path3:data
      })
    })
    //获取小程序码
    this._getCode()
  },

    /**
     *0元抽奖参与
     */
    goPartin: function () {
      if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
        //登录弹窗
        weldetail._authCheckWin()
        return false
      }
      let that = this
      let id = that.data.id
      let encode = that.data.encode
      let SelfData = that.data.SelfData
      if(SelfData['self_status'] == 1){
        weldetail.toastMsg("您已参与喽~")
        return false
      }
      that._disableButton()
      weldetail.getPartIn(id,encode,(data)=>{
        if(data.err == 0){
          weldetail.toastMsg(data.data.ok)
          //设置用户的
          SelfData['self_status'] = 1;
          that.setData({
            SelfData:SelfData
          })
          if (that.data.Lottery.type == 1) {
            var Lottery = that.data.Lottery
            Lottery['left_num'] = data.data.left_num
            that.setData({
                Lottery:Lottery
            })
          }
          that.goMessage()
        }
      })
    },

  /**
   * 0元抢购详情
   */
  goDetail:function(event){
    let id = weldetail.getDataSet(event,'id')
    wx.navigateTo({
      url: '../weldetail/weldetail?id='+id
    })
  },

  /*跳转奖励立即购买*/
  goLink:function(event){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      weldetail._authCheckWin()
      return false
    }

    let link = weldetail.getDataSet(event,'link')
    wx.navigateTo({
      url: link
    })
  },

  /*type0倒计时*/
  _countTime: function (count) {
    var that = this
    //计算当前天数小时数、分钟数、秒数
    var day = Math.floor(count/86400)
    if(day<10){
      day = 0+day.toString()
    }
    var hour = Math.floor((count%86400)/3600);
    if(hour<10){
      hour = 0+hour.toString()
    }
    var minute = Math.floor(((count%86400)%3600)/60);
    if(minute<10){
      minute = 0+minute.toString()
    }
    var second = ((count%86400)%3600)%60;
    if(second<10){
      second = 0+second.toString()
    }
    if(count == 0){
      that.setData({
        day:'00',
        hour: '00',
        minute:'00',
        second:'00',
        listHide:true
      })
      //weldetail.toastMsg("活动已结束")
      return
    }
    that.setData({
      day:day,
      hour: hour,
      minute:minute,
      second:second
    })
    setTimeout(function () {
      count--;
      that._countTime(count);
    }, 1000);
  },


  /*更多活动*/
  moreList:function(){
    wx.navigateTo({
      url: '../wellist/wellist'
    })
  },

  /*获取小程序码*/
  _getCode:function(){
    var id = this.data.id
    var that = this
    if(!that.data.code){
      weldetail.getCode(id,(data)=>{
        if(data.err == 0){
          that._downImg(data.data.code,(res)=>{
            that.setData({
              path2:res
            })
          })
        }
      })
    }
  },

  goCanvas:function(){
    if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
      //登录弹窗
      weldetail._authCheckWin()
      return false
    }
    var that = this;
    that._disableButton()
    if(that.data.imagePath){
      that.setData({
        bottomHide:false,//底部按钮
        popHide: false,
        canvasHidden:true
      });
      return false
    }
    this.setData({
      popHide: true,
      bottomHide:false,//底部按钮
    });
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading',
      duration: 1500
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        popHide: false
      });
    }, 1500)
  },

  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#3A63A8")
    context.fillRect(0, 0, 375, 667)
    //获取背景图片
    var path = this.data.path;
    //console.log(path)
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, 0, 0, 375, 667);

    //绘制名字
    context.setFontSize(20);
    context.setFillStyle('#FFFFFF');
    context.setTextAlign('center');
    var name= this.data.SelfData.nickname_wx
    context.fillText(name, 185, 170);
    context.stroke();

    //绘制邀请语
    context.setFontSize(15);
    context.setFillStyle('#F9CA32');
    context.setTextAlign('center');
    var text1= this.data.Poster.text1
    context.fillText(text1, 185, 190);
    context.stroke();

    //绘制白色背景
    context.setFillStyle("#FFFFFF")
    context.fillRect(10, 200, 355, 457)

    //绘制商品图片
    var path3 = this.data.path3;
    //console.log(path3)
    context.drawImage(path3, 20, 210, 335, 200);

    //绘制活动标题
    context.setFontSize(18);
    context.setFillStyle('#000000');
    context.setTextAlign('left');
    var text2= this.data.Lottery.title
    //context.fillText(text2, 15, 440,365);
    var offsetHeight = that.drawArticle(context, text2, 375 - 50, 20, 440)
    context.stroke();

    offsetHeight += 28
    //绘制开奖时间
    context.setFontSize(15);
    context.setFillStyle('#7F7F7F');
    context.setTextAlign('left');
    var text3= this.data.Poster.text3
    context.fillText(text3, 15, offsetHeight,375);
    context.stroke();

    //绘制二维码
    var path2 = this.data.path2;
    //console.log(path2)
    context.drawImage(path2, 123, 495, 130, 130);

    //绘制底部文字
    context.setFontSize(15);
    context.setFillStyle('#7F7F7F');
    context.setTextAlign('center');
    var text4= this.data.Poster.text4
    context.fillText(text4, 185, 645);
    context.stroke();

    //绘制用户头像
    var path1 = this.data.path1;
    context.arc(186, 100, 50, 0, 2 * Math.PI) //画出圆
    context.strokeStyle = "#3A63A8";
    context.clip(); //裁剪上面的圆形
    context.drawImage(path1, 136, 50, 100, 100); // 在刚刚裁剪的园上画图

    context.draw(true,setTimeout(function(){
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden:true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    },1000));
  },

  //点击保存到相册
  baocun:function(){
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              /* 该隐藏的隐藏 */
              that.setData({
                popHide: true,
                bottomHide:true,//底部按钮
              })
            }
          },fail:function(res){
            console.log(res)
          }
        })
      }
    })
  },

  drawArticle(ctx, kl, width, x, y) {
    let chr = kl.split('') // 分割为字符串数组
    let temp = ''
    let row = []
    for (let a = 0; a < chr.length; a++) {
      if (ctx.measureText(temp).width < width) {
        temp += chr[a]
      } else {
        a--
        row.push(temp)
        temp = ''
      }
    }
    row.push(temp)

    for (var b = 0; b < row.length; b++) {
      // 控制最多显示2行
      if (b < 2) {
        ctx.fillText(row[b], x, y + b * 22);
      }
    }
    let _len = row.length > 2 ? 2 : row.length
    return y + (_len - 1) * 22
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(timeGuide);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timeGuide);
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

  goMessage:function(){
    try{
      if(wx.requestSubscribeMessage){
        wx.requestSubscribeMessage({
          tmplIds: ['MNLiqBKdOFzLQvckojOoHMwOME569ymbc8NcHPG8gcE'],
          success (res) {
            if(res.MNLiqBKdOFzLQvckojOoHMwOME569ymbc8NcHPG8gcE == 'accept'){
              weldetail.toastMsg("开奖结果订阅成功喽~")
            }else{
              weldetail.toastMsg("您取消了订阅哦~")
            }
          },
          fail(res){
            weldetail.toastMsg("您取消了订阅哦~")
          }
        })
      }else{
        console.log("版本太低")
      }
    }catch (e){
      console.log(e)
    }
  },

  /*关闭未中奖弹窗*/
  closeNoAward:function(){
    this.setData({
      noAward:true
    })
  },

  /*关闭中奖弹窗*/
  closeShareWin: function () {
    this.setData({
      hideBox:true
    })
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
    },2000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    console.log(123456);
    //中奖弹窗分享-跳转到0元抽主界面
    //详情分享&顶部分享-跳转到详情页面
    var that = this

    if(event.from === 'button'){
      var btnId = event.target.dataset.id
      if(btnId == 1){
        //中奖分享
        var title = that.data.SelfData.award_txt
        var encode = that.data.SelfData.encode
        var img = that.data.Lottery.images.pic2
        var back_url = encodeURIComponent('/pages/welfare/welfare')
        return {
          title: title,
          path: '/pages/login/login?encode='+encode+'&back_url='+back_url,
          imageUrl:img
        }
      }else if(btnId == 2){
        //海报底部按钮分享
        var title = that.data.Lottery.share_title
        var img = that.data.Lottery.images.pic2
        var id = that.data.id
        var a = that.data.SelfData.m_id
        var scene = encodeURIComponent("id="+id+"&a="+a)

        return {
          title: title,
          path: '/pages/weldetail/weldetail?scene='+scene,
          imageUrl:img
        }
      }
    }else{
      var title = that.data.Lottery.share_title
      var img = that.data.Lottery.images.pic2
      var id = that.data.id
      var a = that.data.SelfData.m_id
      var scene = encodeURIComponent("id="+id+"&a="+a)
      return {
        title: title,
        path: '/pages/weldetail/weldetail?scene='+scene,
        imageUrl:img
      }
    }
  }
})