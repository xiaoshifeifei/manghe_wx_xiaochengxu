/**
 * Created by jimmy-jiang on 2016/11/21.
 */
import { Token } from 'token.js';
import { Config } from 'config.js';
import { Md5 } from 'md5.js';


class Base {
    constructor() {
        "use strict";
        this.baseRestUrl = Config.restUrl;
        this.restCdnUrl = Config.restCdnUrl;
        this.restUploadUrl = Config.restUploadUrl;
        this.signKey = Config.signKey;
        this.onPay=Config.onPay;
    }
    
    //http 请求类, 当noRefech为true时，不做未授权重试机制
    request(params, noRefetch) {
        var that = this,
            url=this.baseRestUrl + params.url;
        if(!params.type){
            params.type='get';
        }
        /*不需要再次组装地址*/
        if(params.setUpUrl==false){
            url = params.url;
        }
        //加加载机制
        var timerName = setTimeout(function() {
            that.showLoading('玩命加载中...');
        },500);
        
        wx.request({
            url: url,
            data: params.data,
            method:params.type,
            header: {
                'content-type': 'application/json',
                'token': wx.getStorageSync('token')
            },
            success: function (res) {
                clearTimeout(timerName);
                that.hideLoading();
                // 判断以2（2xx)开头的状态码为正确
                // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
                var code = res.statusCode.toString();
                var startChar = code.charAt(0);
                if (startChar == '2') {
                    params.sCallback && params.sCallback(res.data);
                } else {
                    if (code == '401') {
                        if (!noRefetch) {
                            that._refetch(params);
                        }
                    }
                    that._processError(res);
                    params.eCallback && params.eCallback(res.data);
                }
            },
            fail: function (err) {
                that.hideLoading();
                //wx.hideNavigationBarLoading();
                that._processError(err);
                // params.eCallback && params.eCallback(err);
            }
        });
    }

    //http 请求类, 当noRefech为true时，不做未授权重试机制
    newrequest(params, noRefetch) {
        var that = this,
            contype = 'application/json',
            url=this.baseRestUrl + params.url;
        if(!params.type){
            params.type='get';
        }
        if(params.type == 'post'){
            contype = "application/x-www-form-urlencoded";
        }
        /*不需要再次组装地址*/
        if(params.setUpUrl==false){
            url = params.url;
        }
        //加加载机制
        var timerName = setTimeout(function() {
            that.showLoading('玩命加载中...');
        },500);
        var token = wx.getStorageSync('token')
        //是否需要签名sign处理
        if(params.needSign == true){
            //重新组装params.data
            params.data = that._newCreateSign(params.data,token);
        }
        //return
        wx.request({
            url: url,
            data: params.data,
            method:params.type,
            header: {
                'content-type': contype,
                'token': token
            },
            success: function (res) {
                clearTimeout(timerName);
                that.hideLoading()
                var code = res.data.err
                if(code == '0' || code=='1000'){
                    //数据获取成功
                    params.sCallback && params.sCallback(res.data);
                }else{
                    if (code == 1006) {
                        //token过期
                        if (!noRefetch || noRefetch == "undefined") {
                            that._refetchNew(params);
                        }
                    }
                    //token过期不toast提示
                    if (code != 1006) {
                        that._processError(res);
                    }
                    params.sCallback && params.sCallback(res.data);
                }
            },
            fail: function (err) {
                that.hideLoading()
                //wx.hideNavigationBarLoading();
                that._processError(err);
                // params.eCallback && params.eCallback(err);
            }
        });
    }

    _processError(err){
        wx.showToast({
            title: err.data.msg,
            icon: 'none',
            duration: 2000
        })
    }

    toastMsg(msg){
        wx.showToast({
            title: msg,
            icon: 'none',
            duration: 2000
        })
    }

    _refetch(param) {
        var token = new Token();
        token.getTokenFromServer((token) => {
            this.request(param, true);
        });
    }

    /*复写重新获取token方法-供newrequest方法使用*/
    _refetchNew(param) {
        var token = new Token();
        token.getTokenFromServer((token) => {
            this.newrequest(param, true);
        });
    }

    /*获得元素上的绑定的值*/
    getDataSet(event, key) {
        return event.currentTarget.dataset[key];
    };

    /*获取event的value值*/
    getEventValue(event){
        return event.detail.value;
    };

    
    /** 
    * 时间戳转化为年 月 日 时 分 秒 
    * number: 传入时间戳 
    * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
   */
   formatTimeTwo(number, format) {
       
       var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
       var returnArr = [];

       var date = new Date(number * 1000);
       returnArr.push(date.getFullYear());
       returnArr.push(this.formatNumber(date.getMonth() + 1));
       returnArr.push(this.formatNumber(date.getDate()));

       returnArr.push(this.formatNumber(date.getHours()));
       returnArr.push(this.formatNumber(date.getMinutes()));
       returnArr.push(this.formatNumber(date.getSeconds()));

       for (var i in returnArr) {
           format = format.replace(formateArr[i], returnArr[i]);
       }
       return format;
   }
   
    formatNumber(n) {
        n = n.toString();
        return n[1] ? n : '0' + n;
    }
    
