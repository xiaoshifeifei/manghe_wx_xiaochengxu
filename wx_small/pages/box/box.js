//index.js
import { Box } from 'box-model.js'
var WxParse = require('../../assets/wxParse/wxParse/wxParse.js')
var app = getApp()
var box = new Box()
var timeGuide
var timeBlank
Page({
    data: {
        boxHide1: false, //无疆盒子宝隐藏
        boxHide2: true, //宝库隐藏
        hideBox: true, //开盒分享弹窗
        hideLucky: true, //开宝箱分享弹窗

        selectBoxId: 0,
        boxImg: '', //盒子图
        hideFly: true,
        needOpenBox: 0,
        comicOver: false, //动画结束才能点击
        imageArr: box.imgArr,
        luckyBoxImg: box.luckyBoxImg,
        PageBackImg: box.PageBackImg,
        NullImg: box.NullImg,
        NullBox: box.NullBox,
        WinImg: box.WinImg,
        noBoxHide: true,
        hideComeClick: true,
        guideHide: true,

        imgurl1: box.ImgUrl1,
        imgurl2: box.ImgUrl2,
        sharetitle: '',
        shareimg: '',
        encode: '',
        back_url: '',
    },

    /*初始化无疆盒子宝数据*/
    _reloadBox: function() {
        this.setData({
                selectBoxId: 0, //初始化已选择数据
            })
            //盒子飞走
        this.goneBox()
    },

    /*页面隐藏-初始化页面*/
    onHide: function() {
        this._reloadBox()
    },

    onShow: function() {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 2,
            })
        }
        app.playMusic('boxMusic')
            //加载无疆盒子宝数据
        this._loadData()
    },

    onLoad: function() {
        app.playMusic('boxMusic')
        this._getImgHeight()
            //"快来点我"动画
        this._delClickBlank()
        this._clickBlankComic()

        //宝库图片晃动
        this._addTreasury()
        this._delTreasury()
        this.treasuryShake()

        //无疆盒子宝新手引导
        this._newGuide()

        //查询分享图和对应标题
        var that = this
        var type = 6 //无疆盒子宝页
        box.getShareConfig(type, (data) => {
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

    /*屏幕晃动动画方法*/
    _leadShake: function() {
        var that = this
        for (let i = 0; i < 5; i++) {
            setTimeout(function() {
                that._indexShake()
            }, i * 100)
        }
    },
    /*屏幕晃动动画*/
    _indexShake: function() {
        var animationContain = wx.createAnimation({
            duration: 25,
            timingFunction: 'ease',
        })
        this.animation = animationContain
        var height = this.data.height
        animationContain.rotate(3).step()
        animationContain.rotate(0).step()
        animationContain.rotate(-3).step()
        animationContain.rotate(0).step()
        this.setData({
            animationContain: animationContain.export(),
        })
    },
    /*获取图片尺寸*/
    _getImgHeight: function() {
        var query = wx.createSelectorQuery()
            //选择id
        var that = this
        query
            .select('.mh_box_nr_01')
            .boundingClientRect(function(rect) {
                var height = (rect.height - rect.top * 0.55) * 0.5
                that.setData({
                    height: height,
                })
            })
            .exec()
    },

    /*获取屏幕宽高*/
    _getSystemInfo: function() {
        var that = this
        wx.getSystemInfo({
            success(res) {
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight,
                })
            },
        })
    },
    /*加载无疆盒子宝数据*/
    _loadData: function(callback) {
        var that = this
            //that._getSystemInfo()
        box.getBoxList((data) => {
            if (data.err == 0) {
                //宝箱文字展示
                var luckText
                var lucky_num = parseInt(data.data.luck_data.lucky_num)
                if (lucky_num < 10) {
                    var need_box = 10 - lucky_num
                    luckText = '再拆' + need_box + '个盒子，可以额外抽奖'
                } else {
                    luckText = '获得欧气宝箱，快来打开吧'
                }
                that.setData({
                        boxes: data.data.boxes,
                        percentval: data.data.luck_data.process,
                        percent: data.data.luck_data.percent,
                        needOpenBox: data.data.luck_data.need_open,
                        nullBoxes: data.data.null_box,
                        luckText: luckText,
                    })
                    //是否需要开欧气值奖励
                if (data.data.luck_data.need_open == 1) {
                    //展示宝箱
                    that._showMessage('恭喜获得欧气宝箱')
                    that._showLuckBox()
                }
                callback && callback()
                    //重置动画？
                this._delClickBlank()
                this._clickBlankComic()
            }
        })
    },

    /*展示宝箱图*/
    _showLuckBox: function() {
        //展示盒子
        var that = this
        that.setData({
            boxImg: that.data.luckyBoxImg,
            hideImg: false,
        })

        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
        })
        this.animation = animation
        var height = this.data.height
        animation.translate(0, height).opacity(1).step()
        this.setData({
            animationBox: animation.export(),
        })

        //宝箱摇动
        setTimeout(function() {
                that.shakeBox()
            }, 500)
            //宝箱摇动结束
        setTimeout(function() {
            that._shakeBoxNone()
        }, 1000)
    },
    /*选盒*/
    selectBox: function(event) {
        console.log(event)
        app.playMusic('btnMusic')
        var that = this
        if (that.data.needOpenBox == 1) {
            //需要开盒-提示
            wx.showToast({
                    title: '请先兑换欧气宝箱',
                    icon: 'none',
                    duration: 2000,
                })
                //摇宝箱
            that.shakeBox()
                //摇宝箱结束
            setTimeout(function() {
                that._shakeBoxNone()
            }, 500)
            return false
        }
        var id = box.getDataSet(event, 'id')
        var boxData = this.data.boxes
        var selectBox = []
        var selectBoxId
        for (var i = 0; i < boxData.length; i++) {
            if (id == boxData[i]['id']) {
                selectBox = boxData[i]
                selectBoxId = id
            }
        }
        if (this.data.selectBoxId == 0) {
            //第一次点盒子-盒子飞入动画
            this.showBox(selectBox)
        } else if (this.data.selectBoxId == id) {
            //还是原来的盒子
            //donothing
        } else {
            //不是原来的盒子-盒子先飞出动画-然后盒子回来动画
            this.goneBox()
            setTimeout(function() {
                that.showBox(selectBox)
            }, 500)
        }
        //设置selectBox
        this.setData({
            selectBoxId: selectBoxId,
            selectBox: selectBox,
        })
    },
    /*展示盒子*/
    showBox: function(selectBox) {
        //展示提示语
        this._showhideComeClick()
            //展示盒子
        var that = this
        that.setData({
            boxImg: selectBox['boximg'],
            hideImg: false,
        })

        //展示盒子动画
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
        })
        this.animation = animation
        var height = this.data.height
        animation.translate(0, height).opacity(1).step()
        this.setData({
            animationBox: animation.export(),
        })
    },
    /*展示盒子消失*/
    goneBox: function() {
        //点击提示语消失
        this._hideComeClick()
        var that = this
        var imgarr = that.data.imageArr
        var img = imgarr[0]
        this.setData({
            boxImgClass: '',
            //hideImg:true,
            hideOpen: true,
            openImg: img, //开盒动画初始值
        })

        //盒子消失动画
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
        })
        this.animation = animation
        animation.opacity(0).step()
        this.setData({
            animationBox: animation.export(),
        })
    },
    /*盒子晃动*/
    shakeBox: function() {
        this.setData({
            boxImgClass: 'mh_box_nr_aanimation',
        })
    },
    /*特殊宝箱晃动消失*/
    _shakeBoxNone: function() {
        this.setData({
            boxImgClass: '',
        })
    },
    /*确认是否开盒*/
    confirmOpen: function() {
        var that = this
        var id = this.data.selectBoxId
        if (!id) {
            return
        }
        wx.showModal({
            title: '提示',
            content: '确认拆盒？',
            success: function(res) {
                if (res.confirm) {
                    //确认-
                    //走开盒逻辑-
                    that.openBox()
                } else if (res.cancel) {
                    //取消
                }
            },
        })
    },
    /*开盒逻辑*/
    openBox: function() {
        //点击提示语消失
        this._hideComeClick()
        var id = this.data.selectBoxId
        var that = this
        box.openBoxData(id, (data) => {
            if (data.err == '0') {
                //无疆盒子宝开盒成功-设置data
                var surl = encodeURIComponent(data.data.open_box.surl)
                that.setData({
                    openBoxInfo: data.data.open_box,
                    flayAward: data.data.open_box.open_img,
                    surl: surl,
                    ourl: data.data.open_box.ourl,
                })
                that.getComic()
                    //展示弹窗
                that._showShareWin()
            }
        })
    },
    /*弹出分享信息*/
    _showShareWin: function() {
        var that = this
        var openBoxInfo = this.data.openBoxInfo
        var congText = '恭喜您拆出' + openBoxInfo.pname + openBoxInfo.scsi_name + '一个'
        var congText1 = '哇~拆出了盒子：' + openBoxInfo.pname + openBoxInfo.scsi_name
        setTimeout(function() {
            that.setData({
                hideBox: false, //展示弹窗
                congText: congText,
                congText1: congText1,
                congImg: openBoxInfo.open_img,
            })
        }, 4000)
    },

    /*再次购买*/
    getOther: function() {
        this.setData({
            hideBox: true,
        })
        wx.navigateTo({
            url: this.data.ourl,
        })
    },

    /*播开盒动画*/
    getComic: function() {
        var that = this
            //添加震动效果
        that._longShake()

        that.shakeBox()
        that.setData({
                comicOver: true, //关闭所有点击事件
            })
            //从第一张图开始播
        setTimeout(function() {
            that.setData({
                hideOpen: false,
            })
            that._setOpenImg(0)
        }, 500)
    },
    /*开盒图片展示*/
    _setOpenImg: function(count) {
        var that = this
        if (count < 18) {
            var imgarr = that.data.imageArr
            var img = imgarr[count]
            that.setData({
                openImg: img,
            })
            count++
            setTimeout(function() {
                //展示图片
                that._setOpenImg(count)
            }, 80)
        } else {
            //播飞入动画
            /*震动动画*/
            //that._leadShake()
            that._flyAwardBox()
        }
    },
    /*碎片飞入无疆盒子宝动画*/
    _flyAwardBox: function() {
        app.playMusic('awardMusic')
        var that = this
            //添加震动效果
        that._longShake()

        that.setData({
            hideFly: false,
            FlyClass: 'mh_me_aanimation mh_box_aanimation_02',
        })
        setTimeout(function() {
            that._flyAwardBoxNone()
        }, 2000)
    },
    /*重置飞入动画*/
    _flyAwardBoxNone: function() {
        var that = this
        that.setData({
            hideFly: true,
            FlyClass: 'mh_me_aanimation',
        })
        setTimeout(function() {
            that.goneBox()
            that.reLoadData()
        }, 500)
    },

    /*重新加载数据*/
    reLoadData: function() {
        var that = this
        that.setData({
                comicOver: false, //动画结束
            })
            //重新设置数据
        box.getBoxList((data) => {
            if (data.err == 0) {
                var luckText
                var lucky_num = parseInt(data.data.luck_data.lucky_num)
                if (lucky_num < 10) {
                    var need_box = 10 - lucky_num
                    luckText = '再拆' + need_box + '个盒子，可以额外抽奖'
                } else {
                    luckText = '获的欧气宝箱，快来打开吧'
                }
                that.setData({
                        boxes: data.data.boxes,
                        percentval: data.data.luck_data.process,
                        percent: data.data.luck_data.percent,
                        needOpenBox: data.data.luck_data.need_open,
                        nullBoxes: data.data.null_box,
                        luckText: luckText,
                    })
                    //是否需要开欧气值奖励
                if (data.data.luck_data.need_open == 1) {
                    //展示宝箱
                    that._showMessage('恭喜获得欧气宝箱')
                    that._showLuckBox()
                }
            }
        })
    },
    /*获取奖励数据*/
    getLucky: function() {
        app.playMusic('openMusic')
        var that = this
        box.getLuckyData((data) => {
            if (data.err == 0) {
                that.setData({
                        luckyInfo: data.data.lucky_img,
                    })
                    //奖励获取成功-展示奖励图片飞动画
                that.luckyAward(data.data.lucky_img)
            }
        })
    },
    /*奖励分享弹窗*/
    _showLuckyWin: function() {
        var lucky = this.data.luckyInfo
        var str = ''
            //循环准备数据
        for (var i = 0; i < lucky.length; i++) {
            if (lucky[i]['type'] == 0) {
                str = str + lucky[i]['name'] + 'x' + lucky[i]['num'] + '\r\n'
            }
            if (lucky[i]['type'] == 1) {
                str = str + lucky[i]['name'] + 'x' + lucky[i]['num'] + '\r\n'
            }
            if (lucky[i]['type'] == 2) {
                str = str + lucky[i]['name'] + 'x' + lucky[i]['num'] + '\r\n'
            }
            if (lucky[i]['type'] == 3) {
                str = str + lucky[i]['tname'] + 'x' + lucky[i]['num'] + '\r\n'
            }
            if (lucky[i]['type'] == 4) {
                str = str + lucky[i]['typeName'] + lucky[i]['pname'] + lucky[i]['scsi_name'] + 'x' + lucky[i]['num'] + '\r\n'
            }
            if (lucky[i]['type'] == 5) {
                str = str + lucky[i]['typeName'] + lucky[i]['pname'] + lucky[i]['scsi_name'] + 'x' + lucky[i]['num'] + '\r\n'
            }
        }
        var img = this.data.shareimg
        this.setData({
            hideLucky: false, //展示
            lucImg: img,
            lucText1: str,
        })
    },

    /*奖励数据循环飞入*/
    luckyAward: function(lucky_img) {
        app.playMusic('awardMusic')
        var that = this
        that.setData({
            comicOver: true, //动画开始-按钮失效
        })

        //遍历数据
        var img_length = lucky_img.length
        let is_end = 0
        for (let i = 0; i < img_length; i++) {
            //循环飞动画
            setTimeout(function() {
                if (i == img_length - 1) {
                    is_end = 1
                }
                that._flyAwardLucky(lucky_img[i], is_end)
            }, i * 2500)
        }
    },
    /*飞奖励动画*/
    _flyAwardLucky: function(img_data, is_end) {
        var that = this
            //添加震动效果
        that._longShake()
        var flayClass
        if (img_data.type == 0 || img_data.type == 1 || img_data.type == 2 || img_data.type == 3) {
            //碎片、奖券飞宝库
            flayClass = 'mh_me_aanimation mh_box_aanimation_01'
        } else {
            //盒子、实物飞无疆盒子宝
            flayClass = 'mh_me_aanimation mh_box_aanimation_02'
        }
        that.setData({
            boxImgClass: 'mh_box_nr_aanimation',
            flayAward: img_data.img,
            hideFly: false,
            FlyClass: flayClass,
        })
        setTimeout(function() {
            that._flyAwardLuckyNone(is_end)
        }, 2000)
    },
    /*重置奖励动画*/
    _flyAwardLuckyNone: function(is_end) {
        var that = this
        that.setData({
            hideFly: true,
            FlyClass: 'mh_me_aanimation',
            boxImgClass: '', //重置盒子摇晃
        })
        if (is_end == 1) {
            that.goneBox()
            that.reLoadData()
                //弹分享奖励窗
            that._showLuckyWin()
        }
    },
    /*添加动画震动反馈效果*/
    _longShake: function() {
        wx.vibrateLong()
    },
    /*提示消息*/
    _showMessage: function(message) {
        wx.showToast({
            title: message,
            icon: 'none',
            duration: 1000,
        })
    },
    /*无疆盒子宝新手引导*/
    _newGuide: function() {
        //console.log("无疆盒子宝动画引导开始")
        var that = this
        var res = box.BaseGetStorageSync('boxguide')
        if (res) {
            //已经点过引导-do nothing
        } else {
            //没有点过引导-播动画
            that._newGuideComic()
        }
    },
    /*引导弹窗*/
    _newGuideWin: function(event) {
        var type = box.getDataSet(event, 'id')
        var that = this
            //请求弹窗数据
        box.getGuideType(type, (data) => {
            if (data.err == 0) {
                //请求成功-保存缓存-停止动画
                if (type == 1) {
                    box.BaseSetStorageSync('boxguide', true)
                    that._delNewGuideComic(timeGuide)
                } else if (type == 4) {
                    box.BaseSetStorageSync('box1guide', true)
                    that._delNewGuideComic1(timeAwardGuide)
                }
                var content = data.data.guide.content
                data.data.guide.content = WxParse.wxParse('content', 'html', content, that, 15)
                    //弹窗展示
                that._showGuideWin()
            }
        })
    },
    /*无疆盒子宝引导动画*/
    _newGuideComic: function() {
        this._reloadGuideComic()
        var animationHelp = wx.createAnimation({
            duration: 400,
            timingFunction: 'ease',
        })
        this.animation = animationHelp
        timeGuide = setInterval(
            function() {
                animationHelp.scale(1.3, 1.3).step()
                animationHelp.scale(1, 1).step()
                this.setData({
                    animationHelp: animationHelp.export(),
                })
            }.bind(this),
            900
        )
    },
    /*无疆盒子宝动画初始化*/
    _reloadGuideComic: function() {
        var animationHelp = wx.createAnimation({
            duration: 10,
            timingFunction: 'ease',
        })
        this.animation = animationHelp
        animationHelp.scale(1, 1).step()
        this.setData({
            animationHelp: animationHelp.export(),
        })
    },
    /*删除引导动画*/
    _delNewGuideComic: function() {
        clearInterval(timeGuide)
    },
    /*删除宝库引导动画*/
    _delNewGuideComic1: function() {
        clearInterval(timeAwardGuide)
    },

    /*打开弹窗*/
    noBoxWin: function() {
        this.setData({
            noBoxHide: false,
        })
    },

    /*关闭弹窗*/
    closeNoBoxWin: function() {
        this.setData({
            noBoxHide: true,
        })
    },

    /*快来点我动画*/
    _clickBlankComic: function() {
        this._reloadClickBlank()
        var animationBlank = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
        })
        this.animation = animationBlank
        timeBlank = setInterval(
            function() {
                animationBlank.scale(1.1, 1.1).step()
                animationBlank.scale(1, 1).step()
                this.setData({
                    animationBlank: animationBlank.export(),
                })
            }.bind(this),
            1100
        )
    },
    /*快来点我动画初始化*/
    _reloadClickBlank: function() {
        var animationBlank = wx.createAnimation({
            duration: 10,
            timingFunction: 'ease',
        })
        this.animation = animationBlank
        animationBlank.scale(1, 1).step()
        this.setData({
            animationBlank: animationBlank.export(),
        })
    },
    /*删除点我动画*/
    _delClickBlank: function() {
        clearInterval(timeBlank)
    },

    /*宝库图片晃动动画*/
    treasuryShake: function() {
        setInterval(
            function() {
                //开始动画
                this._addTreasury()
                    //删除动画
                this._delTreasury()
            }.bind(this),
            3000
        )
    },

    /*宝库图片动画*/
    _addTreasury: function() {
        this.setData({
            treasuryClass: 'mh_treasury_nr_aanimation',
        })
    },

    /*宝库删除晃动*/
    _delTreasury: function() {
        setTimeout(
            function() {
                this.setData({
                    treasuryClass: '',
                })
            }.bind(this),
            1000
        )
    },

    /*跳转到首页*/
    goHome: function() {
        var that = this
        box.recordLog((data) => {
            that.setData({})
        })
        wx.switchTab({
            url: '/pages/index/index',
        })
    },

    /*展示点击开盒提示语*/
    _showhideComeClick: function() {
        this.setData({
            hideComeClick: false,
        })
    },
    /*开盒提示语消失*/
    _hideComeClick: function() {
        this.setData({
            hideComeClick: true,
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
        }, 2000)
    },

    /*关闭分享弹窗*/
    closeShareWin: function(event) {
        var id = box.getDataSet(event, 'id')
        if (id == 1) {
            this.setData({
                hideBox: true,
            })
        } else if (id == 3) {
            this.setData({
                hideLucky: true,
            })
        }
    },

    /*跳转到宝库*/
    goTreasury: function() {
        wx.navigateTo({
            url: '../treasury/treasury',
        })
    },
    //自定义分享内容
    onShareAppMessage: function(res) {
        var that = this
        if (res.from === 'button') {
            //from button
            var id = res.target.dataset['id']
            var title
            var imageUrl
            if (id == 1) {
                var openBoxInfo = that.data.openBoxInfo
                    //开盒数据
                title = '我在无疆盒子拆出了盒子:（' + openBoxInfo.pname + openBoxInfo.scsi_name + '），你也来拆吧。'
                imageUrl = openBoxInfo.open_img
                return {
                    title: title,
                    path: '/pages/login/login?type=1&encode=' + that.data.encode + '&back_url=' + that.data.surl,
                    imageUrl: imageUrl,
                }
            } else if (id == 2) {
                //合成数据
                var conBoxInfo = that.data.conBoxInfo
                title = '我在无疆盒子合成了盒子:（' + conBoxInfo.pname + conBoxInfo.scsi_name + '），你也来试试吧。'
                imageUrl = conBoxInfo.img
                return {
                    title: title,
                    path: '/pages/login/login?encode=' + that.data.encode + '&back_url=' + that.data.back_url,
                    imageUrl: imageUrl,
                }
            } else if (id == 3) {
                //开宝箱数据
                var str = that.data.lucText1
                title = '我在无疆盒子开出了奖励:（' + str + '），你也来开吧。'
                imageUrl = that.data.shareimg
                return {
                    title: title,
                    path: '/pages/login/login?encode=' + that.data.encode + '&back_url=' + that.data.back_url,
                    imageUrl: imageUrl,
                }
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
})