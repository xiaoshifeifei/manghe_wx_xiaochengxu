//index.js 
import { Index } from 'index-model.js';
var index = new Index(); //实例化 首页 对象
var app = getApp();
Page({
    data: {
        loadingHidden: true,
        showhome: false,
        imgUrls: [],
        indicatorDots: true,
        beforeColor: "white",
        afterColor: "coral",
        autoplay: true,
        circular: true,
        interval: 5000,
        duration: 1000,
        bargainHide: true,
        wClicked: false,
        PageBackImg: index.PageBackImg,
        PriceImg: index.PriceImg,
        sharetitle: '',
        shareimg: '',
        encode: '',
        back_url: '',
        swiperCurrent: '',
        c_style: 'display:none;',
        is_go: 0,
        link_type:0,
        link:'',
        auto_status: 0,
        ImgUrl: index.ImgUrl,
        tag_index: 0,
        type:0,
        tid:0,
        p:1,
        listData: [],
        scrollHeight: 0,
        show1:'display:block;',
        show2:'display:block;',
        show3:'display:block;',
        show4:'display:block;',
        hidden1:'display:none;',
        hidden2:'display:none;',
        hidden3:'display:none;',
        hidden4:'display:none;',
        hidden5:'display:block;',
        hidden6:'display:block;',
        hidden7:'display:block;',
        sort:0,
        way:0,
        send:0,
        style_way1:'mh_pop_screening_hover',
        style_way2:'',
        style_send1:'mh_pop_screening_hover',
        style_send2:'',
        screen_name:'不限条件',
        sort_name:'热度排序'
    },
    onShow: function () {
        if (typeof this.getTabBar === 'function' &&
                this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0
            })
        }
        app.playMusic('backMusic');
        var that = this;
        let systemInfo = wx.getSystemInfoSync()
	// px转换到rpx的比例
        let pxToRpxScale = 750 / systemInfo.windowWidth;
        // window的高度
        let ktxWindowHeight = systemInfo.windowHeight * pxToRpxScale             
        that.setData({
          scrollHeight: ktxWindowHeight
        });
        
    },
    toindex: function () {     //
        wx.navigateTo({
            url: '../index/index',
        })
    },
    toparadise: function () {     //
        wx.navigateTo({
            url: '../paradise/paradise',
        })
    },
    tobox: function () {     //
        wx.navigateTo({
            url: '../box/box',
        })
    },
    toshopping: function () {     //
        wx.navigateTo({
            url: '../shopping/shopping',
        })
    },
    tome: function () {     //
        wx.navigateTo({
            url: '../me/me',
        })
    },
    qxyd: function (event) {
        wx.navigateTo({
            url: '../details/details',
        })
    },
    goaddmoney: function (event) {

        wx.navigateTo({
            url: '../topup/topup',
        })
    },
    swiperChange: function (event) {
        this.setData({
            swiperCurrent: event.detail.current,
        })
    },

    tochoose: function (event) {
        app.playMusic('btnMusic')
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            index._authCheckWin()
            return false;
        }
        //console.log(event);
        var p_id = index.getDataSet(event, 'p_id');
        var s_id = index.getDataSet(event, 's_id');
        var sell_way = index.getDataSet(event, 'sell_way'); //0抽盒2普通商品
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
    totask: function (event) {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            index._authCheckWin()
            return false
        }
        wx.navigateTo({
            url: '../task/task',
        })
    },
    hotmore: function (event) {
//        console.log(event);
        wx.navigateTo({
            url: '../hot/hot',
        })
    },
    new_more: function (event) {
        var id = index.getDataSet(event, "id");
        wx.navigateTo({
            url: '../new/new?fromid=' + id
        })
    },
    choose_way:function(event){
        var way = index.getDataSet(event, "way");
        var p = this.data.p;
        var type = this.data.type;
        var tid = this.data.tid;
        var sort = this.data.sort;
        var send = this.data.send;
        if(way==0 && send==0){
            this.setData({
                screen_name:'不限条件'
            });
        }
        if(way==0 && send==1){
            this.setData({
                screen_name:'现货'
            });
        }
        if(way==0 && send==2){
            this.setData({
                screen_name:'预售'
            });
        }
        if(way==1 && send==0){
            this.setData({
                screen_name:'抽盒'
            });
        }
        if(way==1 && send==1){
            this.setData({
                screen_name:'抽盒(现货)'
            });
        }
        if(way==1 && send==2){
            this.setData({
                screen_name:'抽盒(预售)'
            });
        }
        
        if(way==2 && send==0){
            this.setData({
                screen_name:'商城'
            });
        }
        if(way==2 && send==1){
            this.setData({
                screen_name:'商城(现货)'
            });
        }
        if(way==2 && send==2){
            this.setData({
                screen_name:'商城(预售)'
            });
        }
        if(way==0){
            //不限条件
            this.setData({
                way:way,
                p:1,
                listData: []
            });
        }
        if(way==1){
            //抽盒机
            this.setData({
                way:way,
                p:1,
                listData: []
            });
        }
        if(way==2){
            //商城
            this.setData({
                way:way,
                p:1,
                listData: []
            });
        }

        if((type==0||type==1||type==2||type==3)&&tid==0){
            //固定栏目  
            this.get_fixed_product(type,1,sort,way,send);    
        }else{
            //首页标签栏目  
            this.get_product(tid,1,sort,way,send);
        }
        
    },
    choose_send:function(event){
        var send = index.getDataSet(event, "send");
        var p = this.data.p;
        var type = this.data.type;
        var tid = this.data.tid;
        var sort = this.data.sort;
        var way = this.data.way;
        if(way==0 && send==0){
            this.setData({
                screen_name:'不限条件'
            });
        }
        if(way==0 && send==1){
            this.setData({
                screen_name:'现货'
            });
        }
        if(way==0 && send==2){
            this.setData({
                screen_name:'预售'
            });
        }
        if(way==1 && send==0){
            this.setData({
                screen_name:'抽盒'
            });
        }
        if(way==1 && send==1){
            this.setData({
                screen_name:'抽盒(现货)'
            });
        }
        if(way==1 && send==2){
            this.setData({
                screen_name:'抽盒(预售)'
            });
        }
        
        if(way==2 && send==0){
            this.setData({
                screen_name:'商城'
            });
        }
        if(way==2 && send==1){
            this.setData({
                screen_name:'商城(现货)'
            });
        }
        if(way==2 && send==2){
            this.setData({
                screen_name:'商城(预售)'
            });
        }
        if(send==0){
            //不限条件
            this.setData({
                send:send,
                p:1,
                listData: []
            });
        }
        if(send==1){
            //现货
            this.setData({
                send:send,
                p:1,
                listData: []
            });
        }
        if(send==2){
            //预售
            this.setData({
                send:send,
                p:1,
                listData: []
            });
        }

        if((type==0||type==1||type==2||type==3)&&tid==0){
            //固定栏目  
            this.get_fixed_product(type,1,sort,way,send);    
        }else{
            //首页标签栏目  
            this.get_product(tid,1,sort,way,send);
        }
        
        
    },
    
    choose_sort:function(event){
        var sort = index.getDataSet(event, "sort")?index.getDataSet(event, "sort"):1;
        var type = this.data.type;
        var tid = this.data.tid;
        var way = this.data.way;
        var send = this.data.send;
        if(sort==1){
            //热度排序
            this.setData({
                sort:sort,
                p:1,
                listData: [],
                sort_name:'热度排序'
            });
        }
        if(sort==2){
            //销量排序
            this.setData({
                sort:sort,
                p:1,
                listData: [],
                sort_name:'销量排序'
            });
        }
        if(sort==3){
            //最新上架
            this.setData({
                listData: [],
                p:1,
                sort:sort,
                sort_name:'最新上架'
            });
        }
        if(sort==4){
            //价格从低到高
            this.setData({
                sort:sort,
                p:1,
                listData: [],
                sort_name:'价格从低到高'
            });
        }
        if(sort==5){
            //价格从高到低
            this.setData({
                sort:sort,
                p:1,
                listData: [],
                sort_name:'价格从高到低'
            });
        }
        if((type==0||type==1||type==2||type==3)&&tid==0){
            //固定栏目  
            this.get_fixed_product(type,1,sort,way,send);    
        }else{
            //首页标签栏目  
            this.get_product(tid,1,sort,way,send);
        }
        
    },
    
    cloose_sort:function(event){
        this.setData({
            hidden1:'display:none;',
        });
    },
    cloose_way:function(event){
        this.setData({
            hidden2:'display:none;',
        });
    },
    openscreen:function(event){
        var type1 = index.getDataSet(event, "type1"); 
        var type =this.data.type;
//        var sort = this.data.sort?this.data.sort:1;
//        var way = this.data.way?this.data.way:0;
//        var send = this.data.send?this.data.send:0;
        if(type1==1){
            //热度排序
            this.setData({
                hidden1:'display:block;',
                hidden2:'display:none;'
            });
            
        }
        if(type1==2){
            //条件筛选
            this.setData({
               
            });
            if(type==1){
                //抽盒机
                this.setData({
                    hidden1:'display:none;',
                    hidden2:'display:block;',
                    hidden5:'display:none;',
                    hidden6:'display:block;',
                    hidden7:'display:none;',
                }); 

            }else if(type==2){
                //商城
                this.setData({
                    hidden1:'display:none;',
                    hidden2:'display:block;',
                    hidden5:'display:none;',
                    hidden6:'display:none;',
                    hidden7:'display:block;',
                }); 
            }else{
                this.setData({
                    hidden1:'display:none;',
                    hidden2:'display:block;',
                    hidden5:'display:block;',
                    hidden6:'display:block;',
                    hidden7:'display:block;',
                });
            }          
            

        }
    },
    choose_fixedtag: function (event) {
        //固定栏目
        var type = index.getDataSet(event, "type");
        var tag_index = index.getDataSet(event, "index");
        if(type==0){
            //推荐
            this.setData({
                tag_index: tag_index,
                p:1,
                type:type,
                tid:0,
                listData: [],
                show1:'display:block;',
                show2:'display:block;',
                show3:'display:block;',
                show4:'display:block;',
                hidden1:'display:none;',
                hidden2:'display:none;',
                hidden3:'display:none;',
                hidden4:'display:none;',
                sort:0,
                way:0,
                send:0
            });
        }else if(type==1){
            //抽盒机
            this.setData({
                tag_index: tag_index,
                p:1,
                type:type,
                tid:0,
                listData: [],
                show1:'display:none;',
                show2:'display:none;',
                show3:'display:none;',
                show4:'display:none;',
                hidden3:'display:block;',
                hidden4:'display:block;',
                sort:1,
                way:1, //抽盒机
                send:0,
                screen_name:'抽盒机',
                sort_name:'热度排序'
            });
        }else if(type==2){
            //商城
            this.setData({
                tag_index: tag_index,
                p:1,
                type:type,
                tid:0,
                listData: [],
                show1:'display:none;',
                show2:'display:none;',
                show3:'display:none;',
                show4:'display:none;',
                hidden3:'display:block;',
                hidden4:'display:block;',
                sort:1,
                way:2,//商城
                send:0,
                screen_name:'商城',
                sort_name:'热度排序'
            });

        }else{
            //新品
            this.setData({
                tag_index: tag_index,
                p:1,
                type:type,
                tid:0,
                listData: [],
                show1:'display:none;',
                show2:'display:none;',
                show3:'display:none;',
                show4:'display:none;',
                hidden3:'display:block;',
                hidden4:'display:block;',
                sort:3,
                way:0,
                send:0,
                screen_name:'不限条件',
                sort_name:'最新上架'
            });
        }
        
        var sort = this.data.sort;
        this.get_fixed_product(type,1,sort,0,0);
    },
    


    choose_tag: function (event) {       
        var tid = index.getDataSet(event, "tid"); //标签id
        var tag_index = index.getDataSet(event, "index");

        if(tid){
            this.setData({
                tag_index: tag_index,
                p:1,
                tid:tid,
                listData: [],
                show1:'display:none;',
                show2:'display:none;',
                show3:'display:none;',
                show4:'display:none;',
                hidden3:'display:block;',
                hidden4:'display:block;',
                sort:1,
                way:0,
                send:0,
                screen_name:'不限条件',
                sort_name:'热度排序'
            });
        }
        var sort = this.data.sort;
        this.get_product(tid,1,sort,0,0);
    },
    
    more_product: function (event) {
        var pmc_id = index.getDataSet(event, "pmc_id");
        var pmc_name = index.getDataSet(event, "pmc_name");
        var url = index.getDataSet(event, "url");
        wx.navigateTo({
            url: url + '&pmc_id=' + pmc_id + '&pmc_name=' + pmc_name
        })
    },
    toproductdetail: function (event) {
        app.playMusic('btnMusic')
        var p_id = index.getDataSet(event, "p_id");
        var s_id = index.getDataSet(event, "s_id");
        var whr = index.getDataSet(event, "whr");//来源于(jf积分盲盒/dp店铺盲盒)
        wx.navigateTo({
            url: '../details/details?p_id=' + p_id + '&s_id=' + s_id + '&whr=' + whr
        })
    },

    tomaterialdetail: function (event) {
        var p_id = index.getDataSet(event, "p_id");
        var s_id = index.getDataSet(event, "s_id");
        var whr = index.getDataSet(event, "whr");//来源于(dp_mat店铺实物/art_mat艺术家实物)
        wx.navigateTo({
            url: '../matterdetails/matterdetails?p_id=' + p_id + '&s_id=' + s_id + '&whr=' + whr
        })
    },

    tochoosebigbox: function (event) {
        //端一盒
        var p_id = index.getDataSet(event, "p_id");
        var s_id = index.getDataSet(event, "s_id");
        wx.navigateTo({
            url: '../bigbox/bigbox?p_id=' + p_id + '&s_id=' + s_id
        })
    },
    //关闭活动宣传弹框
    cloose_coupon: function (event) {
        this.setData({
            c_style: 'display:none;'
        });
    },
    cloose_coupon1: function (event) {
        this.setData({
            auto_status: 0
        });
    },
    gotopic: function (event) {
        this.setData({
            c_style: 'display:none;'
        });
        if (this.data.is_go == 0) {
            if(this.data.link_type==0){
                wx.navigateTo({
                    url: this.data.link
                })
            }else{
                wx.switchTab({
                    url: this.data.link
                })
            }
            
        }

        if (this.data.is_go == 2) {
            //跳直播间
            wx.navigateTo({
                url: this.data.link
            })
        }

    },

    onLoad: function () {
        this._loadData();
        app.playMusic('backMusic');
    },

    /*加载所有数据*/
    _loadData: function () {
        var that = this;
        //是否要显示专题宣传图
        index.getTopic((data) => {
            if (data.err == 0) {
                if (data.data.status == 1) {
                    that.setData({
                        topic_img: data.data.image,
                        img_size: data.data.img_size,
                        t_id: data.data.t_id,
                        c_style: 'display:block;',
                        is_go: data.data.is_go,
                        link_type: data.data.link_type,
                        link: data.data.link,
                    })
                }
                if (data.data.status == 0) {
                    that.setData({
                        img_size: data.data.img_size,
                    })
                }
            }
        })

        //获取首页轮播、图标、广告位展示
//        index.getHomeData((data) => {
//            if (data.err == 0) {
//                that.setData({
//                    homedata: data.data,
//                    showhome: true,
//                    auto_status: data.data.auto_goods.auto_status,
//                    auto_content: data.data.auto_goods.auto_content,
//                    imgurl2: index.ImgUrl2,
//                    imgurl3: index.ImgUrl3,
//                    tags: data.data.tags
//                });
//            }
//        })
        //获取首页信息,默认获取推荐商品
        this.get_fixed_product(0,1,0,0,0);
        
        //查询分享图和对应标题
        var type = 1;//首页
        index.getShareConfig(type, (data) => {
            if (data.err == 0) {
                var back_url = encodeURIComponent('/pages/index/index');
                that.setData({
                    sharetitle: data.data.title,
                    shareimg: data.data.imgurl,
                    encode: data.data.encode,
                    back_url: back_url
                })
            }
        })

    },
    //获取固定栏目
    get_fixed_product:function(type,p,sort,way,send){
        var that = this;
        index.getFixedProductList(type,p,sort,way,send,(data) => {
            if (data.err == 0) {
                var nowData = that.data.listData.concat(data.data.list)
                var prosty = null
                if(parseInt(nowData.length)%2 == 1){
                  prosty = parseInt(nowData.length) - 1
                }
                if(type==0){
                    that.setData({
                        homedata: data.data,
                        showhome: true,
                        auto_status: data.data.auto_goods.auto_status,
                        auto_content: data.data.auto_goods.auto_content,
                        imgurl2: index.ImgUrl2,
                        imgurl3: index.ImgUrl3,
                        tags: data.data.tags,
                        fixed_tags:data.data.fixed_tags
                    });
                }
                //设置数据
                that.setData({
                  p: p + 1,
                  type:type,
                  listData: nowData,
                  isEnd: data.data.nextPage,
                  prosty:prosty
                })
            }
        })
    },
    
    //获取标签栏目
    get_product:function(tid,p,sort,way,send){
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
    * 页面上拉加载
    */
    onReachBottom: function () {
      //判断是否有下一页
      var is_end = this.data.isEnd;
      if(is_end == 0){
        //没有下一页
        return false
      }
      //加载数据
      var type = this.data.type;
      var tid = this.data.tid;
      var p =this.data.p;
      var sort = this.data.sort;
      var way = this.data.way;
      var send = this.data.send;

      if((type==0||type==1||type==2||type==3) && tid==0){
        //固定栏目  
        this.get_fixed_product(type,p,sort,way,send);    
      }else{
        //首页标签栏目  
        this.get_product(tid,p,sort,way,send);
      }
      
    },

    /*跳转到商品详情*/
    onProductsItemTap: function (event) {
        var id = index.getDataSet(event, 'id');
        wx.navigateTo({
            url: '../product/product?id=' + id
        })
    },

    /*跳转到主题列表*/
    onThemesItemTap: function (event) {
        var id = index.getDataSet(event, 'id');
        var name = index.getDataSet(event, 'name');
        wx.navigateTo({
            url: '../theme/theme?id=' + id + '&name=' + name
        })
    },

    //下拉刷新
    onPullDownRefresh: function () {
        var that = this;
        wx.showNavigationBarLoading() //在标题栏中显示加载

        var that = this;
        var p =1;
        var type =this.data.type;
        var tid = this.data.tid;
        var sort =this.data.sort;
        var way =this.data.way;
        var send =this.data.send;
        if((type==0||type==1||type==2||type==3) && tid==0){
            console.log(tid);
            //固定栏目             
            index.getFixedProductList(type,1,sort,way,send,(data) => {
                if (data.err == 0) {               
                    if(type==0){
                        //推荐页
                        that.setData({
                            homedata: data.data,
                            showhome: true,
                            auto_status: data.data.auto_goods.auto_status,
                            auto_content: data.data.auto_goods.auto_content,
                            imgurl2: index.ImgUrl2,
                            imgurl3: index.ImgUrl3,
                        });
                    }
                    
                    that.setData({
                        listData:[]
                    })
                    var nowData = that.data.listData.concat(data.data.list)
                    var prosty = null
                    if(parseInt(nowData.length)%2 == 1){
                      prosty = parseInt(nowData.length) - 1
                    }
                                   
                    //设置数据
                    that.setData({
                      p: p + 1,
                      type:type,
                      tid:tid,
                      listData: nowData,
                      isEnd: data.data.nextPage,
                      prosty:prosty
                    })
                    // complete
                    wx.hideNavigationBarLoading() //完成停止加载
    
                    wx.stopPullDownRefresh() //停止下拉刷新
                    wx.showToast({
                        title: '刷新成功',
                        icon: 'none',
                        duration: 1000
                    })
                }
            })   
        }else{
            //首页标签栏目  
            index.getProductList(tid,1,sort,way,send,(data) => {
                if (data.err == 0) {               
                    // if(type==0){
                    //     //推荐页
                    //     that.setData({
                    //         homedata: data.data,
                    //         showhome: true,
                    //         auto_status: data.data.auto_goods.auto_status,
                    //         auto_content: data.data.auto_goods.auto_content,
                    //         imgurl2: index.ImgUrl2,
                    //         imgurl3: index.ImgUrl3,
                    //     });
                    // }
                    
                    that.setData({
                        listData:[]
                    })
                    var nowData = that.data.listData.concat(data.data.list)
                    var prosty = null
                    if(parseInt(nowData.length)%2 == 1){
                      prosty = parseInt(nowData.length) - 1
                    }
                                   
                    //设置数据
                    that.setData({
                      p: p + 1,
                      type:type,
                      tid:tid,
                      listData: nowData,
                      isEnd: data.data.nextPage,
                      prosty:prosty
                    })
                    // complete
                    wx.hideNavigationBarLoading() //完成停止加载
    
                    wx.stopPullDownRefresh() //停止下拉刷新
                    wx.showToast({
                        title: '刷新成功',
                        icon: 'none',
                        duration: 1000
                    })
                }
            })    
        }
        

    },

    //5个icon可跳转的页面
    gowhere: function (event) {
        var url = index.getDataSet(event, 'url');
        var is_tips = index.getDataSet(event, 'is_tips');
        var i = index.getDataSet(event, 'index');
        var hpc_id = index.getDataSet(event, 'hpc_id');
        var jump_type = index.getDataSet(event, 'jump_type');
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            index._authCheckWin()
            return false
        }
        if (is_tips == 1) {
            index.clickRedDot(hpc_id, (data) => {
                this.data.homedata.icon_arr[i].is_tips = 0, //点过了，则不显示红点
                        this.setData({
                            homedata: this.data.homedata
                        });

                if (jump_type == 1) {
                    //跳菜单
                    wx.switchTab({
                        url: url
                    })
                } else {
                    //跳内页
                    wx.navigateTo({
                        url: url
                    })
                }

            })
        } else {
            // wx.navigateTo({
            //     url: url
            // })
            if (jump_type == 1) {
                //跳菜单
                wx.switchTab({
                    url: url
                })
            } else {
                //跳内页
                wx.navigateTo({
                    url: url
                })
            }

        }

    },
    //广告位跳转
    gowhere1: function (event) {
        var url = index.getDataSet(event, 'url');
        var jump_type = index.getDataSet(event, 'jump_type');

        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            index._authCheckWin()
            return false
        }

        if (jump_type == 1) {
            //跳菜单
            wx.switchTab({
                url: url
            })
        } else {
            //跳内页
            wx.navigateTo({
                url: url
            })
        }
    },

    //签到
    gosign: function () {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            index._authCheckWin()
            return false
        }
        wx.navigateTo({
            url: '../signin/signin'
        })
    },
    /*砍价商品详情*/
    toBargainDetail: function (event)
    {
        app.playMusic('btnMusic')
        var id = index.getDataSet(event, 'id')
        console.log(id)
        wx.navigateTo({
            url: '../bargaindetail/bargaindetail?id=' + id
        })
    },
    /*砍价商品列表*/
    bargainList: function () {
        wx.navigateTo({
            url: '../bargainlist/bargainlist'
        })
    },

    /*线下门店宣传列表*/
    shopList: function () {
        wx.navigateTo({
            url: '../promoter/promoter'
        })
    },

    /*去积分商城*/
    goTreasury: function () {
        wx.navigateTo({
            url: '../home2/home2'
        })
    },

    /*砍价弹窗展示*/
    shareWin: function (event) {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            index._authCheckWin()
            return false
        }
        this._disableButton()
        //砍价活动配置商品id
        var actid = this.data.homedata.bargain_product[0]['act_id']
        var id = index.getDataSet(event, 'id')
        index.getCutWin(actid, id, (data) => {
            if (data.err == 0) {
                this.setData({
                    shareData: data.data.share,
                    cutInfoData: data.data.info,
                    bargainHide: false
                })
            }
        })
    },
    /*砍价弹窗关闭*/
    closeWin: function () {
        this.setData({
            bargainHide: true
        })
    },
    /*同意自动发货协议,并设置默认发地址*/
    gosetaddress: function () {
        index.saveUserAgree((data) => {
            if (data.err == 0) {
                this.setData({
                    auto_status: 0
                })
                wx.navigateTo({
                    url: '../address1/address1?type=1'//去添加地址
                })
            } else {
                this.setData({
                    auto_status: 0
                })
            }
        })
    },

    //自定义分享内容
    onShareAppMessage: function (res) {
        var that = this
        if (res.from === 'button') {
            // 来自页面内转发按钮
            var id = res.target.dataset['id']
            //获取商品图片&商品名称
            var info = that._getProductItem(id)
            var title = "就差你这一刀了，快来帮我砍价抢" + info['info']['pname'] + "吧！"
            var imageUrl = info['info']['images']['pic1']
            var code = that.data.shareData.icode
            return {
                title: title,
                path: '/pages/bargainlog/bargainlog?sharecode=' + code, //分享标识
                imageUrl: imageUrl
            }
        } else {
            //from menu
//            console.log('/pages/login/login?encode='+that.data.encode+'&back_url='+that.data.back_url);
            return {
                title: that.data.sharetitle,
                path: '/pages/login/login?encode=' + that.data.encode + '&back_url=' + that.data.back_url,
                imageUrl: that.data.shareimg
            }
        }
    },
    _getProductItem: function (id) {
        var cutList = this.data.homedata.bargain_product
        for (let i = 0; i < cutList.length; i++) {
            if (cutList[i]['id'] == id) {
                return cutList[i]
            }
        }
    },
    goad: function (event) {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            index._authCheckWin()
            return false
        }
        var adurl = index.getDataSet(event, 'adurl');
        console.log(adurl);
        wx.navigateTo({
            url: adurl
        })
    },
    /*按钮点击失效*/
    _disableButton: function () {
        var that = this
        that.setData({
            wClicked: true
        })
        //按钮还原
        setTimeout(function () {
            that.setData({
                wClicked: false
            })
        }, 2000)
    },

    /*去搜索页面*/
    gosearch:function(){
        wx.navigateTo({
            url: '../search/search'//去搜索页
        }) 
    }
})

