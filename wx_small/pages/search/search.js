// pages/search/search-model.js
import {Search} from "search-model.js"
var search = new Search()
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      search_content:'',
      is_show:false,
      is_show1:true,
      is_show2:true,
      is_show3:true,
      p:1,
      listData: [],
      content:'',
      list1:'',
      list2:''   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /*获取搜索页默认显示*/
  getSearchList:function(id){
    var that = this
    search.searchList((data)=>{
      if(data.err == 0){
        console.log(data.data);
        that.setData({
          list1:data.data.list1,
          list2:data.data.list2
        })
      }
      
    })
  },

  /*设置顶部title*/
  _setTitle:function(o){
    wx.setNavigationBarTitle({
      title: o
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
    this.getSearchList();  
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


  //搜索内容
  get_search:function(tid,p,sort,way,send){
    var that = this;
    index.getProductList(tid,p,sort,way,send,(data) => {
        if (data.err == 0) {
            var nowData = that.data.listData.concat(data.data.list)
            var prosty = null
            if(parseInt(nowData.length)%2 == 1){
              prosty = parseInt(nowData.length) - 1
            }
            // if(type==0){
            //     that.setData({
            //         homedata: data.data,
            //         showhome: true,
            //         auto_status: data.data.auto_goods.auto_status,
            //         auto_content: data.data.auto_goods.auto_content,
            //         imgurl2: index.ImgUrl2,
            //         imgurl3: index.ImgUrl3,
            //         tags: data.data.tags,
            //         fixed_tags:data.data.fixed_tags
            //     });
            // }
            //设置数据
            that.setData({
              p: p + 1,
              tid:tid,
              listData: nowData,
              isEnd: data.data.nextPage,
              prosty:prosty
            })
        }
    })
  },

  

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //判断是否有下一页
    var is_end = this.data.isEnd;
    if(is_end == 0){
      //没有下一页
      search.toastMsg("没有更多内容喽~");
      return false
    }
    this.getSearchData();

  },

  //获取搜索内容的公共方法
  getSearchData:function(){
    let that = this;
    let p =this.data.p;
    let search_content = this.data.search_content;
    search.searchContent(search_content,p,(data)=>{
      
      if(data.err == 0){
        let nowData = that.data.listData.concat(data.data.list);
        if(nowData.length>0){
          let prosty = null;
          if(parseInt(nowData.length)%2 == 1){
            prosty = parseInt(nowData.length) - 1
          }
          //设置数据
          that.setData({
            p: p + 1,
            listData: nowData,
            isEnd: data.data.nextPage,
            prosty:prosty,
            imgurl3: search.ImgUrl3,
            is_show:true,
            is_show1:false,
            is_show2:false,
            is_show3:true,
          })    
        }else{
          //没有搜索到结果
          that.setData({
            is_show:true,
            is_show1:false,
            is_show2:true,
            is_show3:false,
          })    
        }
        
      }else{
        //没有搜索到结果
        that.setData({
          is_show:true,
          is_show1:false,
          is_show2:true,
          is_show3:false,
        })        

      }
    })

  },  
   
    //搜索
    search:function(event){
      let search_content = search.getEventValue(event);
      if(search_content.length>20){
        wx.showToast({
          title: '搜索内容20字以内~',
          icon: 'none',
          duration: 1000
        })  
        return false;
      }
      if(search_content.length>0){
        this.setData({
          search_content:search_content,
          content:search_content,
          listData:[],
          p:1
        })
        this.getSearchData();
        
      }else{
          wx.showToast({
            title: '搜索内容不能为空~',
            icon: 'none',
            duration: 1000
          })
          this.setData({
            is_show:false,
            is_show1:false,
            is_show2:true,
            is_show3:false,
          })
      }     

    },

    

    //最近搜索
    near_search:function(event){
        let search_content = search.getDataSet(event, 'content');
        if(search_content.length>0){
          this.setData({
            search_content:search_content,
            content:search_content,
            listData:[],
            p:1
          })
          this.getSearchData();
          
        }else{
            wx.showToast({
              title: '搜索内容不能为空~',
              icon: 'none',
              duration: 1000
            })
            this.setData({
              is_show:false,
              is_show1:false,
              is_show2:true,
              is_show3:false,
            })
        }     
    },

    //热门搜索
    hot_search:function(event){
        let search_content = search.getDataSet(event, 'content');
        if(search_content.length>0){
          this.setData({
            search_content:search_content,
            content:search_content,
            listData:[],
            p:1
          })
          this.getSearchData();
          
        }else{
            wx.showToast({
              title: '搜索内容不能为空~',
              icon: 'none',
              duration: 1000
            })
            this.setData({
              is_show:false,
              is_show1:false,
              is_show2:true,
              is_show3:false,
            })
        }     
    },


    tochoose: function (event) {
      // app.playMusic('btnMusic')
      if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
          search._authCheckWin()
          return false;
      }
      //console.log(event);
      let p_id = search.getDataSet(event, 'p_id');
      let s_id = search.getDataSet(event, 's_id');
      let sell_way = search.getDataSet(event, 'sell_way'); //0抽盒2普通商品
      if (sell_way == 0) {
          //抽盒商品去选盒页
          wx.navigateTo({
              url: '../choose/choose?p_id=' + p_id + '&s_id=' + s_id
          })
      }
      if (sell_way == 2) {
          //普通商品商品去商品详情
          wx.navigateTo({
              url: '../matterdetails/matterdetails?p_id=' + p_id + '&s_id=' + s_id
          })
      }

    },

    clearcontent:function(){
      this.setData({
        is_show:false,
        is_show1:true,
        is_show2:true,
        is_show3:true,
        content:'',
        listData:[],
      })
      this.getSearchList();
    },

    delSearchLog:function(){
      let that = this;

      wx.showModal({
        content: '是否清空历史记录',
        success (res) {
          if (res.confirm) {
            search.delSearchLog((data)=>{
      
              if(data.err == 0){ 
                that.setData({
                  list1:[]
                })      
              }    
            })
          } else if (res.cancel) {
            
          }
        }
      })

    }


})