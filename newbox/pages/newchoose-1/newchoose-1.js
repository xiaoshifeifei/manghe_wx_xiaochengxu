// pages/newchoose-1/newchoose-1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.animation1 = wx.createAnimation({
        transformOrigin: "center bottom",
        duration: 150,
        timingFunction: 'ease',
    })  
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

  },

  startG: function () {
    var that = this;
    if (that.data.status == true) {
      that.setData({
        status: false
      })
      if (that.data.postion) {
        var pos = that.data.postion;
      } else {
        var pos = 10;
      }
      wx.vibrateLong({})
      var max_rotate = 20;
      var t_y = -100 / 10 * pos;
      var t_x = 10;
      that.animation1
        .rotate(max_rotate)
        .translateY(t_y)
        .translateX(t_x)
        .step()
        .rotate(0)
        .translateY(t_y / 10 * 1)
        .translateX(0)
        .step()

        .rotate(max_rotate)
        .translateY(t_y / 10 * 9.5)
        .translateX(t_x)
        .step()
        .rotate(0)
        .translateY(t_y / 10 * 1.5)
        .translateX(0)
        .step()

        .rotate(max_rotate)
        .translateY(t_y/10*9)
        .translateX(t_x)
        .step()
        .rotate(0)
        .translateY(t_y / 10 * 2)
        .translateX(0)
        .step()

        .rotate(max_rotate)
        .translateY(t_y / 10 * 8.5)
        .translateX(t_x)
        .step()
        .rotate(0)
        .translateY(t_y / 10 * 2.5)
        .translateX(0)
        .step()

        .rotate(max_rotate)
        .translateY(t_y/10*8)
        .translateX(t_x)
        .step()
        .rotate(0)
        .translateY(t_y / 10 * 3)
        .translateX(0)
        .step()

        .rotate(max_rotate)
        .translateY(t_y / 10 * 7.5)
        .translateX(t_x)
        .step()
        .rotate(0)
        .translateY(t_y / 10 * 3.5)
        .translateX(0)
        .step()

        .rotate(max_rotate)
        .translateY(t_y/10*7)
        .translateX(t_x)
        .step()
        .rotate(0)
        .translateY(t_y / 10 * 4)
        .translateX(0)
        .step()

        .rotate(max_rotate)
        .translateY(t_y / 10 * 6.5)
        .translateX(t_x)
        .step()
        .rotate(0)
        .translateY(t_y / 10 * 4.5)
        .translateX(0)
        .step()
        
        .rotate(max_rotate)
        .translateY(t_y / 10 * 6)
        .translateX(t_x)
        .step()
        .rotate(0)
        .translateY(t_y / 10 * 5)
        .translateX(0)
        .step()


        .rotate(0)
        .translateY(0)
        .translateX(0)
        .step()
        
        
      that.setData({ animation: that.animation1.export() });

      setTimeout(function () {
        that.setData({
          status: true
        })
      }, 3000);
    }
  }


})

