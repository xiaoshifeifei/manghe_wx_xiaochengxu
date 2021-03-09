// pages/tgchoose/tgchoose.js
import {TgChoose} from "tgchoose-model.js"
var tgchoose = new TgChoose()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p:1,
    nextPage:1,
    allPro:[],
    name:"",
    hideChoose:true,
    winTxt:'恭喜您，本次选品成功！',
    hideWin:true,
    winChoTxt:'确认选择推广此商品？'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadPro(0)
  },

  /*获取所有推广商品*/
  _loadPro: function (type) {
    var name = this.data.name,that = this,allPro=this.data.allPro,p=this.data.p,nextPage=this.data.nextPage
    if(type == 1 && nextPage==0){
      tgchoose.toastMsg("没有更多内容了哦~")
      return false
    }
    tgchoose.getAllPro(name,p,(data)=>{
      if(data.err == 0){
        var nowData = allPro.concat(data.data.list)
        that.setData({
          allPro:nowData,
          p:p+1,
          nextPage:data.data.nextPage
        })
      }
    })
  },

  /*input失去焦点-获取内容*/
  getInputData:function(event){
    var value = event.detail.value,name=this.data.name
    //判断搜索条件是否变化
    if(value == this.data.name){
      return false;
    }
    //重置页面数据
    this.setData({
      p:1,
      nextPage:1,
      allPro:[],
      name:value
    })
    this._loadPro(0)
  },

  /*选品或取消选品*/
  itemSelect:function(event){
    var id = tgchoose.getDataSet(event, 'id'),
        index = tgchoose.getDataSet(event, 'index'),
        selectStatus = tgchoose.getDataSet(event, 'status'),
        that = this
    if (selectStatus == false) {
      //选择当前商品进行推广
        wx.showModal({
          title: '选择推广？',
          content: '确认选择推广此商品？',
          success(res){
            if(res.confirm){
              //去调接口
              that.chooseTg(id,index,that)
            }
          }
        })
    } else {
      //取消推广当前商品
      //选择当前商品进行推广
      wx.showModal({
        title: '取消推广？',
        content: '确认取消推广此商品？',
        success(res){
          if(res.confirm){
            //去调接口
            that.cancelTg(id,index,that)
          }
        }
      })
    }

  },

  /*选品*/
  chooseTg:function(id,index,that){
    tgchoose.chooseTgPro(id,(data)=>{
      if(data.err == 0){
      tgchoose.toastMsg(data.data.msg)
        //选品成功-重置数据
        that.data.allPro[index]['selectStatus'] = true
        that._resetData()
      }
    })
  },

  /*取消选品*/
  cancelTg:function(id,index,that){
    tgchoose.cancelTgPro(id,(data)=>{
      if(data.err == 0){
      tgchoose.toastMsg(data.data.msg)
        //选品成功-重置数据
        that.data.allPro[index]['selectStatus'] = false
        that._resetData()
      }
    })
  },

  /*重新渲染数据*/
  _resetData:function(){
    this.setData({
      allPro:this.data.allPro
    })
  },

  /*结束选品-返回到上一页*/
  _back:function(){
    this.toggleWin()
    wx.navigateBack({
      delta: 1
    })
  },

  /*继续选品 */
  _goOn:function(){
    this.toggleWin()
  },

  /*toggle选品成功or取消成功弹窗*/
  toggleWin:function(){
    this.setData({
      winTxt:this.data.winTxt,
      hideChoose:!this.data.hideChoose
    })
  },

  /*取消选品or选品确认弹窗*/
  toggleConfirm:function(){
    this.setData({
      winChoTxt:this.data.winChoTxt,
      hideWin:!this.data.hideWin
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
    this._loadPro(1)
  }
})