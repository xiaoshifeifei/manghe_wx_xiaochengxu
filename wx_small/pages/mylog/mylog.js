// pages/mylog/mylog.js
import {MyLog} from "mylog-model.js"
var mylog = new MyLog()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logBar: [{id: 1, name: '活跃度'}, {id: 2, name: '碎片'}, {id: 3, name: '欧气'}],
    nowId: 1,
    p1: 1,
    p2: 1,
    p3: 1,
    isEnd1: 1,
    isEnd2: 1,
    isEnd3: 1,
    listData1: [],
    listData2: [],
    listData3: [],
    activeHide: false,
    chipHide: true,
    luckyHide: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
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
    var nowId = this.data.nowId
    var isEnd = this.data["isEnd"+nowId]
    if(isEnd == 0){
      //提示没有更多内容
      return
    }
    this._loadData()
  },
  /*加载数据*/
  _loadData: function () {
    var that = this
    var nowId = this.data.nowId
    //判断当前是否有下一页
    var isEnd = this.data["isEnd"+nowId]
    if(isEnd == 0){
      //提示没有更多内容
      return
    }
    var p = this.data["p"+nowId]
    mylog.getLogList(nowId,p,(data)=>{
      if(data.err == 0){
          var listData = that.data['listData'+nowId].concat(data.data.list)
          that._setData(nowId,p+1,data.data.nextPage,listData,that)
      }
    })
  },
  /*设置数据*/
  _setData:function(nowId,p,nextPage,listData,that){
    if(nowId == 1){
      that.setData({
        isEnd1: nextPage,
        p1: p,
        listData1: listData
      })
    }else if(nowId == 2){
      that.setData({
        isEnd2: nextPage,
        p2: p,
        listData2: listData
      })
    }else if(nowId == 3){
      that.setData({
        isEnd3: nextPage,
        p3: p,
        listData3: listData
      })
    }
  },
  /*切换*/
  switchTab: function (event) {
    var that = this
    var id = parseInt(mylog.getDataSet(event, 'id'))
    var nowId = this.data.nowId
    if (id == nowId) {
      return false
    }
    //展示数据
    var listData = this.data["listData" + id]
    if (id == 1) {
      if (listData.length > 0) {
        that.setData({
          nowId: id,
          listData1:listData,
          activeHide: false,
          chipHide: true,
          luckyHide: true
        })
        return false
      }else{
        this.setData({
          nowId: id,
          activeHide: false,
          chipHide: true,
          luckyHide: true
        })
      }
    } else if (id == 2) {
      if (listData.length > 0) {
        that.setData({
          nowId: id,
          listData2:listData,
          activeHide: true,
          chipHide: false,
          luckyHide: true
        })
        return false
      }else{
        this.setData({
          nowId: id,
          activeHide: true,
          chipHide: false,
          luckyHide: true
        })
      }
    } else if(id == 3){
      if (listData.length > 0) {
        that.setData({
          nowId: id,
          listData3:listData,
          activeHide: true,
          chipHide: true,
          luckyHide: false
        })
        return false
      }else{
        this.setData({
          nowId: id,
          activeHide: true,
          chipHide: true,
          luckyHide: false
        })
      }
    }
    //没有数据-加载数据
    this._loadData()
  }
})