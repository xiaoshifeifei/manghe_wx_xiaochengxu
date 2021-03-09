/**
 * Created by Bamboo&Pany on 2019/8/2.
 */
import { Config } from 'config.js'
var app = getApp()
class Music {
    constructor() {
        //"use strict";
        this.musicGather = {
                backMusic: null, //背景音乐
                btnMusic: null, //按钮点击音乐
                openMusic: null, //开盒背景
            }
            //音乐类型
        this.loopType = true
            //按钮等短音乐播放时长
        this.durationMusic = {
            btnMusic: 300,
        }
        this.createMusic()
    }

    /*统一设置音乐集合*/
    createMusic() {
        console.log(2222222222)
            //背景音乐
        this.musicGather.backMusic = wx.createInnerAudioContext('backMusic')
        this.musicGather.backMusic.src = Config.restCdnUrl + 'ht-app-wx/music/音乐_首页02.aac'
        this.musicGather.backMusic.loop = true
            //无疆盒子宝
        this.musicGather.boxMusic = wx.createInnerAudioContext('boxMusic')
        this.musicGather.boxMusic.src = Config.restCdnUrl + 'ht-app-wx/music/音乐_开盒子.aac'
        this.musicGather.boxMusic.loop = true
            //选盒子
        this.musicGather.chooseMusic = wx.createInnerAudioContext('chooseMusic')
        this.musicGather.chooseMusic.src = Config.restCdnUrl + 'ht-app-wx/music/音乐_选盒子.aac'
        this.musicGather.chooseMusic.loop = true
            //按钮音乐
        this.musicGather.btnMusic = wx.createInnerAudioContext('btnMusic')
        this.musicGather.btnMusic.src = Config.restCdnUrl + 'ht-app-wx/music/UI音效_按钮.aac'
            //摇盒子
        this.musicGather.shakeMusic = wx.createInnerAudioContext('shakeMusic')
        this.musicGather.shakeMusic.src = Config.restCdnUrl + 'ht-app-wx/music/UI音效_摇盒子.aac'
            //开盒宝箱
        this.musicGather.openMusic = wx.createInnerAudioContext('openMusic')
        this.musicGather.openMusic.src = Config.restCdnUrl + 'ht-app-wx/music/UI音效_开宝箱.aac'
            //获得奖励
        this.musicGather.awardMusic = wx.createInnerAudioContext('awardMusic')
        this.musicGather.awardMusic.src = Config.restCdnUrl + 'ht-app-wx/music/UI音效_获得物品.aac'
    }

    /*播放音乐*/
    playMusic(typeMusic) {
        //获取当前播放音乐
        var nowMusic = app.globalData.nowMusic
        console.log(nowMusic)
        console.log(typeMusic)
        if (nowMusic != null) {
            //判断当前音乐是否和全局音乐相同
            if (nowMusic != typeMusic) {
                //暂停全局音乐
                this.pauseMusic(nowMusic)
            }
        }
        //播放新音乐
        this.musicGather[typeMusic].play()
            //不是循环播放音乐
        if (this.musicGather[typeMusic].loop == false) {
            this.loopType = false
                //播放按钮音乐
            this.musicGather[typeMusic].play()
                //一段时间后继续播放背景音乐
            var time = this.durationMusic[typeMusic]
            setTimeout(
                function() {
                    this.musicGather[nowMusic].play()
                }.bind(this),
                time
            )
        } else {
            this.loopType = true
        }
        //设置全局data
        if (this.loopType) {
            this.musicGather[typeMusic].onPlay(function() {
                app.globalData.nowMusic = typeMusic
            })
        }
    }

    /*播放音乐重写方法-（播放短音乐不暂停长音乐）*/
    playMusic1(typeMusic) {
        //获取当前播放音乐
        var nowMusic = app.globalData.nowMusic
        var typeMusicLoop = this.musicGather[typeMusic].loop
        console.log(nowMusic)
        console.log(typeMusic)
        if (nowMusic != null) {
            //判断当前音乐是否和全局音乐相同
            if (typeMusicLoop == false) {
                this.loopType = false
                    //不循环音效-当前音乐不暂停
                this.musicGather[typeMusic].play()
            } else {
                console.log(111)
                if (nowMusic != typeMusic) {
                    this.loopType = true
                        //暂停全局音乐
                    this.pauseMusic(nowMusic)
                        //播放当前type音乐
                    this.musicGather[typeMusic].play()
                }
            }
        } else {
            //首次播放音乐
            this.loopType = true
            this.musicGather[typeMusic].play()
        }
        //设置全局data
        if (this.loopType) {
            console.log(11111)
            this.musicGather[typeMusic].onPlay(function() {
                app.globalData.nowMusic = typeMusic
            })
        }
    }

    /*暂停音乐*/
    pauseMusic(typeMusic) {
        this.musicGather[typeMusic].pause()
        this.musicGather[typeMusic].onPause(function() {
            console.log(typeMusic + '关闭了')
        })
        this.musicGather[typeMusic].onError(function() {
            console.log('error')
        })
    }

    /*关闭音乐-开启需要从头放*/
    closeMusic(typeMusic) {
        this.musicGather[typeMusic].stop()
    }
}
export { Music }