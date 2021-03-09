var app = getApp();
Component({
    data: {
        selected: 0,
        isIphoneX: false,
        color: "#232323",
        selectedColor: "#232323",
        list: [{
                "pagePath": "/pages/index/index",
                "text": "首页",
                "iconPath": "/img/nav-1.png",
                "selectedIconPath": "/img/nav-1-hover.png",
                "selectedColor": "#232323"
            },
            {
                "pagePath": "/pages/trading/trading",
                "text": "交易",
                "iconPath": "/img/nav-2.png",
                "selectedIconPath": "/img/nav-2-hover.png",
                "selectedColor": "#232323"
            },
            {
                "pagePath": "/pages/box/box",
                "text": "",
                "iconPath": "/img/nav-5.png",
                "selectedIconPath": "/img/nav-5.png",
                "selectedColor": "#232323"
            },
            {
                "pagePath": "/pages/shopping/shopping",
                "text": "发货",
                "iconPath": "/img/nav-3.png",
                "selectedIconPath": "/img/nav-3-hover.png",
                "selectedColor": "#232323"
            },
            {
                "pagePath": "/pages/me/me",
                "text": "我的",
                "iconPath": "/img/nav-4.png",
                "selectedIconPath": "/img/nav-4-hover.png",
                "selectedColor": "#232323"
            }
        ]
    },
    attached() {},
    ready: function() {
        let isPhoneX = app.globalData.isIphoneX;
        if (isPhoneX) {
            this.setData({
                isIphoneX: true,
            })
        }

    },
    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset
            const url = data.path
            wx.switchTab({ url })
            this.setData({
                selected: data.index
            })
        },
        _authCheckWin() {
            //弹窗
            wx.showModal({
                title: '提示',
                content: '您还未登录，是否前往登录？',
                cancelText: '暂不登录',
                cancelColor: '#9F9F9F',
                confirmText: '立即登录',
                confirmColor: '#ED7392',
                success(res) {
                    if (res.confirm) {
                        //跳转到授权页面
                        wx.navigateTo({
                            url: '../logauth/logauth'
                        })
                    } else if (res.cancel) {

                    }
                }
            })
        }
    }
})