    ksort(inputArr, sort_flags) {
        var tmp_arr = {}, keys = [], sorter, i, k, that = this, strictForIn = false, populateArr = {};

          sorter = function(a, b) { 
              var aFloat = parseFloat(a), 
              bFloat = parseFloat(b), 
              aNumeric = aFloat + '' === a, 
              bNumeric = bFloat + '' === b; 
              if (aNumeric && bNumeric) {
                return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0; 
              } else if (aNumeric && !bNumeric) {
                return 1; 
              } else if (!aNumeric && bNumeric) {
                return -1; 
              }
                return a > b ? 1 : a < b ? -1 : 0;
          }; 

          // Make a list of key names 
          for (k in inputArr) { 
            if (inputArr.hasOwnProperty(k)) {
              keys.push(k); 
            } 
          } 
          keys.sort(sorter); 
          // BEGIN REDUNDANT
          this.php_js = this.php_js || {}; 
          this.php_js.ini = this.php_js.ini || {}; 
          // END REDUNDANT
          strictForIn = this.php_js.ini['phpjs.strictForIn'] && this.php_js.ini['phpjs.strictForIn'].local_value && this.php_js .ini['phpjs.strictForIn'].local_value !== 'off'; 
          populateArr = strictForIn ? inputArr : populateArr; 
          // Rebuild array with sorted key names
          for (i = 0; i < keys.length; i++) { 
            k = keys[i];
            tmp_arr[k] = inputArr[k];
            if (strictForIn) { 
              delete inputArr[k]; 
            } 
          } 
          for (i in tmp_arr) { 
            if (tmp_arr.hasOwnProperty(i)) {
              populateArr[i] = tmp_arr[i]; 
            } 
          } 

        return strictForIn || populateArr; 
    }
    
    createsign(myarr,key){
        var params = this.ksort(myarr);  
        var pairs = new Array();

        for(var i in params) {
          pairs.push(i+'='+params[i]);
        };

        var str = pairs.join('&');
        var md5 = new Md5();
        var sign =md5.MD5(str+'#'+key).toUpperCase();
        return sign
    }
    
    showLoading(message) {
        if (wx.showLoading) {
          // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
          wx.showLoading({
            title: message,
            mask: true
          });
        } else {
          // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
          wx.showToast({
            title: message,
            icon: 'loading',
            mask: true,
            duration: 20000
          });
        }
    }

    hideLoading() {
      if (wx.hideLoading) {
        // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
        wx.hideLoading();
      } else {
        wx.hideToast();
      }
    }
    
    buttonClicked(self) {
        self.setData({
          buttonClicked: true
        })
        setTimeout(function () {
          self.setData({
            buttonClicked: false
          })
        }, 1000)
    }

    /*生成签名新方法*/
    _newCreateSign(datas,token){
        //拼接datas&token对象
        //当前时间戳
        var timeStap = this._getTimeStamp()
        var signData = {
            'token':token,
            'time':timeStap
        }
        //合并对象
        var newData = this._extend(datas,signData)
        var keys = []
        for (let i in newData) {
            //授权重试删除参数sign
            if(i != 'sign'){
                keys.push(i)
            }
        }
        //对keys根据字母a-z进行排序&拼接参数数据进行签名
        keys.sort()

        var param_arr = new Array()
        for (let i in keys){
            param_arr.push(keys[i]+'='+newData[keys[i]]);
        }
        var str = param_arr.join("&")
        var md5 = new Md5();
        var key = Config.signKey;
        var sign =md5.MD5(str+'#'+key).toUpperCase();
        //删除参数值中的token
        delete datas.token;
        return  this._extend(datas,{'sign':sign})
    }
    /*合并对象*/
     _extend(target, source) {
        for (var obj in source) {
            target[obj] = source[obj];
        }
        return target;
    }
    /*生成时间戳*/
    _getTimeStamp(){
        var timestamp = Date.parse(new Date());
        return timestamp / 1000;
    }

    /*设置缓存*/
    BaseSetStorageSync(key, data) {
        try {
            wx.setStorageSync(key, data);
        } catch (e) {
            // Do something when catch error
        }
    }
    /*获取缓存*/
    BaseGetStorageSync(key) {
        try {
            var value = wx.getStorageSync(key)
            if (value) {
                return value
            }
        } catch (e) {
            // Do something when catch error
        }
    }
    /*取消缓存*/
    BaseRemoveStorage(key){
        try {
            wx.removeStorageSync(key)
        } catch (e) {
            // Do something when catch error
        }
    }
    /*授权弹窗*/
    _authCheckWin() {
        //弹窗
        wx.showModal({
            title: '提示',
            content: '您还未登录，是否前往登录？',
            cancelText:'暂不登录',
            cancelColor:'#9F9F9F',
            confirmText:'立即登录',
            confirmColor:'#ED7392',
            success (res) {
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

    /*验证字符串长度*/
    countLength(str) {
        var inputLength = 0;
        //给一个变量来记录长度
        for (var i = 0; i < str.length; i++) {
            var countCode = str.charCodeAt(i);
            //返回指定位置的字符的Unicode编码
            //判断是不是ASCII码,Unicode码前128个字符是ASCII码
            if (countCode >= 0 && countCode <= 128) {
                inputLength++;
            } else {
                inputLength += 2;
                //如果是扩展码，则一次+2
            }
        }
        return inputLength;
    }


};

export {Base};
