//app.js
import { Token } from 'utils/token.js'
import { Config } from 'utils/config.js'
App({
    onLaunch: function(options) {
        this.globalData.log_scene = options.scene
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function(res) {
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function() {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function(res) {
                                if (res.confirm) {
                                    updateManager.applyUpdate()
                                }
                            },
                        })
                    })
                    updateManager.onUpdateFailed(function() {
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                        })
                    })
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
            })
        }
        this.createMusic()
            //检测是否授权
        this._checkSetting()
    },

    //检测授权-写入全局变量
    _checkSetting: function() {
        var that = this
        var token = new Token()
        token.isSetting((data) => {
            if (data == 1) {
                //已授权
                that.globalData.isSetting = true
            } else if (data == 2) {
                //未授权
                that.globalData.isSetting = false
            }
        })
    },

    //同步调用token
    rsncToken: function(func) {
        var token = new Token()
        token._rsncToken(func)
    },

    globalData: {
        //音乐
        musicGather: {
            backMusic: null, //背景音乐
            boxMusic: null, //按钮点击音乐
            chooseMusic: null, //选盒背景
            openMusic: null, //开盒背景
            shakeMusic: null, //摇盒背景
            awardMusic: null, //奖励背景
            btnMusic: null, //button背景

            loopType: true, //是否是循环音乐
            durationMusic: {
                btnMusic: 300,
            },
            nowMusic: null,
            createMusic: false, //是否已经创建了音乐
        },
        isIphoneX: false,
        isIphoneXI: false,
        is_bind_iphone: false,
        log_scene: 1000,
    },
    onShow: function() {
        let that = this
        wx.getSystemInfo({
            success: (res) => {
                // console.log('手机信息res'+res.model)
                let modelmes = res.model
                    //                          console.log(modelmes);
                    //                          console.log(modelmes.search('iPhone X'));
                if (modelmes.search('iPhone X') != -1) {
                    that.globalData.isIphoneX = true
                }
                if (modelmes.search('iPhone12') != -1) {
                    console.log('iphone12')
                    that.globalData.isIphoneXI = true
                }
            },
        })
    },
    /*创建音乐*/
    createMusic() {
        var gm = this.globalData.musicGather
            //console.log('创建音乐')
            //背景音乐
        gm.backMusic = wx.createInnerAudioContext('backMusic')
        gm.backMusic.src = Config.restCdnUrl + 'ht-app-wx/music/music_home02.mp3'
        gm.backMusic.loop = true
        gm.backMusic.onCanplay(function() {
                //console.log('backMusic 准备完成')
            })
            //无疆盒子宝
        gm.boxMusic = wx.createInnerAudioContext('boxMusic')
        gm.boxMusic.src = Config.restCdnUrl + 'ht-app-wx/music/music_open.mp3'
        gm.boxMusic.loop = true
        gm.boxMusic.onCanplay(function() {
                //console.log('boxMusic 准备完成')
            })
            //选盒子
        gm.chooseMusic = wx.createInnerAudioContext('chooseMusic')
        gm.chooseMusic.src = Config.restCdnUrl + 'ht-app-wx/music/music_choose.mp3'
        gm.chooseMusic.loop = true
        gm.chooseMusic.onCanplay(function() {
                //console.log('chooseMusic 准备完成')
            })
            //按钮音乐
        gm.btnMusic = wx.createInnerAudioContext('btnMusic')
        gm.btnMusic.src = Config.restCdnUrl + 'ht-app-wx/music/UImusic_btn.mp3'
            //摇盒子
        gm.shakeMusic = wx.createInnerAudioContext('shakeMusic')
        gm.shakeMusic.src = Config.restCdnUrl + 'ht-app-wx/music/UImusic_shake.mp3'
            //开盒宝箱
        gm.openMusic = wx.createInnerAudioContext('openMusic')
        gm.openMusic.src = Config.restCdnUrl + 'ht-app-wx/music/UImusic_open.mp3'
            //获得奖励
        gm.awardMusic = wx.createInnerAudioContext('awardMusic')
        gm.awardMusic.src = Config.restCdnUrl + 'ht-app-wx/music/UImusic_award.mp3'

        //设置已开启音乐
        gm.createMusic = true
    },

    /*重复调用播放音乐*/
    errorPlayAgain(typeMusic) {
        var gm = this.globalData.musicGather
        var that = this
        gm[typeMusic].play()
        gm[typeMusic].onError(function(res) {
            //错误-继续重复调用
            //console.log("再次播放"+typeMusic+"错误："+res.errMsg)
            //console.log("再次播放"+typeMusic+"音乐错误："+res.errCode)
            setTimeout(function() {
                that.errorPlayAgain(typeMusic)
            }, 1000)
        })
    },

    /*查询是否关闭音乐*/
    _checkCloseMusic() {
        try {
            var value = wx.getStorageSync('closemusic')
            if (value) {
                return value
            }
        } catch (e) {
            // Do something when catch error
        }
    },
    /*按钮关闭音乐-设置缓存*/
    _btnCloseMusic() {
        var that = this
        try {
            wx.setStorageSync('closemusic', true)
                //关闭背景音效
            that.pauseMusic('backMusic')
        } catch (e) {
            // Do something when catch error
        }
    },
    /*按钮打开音效*/
    _btnOpenMusic() {
        var that = this
        try {
            wx.setStorageSync('closemusic', false)
                //TODO:打开音效
            that.playMusic('backMusic')
        } catch (e) {
            // Do something when catch error
        }
    },

    /*播放音乐重写方法-（播放短音乐不暂停长音乐）*/
    playMusic(typeMusic) {
        var gm = this.globalData.musicGather
        var that = this
            //检查音乐是否关闭
        var close = that._checkCloseMusic()
        if (close) {
            //返回true-已经关闭-不播放音乐
            return false
        }
        //console.log('准备播放'+typeMusic)
        //判断当前音乐是否创建
        if (gm.createMusic == false) {
            //console.log("重新创建音乐")
            this.createMusic()
        }
        //获取当前播放音乐
        var nowMusic = gm.nowMusic
        var typeMusicLoop = gm[typeMusic].loop
        if (nowMusic != null) {
            //判断当前音乐是否和全局音乐相同
            if (typeMusicLoop == false) {
                gm.loopType = false
                    //不循环音效-当前音乐不暂停
                gm[typeMusic].play()
                gm[typeMusic].onError(function(res) {
                    //console.log(typeMusic+'错误'+res.errCode)
                    //that.errorPlayAgain(typeMusic)
                })
            } else {
                if (nowMusic != typeMusic) {
                    gm.loopType = true
                        //暂停全局音乐
                    this.pauseMusic(nowMusic)
                        //播放当前type音乐
                    gm[typeMusic].play()
                } else {
                    //直接再次播放
                    gm.loopType = true
                    gm[typeMusic].play()
                }
            }
        } else {
            //首次播放音乐
            //console.log('首次播放音乐')
            gm.loopType = true
            gm[typeMusic].play()
        }
        //设置全局data
        if (gm.loopType) {
            gm.nowMusic = typeMusic
            gm[typeMusic].onPlay(function(res) {
                //console.log(typeMusic+'开启了')
            })
            gm[typeMusic].onError(function(res) {
                //console.log(typeMusic+'错误'+res.errCode)
                that.errorPlayAgain(typeMusic)
            })
        }
    },
    /*暂停音乐*/
    pauseMusic(typeMusic) {
        var gm = this.globalData.musicGather
        gm[typeMusic].pause()
        gm[typeMusic].onPause(function(res) {
            //console.log(typeMusic+'关闭了')
        })
        gm[typeMusic].onError(function(res) {
            //console.log(typeMusic+'错误'+res.errCode)
        })
    },
})