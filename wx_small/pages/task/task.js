// pages/task/task.js
import { Task } from 'task-model.js'
var task = new Task()
var WxParse = require('../../assets/wxParse/wxParse/wxParse.js')
var timeGuide
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        wClicked: false,
        guideHide: true,
        percent: 'width: 0%',
        sharetitle: '',
        shareimg: '',
        encode: '',
        back_url: '',
        hideTask: true,
        WinImg: task.WinImg,
        imgurl1: task.ImgUrl1,
        taskBar: [
            { id: 1, name: '每日任务' },
            { id: 2, name: '成长任务' },
        ],
        nowId: 1,
        hideDay: false,
        hideGrow: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //新手引导
        this._newGuide()
    },
    /*页面展示加载数据*/
    onShow: function() {
        this._loadData()
        this._loadDaily()
        this._loadGrow()
    },

    /*切换任务*/
    _switchBar: function(event) {
        var id = task.getDataSet(event, 'id')
        var nowId = this.data.nowId
        if (id == nowId) {
            return false
        } else {
            if (id == 1) {
                this.setData({
                    nowId: 1,
                    hideDay: false,
                    hideGrow: true,
                })
            } else if (id == 2) {
                this.setData({
                    nowId: 2,
                    hideDay: true,
                    hideGrow: false,
                })
            }
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},
    /*加载数据*/
    _loadData: function() {
        var that = this
            //查询分享图和对应标题
        var type = 7 //首页
        task.getShareConfig(type, (data) => {
            if (data.err == 0) {
                var back_url = encodeURIComponent('/pages/index/index')
                that.setData({
                    sharetitle: data.data.title,
                    shareimg: data.data.imgurl,
                    encode: data.data.encode,
                    back_url: back_url,
                })
            }
        })
    },

    /*每日任务列表*/
    _loadDaily: function() {
        var that = this
        task.getAct((data) => {
            if (data.err == 0) {
                var style = 'width:' + data.data.alog.percent
                that.setData({
                    alog: data.data.alog,
                    percent: style,
                    box: data.data.box,
                    taskData: data.data.task,
                })
            }
        })
    },

    /*成长任务列表*/
    _loadGrow: function() {
        var that = this
        task.getGrowList((data) => {
            if (data.err == 0) {
                that.setData({
                    growData: data.data.grow,
                })
            }
        })
    },

    /*去完成*/
    goComplete: function(event) {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            task._authCheckWin()
            return false
        }
        var tasktype = task.getDataSet(event, 'type')
        if (tasktype == 0) {
            wx.navigateTo({
                url: '../signin/signin?from=1',
            })
        } else if (tasktype == 1) {
            //天天收藏-跳转到首页
            wx.switchTab({
                url: '/pages/index/index',
            })
        } else if (tasktype == 2) {
            //剁手不停-跳首页
            wx.switchTab({
                url: '/pages/index/index',
            })
        } else if (tasktype == 3) {
            //天天投喂-无疆盒子页面
            wx.switchTab({
                url: '/pages/box/box',
            })
        } else if (tasktype == 4) {
            //好友砍价-跳转到砍价商品页面
            wx.navigateTo({
                url: '../bargainlist/bargainlist',
            })
        } else if (tasktype == 5) {
            //跳转到新品商品页面
            wx.navigateTo({
                url: '../new/new?fromid=2',
            })
        }
    },

    /*成长任务跳转*/
    goGrowComplete: function(event) {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            task._authCheckWin()
            return false
        }

        var tasktype = task.getDataSet(event, 'type')
        if (tasktype == 0) {
            wx.navigateTo({
                url: '../bindphone/bindphone',
            })
        } else if (tasktype == 9) {
            wx.navigateTo({
                url: '../address/address',
            })
        }
    },

    /*每日任务领取奖励*/
    goGet: function(event) {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            task._authCheckWin()
            return false
        }
        this._disableButton()
        var that = this
        var id = task.getDataSet(event, 'id')
        task.getAward(id, (data) => {
            if (data.err == 0) {
                that._dailyDataReset(id)
                    //重新获取宝箱数据
                that._reloadBoxData()
                    //奖励领取成功
                wx.showToast({
                    title: '奖励领取成功',
                    icon: 'success',
                    duration: 2000,
                })
            }
        })
    },

    /*领取成长任务奖励*/
    goGetGrow: function(event) {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            task._authCheckWin()
            return false
        }
        this._disableButton()
        var that = this
        var id = task.getDataSet(event, 'id')
        task.getGrowAward(id, (data) => {
            if (data.err == 0) {
                //领取成功 //重置数据
                that._resetGrow(id)
                    //奖励领取成功
                wx.showToast({
                    title: '奖励领取成功',
                    icon: 'success',
                    duration: 2000,
                })
            }
        })
    },

    /*重置成长任务数据*/
    _resetGrow: function(id) {
        var growData = this.data.growData
        for (let i = 0; i < growData.length; i++) {
            if (growData[i]['id'] == id) {
                growData[i]['num'] = growData[i]['value'] //改变数值
                growData[i]['status'] = 2 //改变状态
            }
        }
        this.setData({
            growData: growData,
        })
    },

    //自定义分享内容
    onShareAppMessage: function(res) {
        var that = this
        if (res.from === 'button') {
            var str = this.data.strText
                //开盒数据
            var title = '我无疆盒子做任务获得了:（' + str + '），你也可以哦。'
            var img = this.data.shareimg
            return {
                title: title,
                path: '/pages/login/login?encode=' + that.data.encode + '&back_url=' + that.data.back_url,
                imageUrl: img,
            }
        } else {
            //from menu
            return {
                title: that.data.sharetitle,
                path: '/pages/login/login?encode=' + that.data.encode + '&back_url=' + that.data.back_url,
                imageUrl: that.data.shareimg,
            }
        }
    },

    /*重置每日任务数据*/
    _dailyDataReset: function(id) {
        var taskData = this.data.taskData
        for (let i = 0; i < taskData.length; i++) {
            if (taskData[i]['id'] == id) {
                taskData[i]['num'] = taskData[i]['value'] //改变数值
                taskData[i]['status'] = 2 //改变状态
            }
        }
        this.setData({
            taskData: taskData,
        })
    },

    /*领取宝箱奖励*/
    getBox: function(event) {
        if (!app.globalData.isSetting || !app.globalData.is_bind_iphone) {
            //登录弹窗
            task._authCheckWin()
            return false
        }
        var that = this
        this._disableButton()
        var type = task.getDataSet(event, 'id')
        task.getBox(type, (data) => {
            if (data.err == 0) {
                that._reloadBoxData()
                var str = ''
                if (data.data.boxaward[0]) {
                    str = str + data.data.boxaward[0]['name'] + 'x' + data.data.boxaward[0]['num'] + '\r\n'
                }
                if (data.data.boxaward[1]) {
                    str = str + data.data.boxaward[1]['name'] + 'x' + data.data.boxaward[1]['num'] + '\r\n'
                }
                if (data.data.boxaward[2]) {
                    str = str + data.data.boxaward[2]['name'] + 'x' + data.data.boxaward[2]['num'] + '\r\n'
                }
                if (data.data.boxaward[3]) {
                    str = str + data.data.boxaward[3]['tname'] + 'x' + data.data.boxaward[3]['num'] + '\r\n'
                }
                if (data.data.boxaward[4]) {
                    str = str + data.data.boxaward[4]['name'] + 'x' + data.data.boxaward[4]['num']
                }
                that.setData({
                    strText: str,
                })
                that._showShareWin(str)
            }
        })
    },
    /*活跃度宝箱弹出分享框*/
    _showShareWin: function(str) {
        var img = this.data.shareimg
        this.setData({
            hideTask: false,
            taskImg: img,
            taskText1: str,
        })
    },
    /*关闭分享弹窗*/
    closeTaskWin: function() {
        this.setData({
            hideTask: true,
        })
    },
    /*已领取*/
    noGo: function(event) {
        //弹窗提示
        wx.showToast({
            title: '此任务已领取喽~',
            icon: 'none',
            duration: 2000,
        })
    },
    /*按钮点击失效*/
    _disableButton: function() {
        var that = this
        that.setData({
                wClicked: true,
            })
            //按钮还原
        setTimeout(function() {
            that.setData({
                wClicked: false,
            })
        }, 1000)
    },
    /*刷新数据*/
    _reloadBoxData: function() {
        var that = this
        task.getBoxData((data) => {
            if (data.err == 0) {
                var style = 'width:' + data.data.alog.percent
                that.setData({
                    alog: data.data.alog,
                    percent: style,
                    box: data.data.box,
                })
            }
        })
    },
    /*无疆盒子宝新手引导*/
    _newGuide: function() {
        var that = this
        var res = task.BaseGetStorageSync('taskguide')
        if (res) {
            //已经点过引导-do nothing
        } else {
            //没有点过引导-播动画
            that._newGuideComic()
        }
    },
    /*引导动画*/
    _newGuideComic: function() {
        var animationHelp = wx.createAnimation({
            duration: 400,
            timingFunction: 'ease',
        })
        this.animation = animationHelp
        timeGuide = setInterval(
            function() {
                animationHelp.scale(1.2, 1.2).step()
                animationHelp.scale(1, 1).step()
                this.setData({
                    animationHelp: animationHelp.export(),
                })
            }.bind(this),
            900
        )
    },
    /*删除引导动画*/
    _delNewGuideComic: function() {
        clearInterval(timeGuide)
    },
    /*引导弹窗*/
    _newGuideWin: function() {
        var that = this
            //请求弹窗数据
        task.getGuideType((data) => {
            if (data.err == 0) {
                //请求成功-保存缓存-停止动画
                task.BaseSetStorageSync('taskguide', true)
                that._delNewGuideComic()
                var content = data.data.guide.content
                data.data.guide.content = WxParse.wxParse('content', 'html', content, that, 15)
                    //this.setData({
                    //  guideContent:data.data.guide.content
                    //})
                    //弹窗展示
                that._showGuideWin()
            }
        })
    },
    /*展示引导*/
    _showGuideWin: function() {
        this.setData({
            guideHide: false,
        })
    },
    /*引导不展示*/
    _hideGuideWin: function() {
        this.setData({
            guideHide: true,
        })
    },
})