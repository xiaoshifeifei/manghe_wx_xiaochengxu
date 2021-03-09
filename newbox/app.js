//app.js  
App({
    onLaunch: function() {
        wx.getSystemInfo({
            success: function(res) {
                console.log(res.model)
            }
        })
    },


    //第一种底部  
    editTabBar: function() {
        //使用getCurrentPages可以获取当前加载中所有的页面对象的一个数组，数组最后一个就是当前页面。

        var curPageArr = getCurrentPages(); //获取加载的页面
        var curPage = curPageArr[curPageArr.length - 1]; //获取当前页面的对象
        var pagePath = curPage.route; //当前页面url
        if (pagePath.indexOf('/') != 0) {
            pagePath = '/' + pagePath;
        }

        var tabBar = this.globalData.tabBar;
        for (var i = 0; i < tabBar.list.length; i++) {
            tabBar.list[i].active = false;
            if (tabBar.list[i].pagePath == pagePath) {
                tabBar.list[i].active = true; //根据页面地址设置当前页面状态    
            }
        }
        curPage.setData({
            tabBar: tabBar
        });
    },

    globalData: {
        tabBar: {
            "color": "#232323",
            "selectedColor": "#f00",
            "backgroundColor": "#FDFDFD",
            "borderStyle": "#FDFDFD",
            "list": [{
                    "pagePath": "/pages/index/index",
                    "text": "首页",
                    "iconPath": "/img/nav-1.png",
                    "selectedIconPath": "/img/nav-1-hover.png",
                    "clas": "menu-item1",
                    "selectedColor": "#232323",
                    active: false
                },
                {
                    "pagePath": "/pages/paradise/paradise",
                    "text": "乐园",
                    "iconPath": "/img/nav-2.png",
                    "selectedIconPath": "/img/nav-2-hover.png",
                    "selectedColor": "#232323",
                    "clas": "menu-item1",
                    active: false
                },
                {
                    "pagePath": "/pages/box/box",
                    "text": "11",
                    "iconPath": "/img/nav-5.png",
                    "selectedIconPath": "/img/nav-5.png",
                    "selectedColor": "#232323",
                    "clas": "menu-item2",
                    active: true
                },
                {
                    "pagePath": "/pages/shopping/shopping",
                    "text": "购物车",
                    "iconPath": "/img/nav-3.png",
                    "selectedIconPath": "/img/nav-3-hover.png",
                    "selectedColor": "#232323",
                    "clas": "menu-item1",
                    active: false
                },
                {
                    "pagePath": "/pages/me/me",
                    "text": "首页",
                    "iconPath": "/img/nav-4.png",
                    "selectedIconPath": "/img/nav-4-hover.png",
                    "selectedColor": "#232323",
                    "clas": "menu-item1",
                    active: false
                }
            ],
            "position": "bottom"
        }

    }
})