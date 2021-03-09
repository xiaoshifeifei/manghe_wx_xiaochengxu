import { Balance } from "balance-model.js";
var balance = new Balance();
var app = getApp();
Page({
    data: {
        p: 1,
        listData: [],
        money: '0.00',
        money_capital: '0.00',
        tips: '',
        style1: 'display:none',
        moneyNum: '',
        is_cash: 1,
        type:1,
        min_money:1,
        max_money:1000
    },

    onShow: function () {
        this._getBalanceData();
    },

    onLoad: function () {
        //this._loadData()

    },

    _getBalanceData() {
        let that = this;
        let p = that.data.p;
        let type = that.data.type;
        if(type==1){
            //交易记录
            balance.getBalanceData(p, (data) => {
                if (data.err == 0) {
                    if(p==1){
                        that.setData({
                            listData: []
                        })    
                    }
                    var nowData = that.data.listData.concat(data.data.list)
                    //设置数据
                    that.setData({
                        p: p + 1,
                        listData: nowData,
                        isEnd: data.data.nextPage,
                        money: data.data.money,
                        money_capital: data.data.money_capital,
                        tips: data.data.tips,
                        min_money:data.data.min_money,
                        max_money:data.data.max_money
                    })
                    if(that.money(data.data.money)>0){
                        console.log(that.money(data.data.money));
                        that.setData({
                            is_cash: 1
                        })
                    }else{
                        that.setData({
                            is_cash: 0
                        })
                    }
                }
            })
        }

        if(type==2){
            //提现记录
            balance.getCashLogData(p, (data) => {
                if (data.err == 0) {
                    if(p==1){
                        that.setData({
                            listData: []
                        })    
                    }
                    var nowData = that.data.listData.concat(data.data.list)
                    //设置数据
                    that.setData({
                        p: p + 1,
                        listData: nowData,
                        isEnd: data.data.nextPage,
                        money: data.data.money,
                        money_capital: data.data.money_capital,
                    })
                    if(that.money(data.data.money)>0){
                        console.log(that.money(data.data.money));
                        that.setData({
                            is_cash: 1
                        })
                    }else{
                        that.setData({
                            is_cash: 0
                        })
                    }
                }
            })
        }
       
    },

    /**
        * 页面上拉加载
        */
    onReachBottom: function () {
        //判断是否有下一页
        var is_end = this.data.isEnd;
        if (is_end == 0) {
            //没有下一页
            balance.toastMsg("没有更多记录喽~")
            return false
        }
        //加载数据
        this._getBalanceData();
    },

    //下拉刷新
    onPullDownRefresh: function () {
        var that = this;
        wx.showNavigationBarLoading() //在标题栏中显示加载

        var that = this;
        var p = 1;
        let type = that.data.type;
        if(type==1){
            balance.getBalanceData(p, (data) => {

                if (data.err == 0) {
                    that.setData({
                        listData: []
                    })
                    var nowData = that.data.listData.concat(data.data.list)
    
                    //设置数据
                    that.setData({
                        p: p + 1,
                        listData: nowData,
                        isEnd: data.data.nextPage,
                        money: data.data.money,
                        money_capital: data.data.money_capital,
                        tips: data.data.tips
                    })
                }
                // complete
                wx.hideNavigationBarLoading() //完成停止加载
    
                wx.stopPullDownRefresh() //停止下拉刷新
                wx.showToast({
                    title: '刷新成功',
                    icon: 'none',
                    duration: 1000
                })
            })
        }

        if(type==2){
            balance.getCashLogData(p, (data) => {

                if (data.err == 0) {
                    that.setData({
                        listData: []
                    })
                    var nowData = that.data.listData.concat(data.data.list)
    
                    //设置数据
                    that.setData({
                        p: p + 1,
                        listData: nowData,
                        isEnd: data.data.nextPage,
                        money: data.data.money,
                        money_capital: data.data.money_capital,
                        tips: data.data.tips
                    })
                }
                // complete
                wx.hideNavigationBarLoading() //完成停止加载
    
                wx.stopPullDownRefresh() //停止下拉刷新
                wx.showToast({
                    title: '刷新成功',
                    icon: 'none',
                    duration: 1000
                })
            })
        }
       

    },

    //去提现问题
    toProblem: function () {
        wx.navigateTo({
            url: '../problem/problem',
        })
    },
    //打开提现弹框
    openCash: function () {
        this.setData({
            'style1': 'display:block;'
        })
    },
    //获取提现金额
    // getCashNum:function(event){
    //     console.log(event.detail.value);
    // },
    /**
 * @method: 双向绑定，实时获取输入框值
 * @params: event形参必须有，返回输入框相关对象
 */
    inputedit: function (event) {
        this.setData({
            moneyNum: this.money(event.detail.value)  //money匹配金额输入规则，返回输入值
        });
    },
    /**
     * @method: 金额输入限制
     * @params: val接收number值
     */
    money(val) {
        let num = val.toString(); //先转换成字符串类型
        if (num.indexOf('.') == 0) { //第一位就是 .
            num = '0' + num
        }
        num = num.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        num = num.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
        if (num.indexOf(".") < 0 && num != "") {
            num = parseFloat(num);
        }
        return num
    },

    //关闭提现弹框
    closeCash: function () {
        this.setData({
            'style1': 'display:none;'
        })
    },

    close: function () {

    },

    //去提现
    toCash: function () {
        var moneyNum = this.data.moneyNum;
        var that = this;
        let min_money = this.data.min_money;
        let max_money = this.data.max_money;

        if(moneyNum<min_money || moneyNum>max_money){
            // console.log(moneyNum);
            wx.showToast({
                title: '提现金额在'+min_money+'~'+max_money+'之间',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        balance.goCash(moneyNum, (data) => {
            that.setData({
                p: 1,
                listData:[],
                'style1': 'display:none;'
            })           

            if (data.err == 0) {
                wx.showToast({
                    title: '提现成功，注意查收噢~',
                    icon: 'none',
                    duration: 2000
                })    
            }else{
                wx.showToast({
                    title: data.msg,
                    icon: 'none',
                    duration: 2000
                })   
            }

            setTimeout(function () {
                that._getBalanceData();
            },1000);

           
        })
    },

    choose:function(event){
        let type = balance.getDataSet(event, "type");
        let that = this;
        that.setData({
            type: type,
            p:1
        })
        //加载数据
        that._getBalanceData();
    }

})
