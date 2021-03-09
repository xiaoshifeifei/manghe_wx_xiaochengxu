// pages/activityadd/activityadd.js
import {ActivityAdd} from "activityadd-model.js"
var activityadd = new ActivityAdd();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'2020/04/06'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = this.getNowFormatDate();
    this.setData({
      'date':date,
      'stime':'20:00',
      'etime':'22:00'
    })

  },

  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "/";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },


  bindDateChange: function(e) {
    let date = e.detail.value.replace(/-/g,"/");
    this.setData({
      'date':date
    })

  },  

  bindStimeChange:function(e){
    let stime = e.detail.value;
    this.setData({
      'stime':stime
    })
  },

  bindEtimeChange:function(e){
    let etime = e.detail.value;
    this.setData({
      'etime':etime
    })

  },

  saveActivity:function(){
    let date = this.data.date;
    let stime = this.data.stime;
    let etime = this.data.etime;
    if(etime<=stime){
      activityadd.toastMsg('结束时间需大于开始时间');
    }else{
      this._saveData(date,stime,etime);
    }
    
  },
  
  /*保存活动信息*/
  _saveData:function(date,stime,etime){
    var that = this
    activityadd.saveData(date,stime,etime,(data)=>{
      if(data.err == 0){
        activityadd.toastMsg('添加成功');
        setTimeout(function(){
          wx.redirectTo({
            url: '../tgpro/tgpro?nowId=3',
          })
        },1500)
      }else{
        activityadd.toastMsg(data.msg);
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

})