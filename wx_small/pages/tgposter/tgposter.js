// pages/tgposter/tgposter.js
import { TgPoster } from 'tgposter-model.js'
var tgposter = new TgPoster()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        hideBtn: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this._loadPoster()
    },

    /*获取海报*/
    _loadPoster: function() {
        var that = this
        this._loadBase()
            .then((res) => {
                wx.showLoading({
                    title: '海报生成中...',
                })
                this.data.baseInfo = res.data
                    //小程序码
                let ewm = res.data.code
                    //无疆盒子图
                let ht = res.data.base.img
                    //用户头像
                let head = res.data.invite.face_wx
                    //商品图
                let pro = res.data.pro
                    //下载小程序码
                var base = [ewm, ht, head]
                this.getImageAll(base)
                    .then((res) => {
                        that.data.baseImg = res
                            //下载商品图片
                        this.getImageAll(pro)
                            .then((res) => {
                                that.data.proImg = res
                                    //开始绘图
                                this._createImg()
                                    .then((res) => {
                                        //绘图完成-获取canvas路径
                                        this._savePath().then((res) => {
                                            wx.hideLoading()
                                        })
                                    })
                                    .catch((err) => {
                                        console.log('海报绘图报错err' + JSON.stringify(err))
                                        this._rePoster()
                                    })
                            })
                            .catch((err) => {
                                console.log('下载商品图片报错err' + JSON.stringify(err))
                                this._rePoster()
                            })
                    })
                    .catch((err) => {
                        console.log('下载基本图片报错err' + JSON.stringify(err))
                        this._rePoster()
                    })
            })
            .catch((err) => {
                console.log('调用接口报错err' + JSON.stringify(err))
                this._rePoster()
            })
    },

    /*海报生成失败-重试*/
    _rePoster: function() {
        wx.hideLoading()
        var that = this
        wx.showModal({
            title: '提示',
            content: '海报生成失败，点击重试',
            showCancel: false,
            success(res) {
                if (res.confirm) {
                    that._loadPoster()
                }
            },
        })
    },

    /*获取海报基本信息*/
    _loadBase: function() {
        return new Promise((resolve, reject) => {
            tgposter.getPoster((res) => {
                if (res.err == 0) {
                    resolve(res)
                } else {
                    reject(res)
                }
            })
        })
    },

    /*获取图片信息*/
    getImage: function(url) {
        return new Promise((resolve, reject) => {
            wx.getImageInfo({
                src: url,
                success: function(res) {
                    resolve(res)
                },
                fail: function(res) {
                    reject(res)
                },
            })
        })
    },

    /*promise同时下载多图*/
    getImageAll: function(image_src) {
        let that = this
        var all = []
        image_src.map(function(item) {
            all.push(that.getImage(item))
        })
        return Promise.all(all)
    },

    /*海报绘制方法*/
    _createImg: function() {
        //定义画布宽高
        var that = this
        var width = 750
        var height = 960
            //TODO：绘制方法
        let baseImg = this.data.baseImg
        let proImg = this.data.proImg
        let codeData = this.data.baseInfo
        let ctx = wx.createCanvasContext('canvas')

        //绘制背景颜色
        ctx.setFillStyle('#FFFFFF')
        ctx.fillRect(0, 0, width, height)

        //绘制小程序码
        ctx.save()
        ctx.beginPath()
        let ewm = baseImg[0].path
        let ewm_r = 110,
            ewm_width = 220,
            ewm_height = 220,
            ewm_y = 60
            //ctx.arc(width / 2, ewm_r+ewm_y, ewm_r, 0, 2 * Math.PI) //画出圆
            //ctx.strokeStyle = "#FFFFFF";
            //ctx.clip(); //裁剪上面的圆形
        ctx.drawImage(ewm, width / 2 - ewm_r, ewm_y, ewm_width, ewm_height) // 在刚刚裁剪的园上画图
        ctx.restore()

        //绘制用户头像
        ctx.save()
        ctx.beginPath()
        let head = baseImg[2].path
        let head_r = 50,
            head_width = 100,
            head_height = 100,
            head_y = 120
        ctx.arc(width / 2, head_r + head_y, head_r, 0, 2 * Math.PI) //画出圆
        ctx.strokeStyle = '#FFFFFF'
        ctx.clip() //裁剪上面的圆形
        ctx.drawImage(head, width / 2 - head_r, head_y, head_width, head_height) // 在刚刚裁剪的园上画图
        ctx.restore()

        ////绘制名字
        ctx.save()
        ctx.beginPath()
        ctx.setFontSize(34)
        ctx.setFillStyle('#000000')
        ctx.setTextAlign('center')
        let name = codeData.invite.name,
            name_y = ewm_y + ewm_height + 30 + 34
        ctx.fillText(name, width / 2, name_y)
        ctx.stroke()

        //绘制notice
        ctx.setFontSize(26)
        ctx.setFillStyle('#7F7F7F')
        ctx.setTextAlign('center')
        let notice = codeData.invite.notice,
            notice_margin = 120,
            no_y = name_y + 17 + 26
            //let offsetHeight = this.drawArticle(ctx, notice, width - notice_margin, 60, no_y)
        ctx.fillText(notice, width / 2, no_y)
        ctx.stroke()
        let offsetHeight = no_y

        //循环绘制商品图
        if (proImg.length > 0) {
            let pro_with = 210,
                pro_height = 210,
                pro_x = width - 4 * 30,
                pro_y = offsetHeight + 60
            for (let i = 0; i < proImg.length; i++) {
                let pro = proImg[i].path
                    //开始绘制图片
                ctx.drawImage(pro, (pro_x / 3) * i + (i + 1) * 30, pro_y, pro_with, pro_height)
            }
        }

        //绘制底部扫码进店
        let slogan1 = codeData.base.slogan1,
            s1_y = offsetHeight + 60 + 210 + 60 + 26
        ctx.setFontSize(26)
        ctx.setFillStyle('#7F7F7F')
        ctx.setTextAlign('center')
        ctx.fillText(slogan1, width / 2, s1_y)
        ctx.stroke()

        //绘制底部灰色背景颜色
        let back_g = s1_y + 60,
            back_h = height - back_g
        ctx.setFillStyle('#EEEEEE')
        ctx.fillRect(0, back_g, width, back_h)

        //绘制底部小程序图
        ctx.save()
        ctx.beginPath()
        let ht = baseImg[1].path,
            ht_y = back_g + 30,
            ht_width = 70,
            ht_height = 70
        ctx.drawImage(ht, 30, ht_y, ht_width, ht_width)
        ctx.restore()

        //绘制底部小程序名称
        let htName = codeData.base.name,
            htName_x = 30 + ht_width + 20,
            htName_y = ht_y + 26
        ctx.setFontSize(26)
        ctx.setFillStyle('#000000')
        ctx.fillText(htName, htName_x + 65, htName_y)
        ctx.stroke()

        //绘制底部小程序标语
        let slogan = codeData.base.slogan,
            s_y = htName_y + 26 + 20
        ctx.setFontSize(26)
        ctx.setFillStyle('#000000')
        ctx.fillText(slogan, htName_x + 120, s_y)
        ctx.stroke()

        return new Promise((resolve, reject) => {
            ctx.draw(false, (res) => {
                if (res.errMsg == 'drawCanvas:ok') {
                    resolve(res)
                } else {
                    reject(res)
                }
            })
        })
    },

    /*设置图片path*/
    _savePath: function() {
        var that = this
        return new Promise((resolve, reject) => {
            wx.canvasToTempFilePath({
                canvasId: 'canvas',
                success: function(res) {
                    that.setData({
                        imagePath: res.tempFilePath,
                        hideBtn: false,
                    })
                    resolve(res)
                },
                fail: function(res) {
                    reject(res)
                },
            })
        })
    },

    /*授权弹窗*/
    _authModel: function() {
        var that = this
        wx.showModal({
            title: '权限不足',
            content: '需要您授权小程序保存图片到相册的权限',
            success(res) {
                if (res.confirm) {
                    that._goSetting()
                } else if (res.cancel) {}
            },
        })
    },

    /*去授权*/
    _goSetting: function() {
        wx.openSetting({
            success(res) {},
        })
    },

    //保存
    save: function() {
        var that = this
        wx.canvasToTempFilePath({
            //canvas 生成图片 生成临时路径
            canvasId: 'canvas',
            success: function(res) {
                wx.saveImageToPhotosAlbum({
                    //下载图片
                    filePath: res.tempFilePath,
                    success: function(res) {
                        wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                        })
                    },
                    fail: function(res) {
                        if (res.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
                            //唤起授权弹窗
                            that._authModel()
                        }
                    },
                })
            },
        })
    },

    drawArticle(ctx, kl, width, x, y) {
        let chr = kl.split('') // 分割为字符串数组
        let temp = ''
        let row = []
        for (let a = 0; a < chr.length; a++) {
            if (ctx.measureText(temp).width < width) {
                temp += chr[a]
            } else {
                a--
                row.push(temp)
                temp = ''
            }
        }
        row.push(temp)
        console.log('notice', chr, temp, row)
        for (var b = 0; b < row.length; b++) {
            // 控制最多显示2行
            if (b < 2) {
                ctx.fillText(row[b], x, y + b * 30)
            }
        }
        let _len = row.length > 2 ? 2 : row.length
        return y + (_len - 1) * 30
    },

    /*测试方法*/
    _testBase: function() {
        let testBase = new Promise((resolve, reject) => {
            setTimeout(function() {
                resolve(111)
            }, 2000)
        })
        return testBase
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        console.log(111111);
        var that = this,
            base = this.data.baseInfo,
            share_img
        if (base.share.share_img) {
            share_img = base.share.share_img
        } else {
            share_img = this.data.imagePath
        }
        return {
            title: base.share.share_txt,
            path: base.share.share_url,
            imageUrl: share_img,
        }
    },
})