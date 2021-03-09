// pages/myset/myset.js
import {MySet} from "myset-model.js"
var myset = new MySet()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    tmpFile:"",
    wClicked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
  },

  _loadData:function(){
    var that = this
    myset.getInfo((data)=>{
      if(data.err == 0){
        let info = data.data.info
      if(info.share_img){
        that.setData({
          info:info,
          files:[{url:that.data.files.concat(info.share_img)}]
        })
      }else{
        that.setData({
          info:info
        })
      }
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
  
  // 表单提交
  formSubmit:function(e){
    var formData = e.detail.value
    //验证昵称是否正确
    if(!formData['nickname'] || !formData['nickname'].trim()){
      myset.toastMsg("请输入昵称")
      return false
    }
    //验证分享标题是否正确
    //if(!formData['share_txt'] || !formData['share_txt'].trim()){
    //  myset.toastMsg("请输入分享标题")
    //  return false
    //}
    formData['nickname'] = formData['nickname'].trim()
    formData['share_txt'] = formData['share_txt'].trim()
    this._doSet(formData)
  },

  /*上传图片&提交表单*/
  _doSet:function(formData){
    this._disableButton()
    //判断是否上传了图片
    var that = this
    if(this.data.tmpFile){
      //上传了图片
      //提交表单
      const upload_task = wx.uploadFile({
        url: myset.uploadUrl,
        filePath: that.data.tmpFile,
        name: 'img',
        formData:formData,
        header: {
          "Content-Type": "multipart/form-data",
          'token': wx.getStorageSync('token')
        },
        success: function (res) {
          var data = JSON.parse(res.data);
          that.data.tmpFile=""
          myset.toastMsg("设置成功喽~")
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },500)
        },
        fail: function (res) {
          myset.toastMsg("设置失败，请重试~")
        }
      });
    }else{
      //走老逻辑-只更新昵称&分享标题
      var params = {
        nickname:formData['nickname'],
        share_txt:formData['share_txt']
      }
      myset.goSetName(params,(data)=>{
        if(data.err == 0){
          myset.toastMsg("设置成功喽~")
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },500)
        }
      })
    }
  },

  //chooseImage: function (e) {
  //  var that = this;
  //  wx.chooseImage({
  //    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //    success: function (res) {
  //      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //      that.setData({
  //        files: that.data.files.concat(res.tempFilePaths)
  //      });
  //    }
  //  })
  //},
  //previewImage: function(e){
  //  wx.previewImage({
  //    current: e.currentTarget.id, // 当前显示图片的http链接
  //    urls: this.data.files // 需要预览的图片http链接列表
  //  })
  //},
  selectFile(files) {
    console.log('select files', files)
    // 返回false可以阻止某次文件上传
    //return false
  },
  uplaodFile(files) {
    var that = this
    console.log("uploadFile",files)
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
          that.data.tmpFile = files.tempFilePaths[0]
          resolve({urls: [files.tempFilePaths[0]]})
  })
  },
  uploadError(e) {

  },
  uploadSuccess(e) {

  },

  deleteImg:function(event){
    if(!this.data.tmpFile){
      //开始删除图片
      myset.removeImg('tg',(data)=>{
        if(data.err == 0){
          //myset.toastMsg(data.data.msg)
        }
      })
    }
    this.data.tmpFile=""
    return false
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
    },1000)
  },
})