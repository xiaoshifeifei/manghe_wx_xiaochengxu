// 引用使用es6的module引入和定义
// 全局变量以g_开头
// 私有函数以_开头

import { Config } from 'config.js';

class Token {
    constructor() {
      // this.verifyUrl = Config.restUrl + '/token/verifytoken';
      // this.tokenUrl = Config.restUrl + '/token/gettoken';
      this.verifyUrl = Config.restUrl+'token/verifytoken';
      this.tokenUrl = Config.restUrl+'token/gettoken';
      this.decryptUrl = Config.restUrl+'token/decryptdata';
    }
    //check token
    _checkToken(url,func){
        return new Promise((resolve, reject) => {
          wx.request({
            url: url,
            header: {
              'content-type': 'application/json',
              'token': wx.getStorageSync('token')
            },
            success:function(res){
                resolve(res.data);        
            },
            fail (err) { 
//               reject(err);
                func.callback(1);               
            }
          })
        })
    }
    
    // request post 请求
    _postData(url,param){
        return new Promise((resolve, reject) => {
          wx.request({
            url: url,
            data: param,
            success:function(res){
                resolve(res.data);        
            },
            fail (err) {
              reject(err)
            }
          })
        })
    }
    
    //login 请求
    _login(){
        return new Promise((resolve, reject) => {
           wx.login({
            success (res) {
              resolve(res)
            },
            fail (err) {
              reject(err)
            }
          })
        })
    }
    
    //同步检查token和获取token
    _rsncToken(func){
//        console.log(func);
        var that = this;
        that._checkToken(that.verifyUrl,func).then((ct)=>{          
            var valid = ct.data.valid;
            if(!valid){
                that._login().then((v)=>{
//                    console.log(v.code);
//                    console.log(func.query.pr_id);
                    var url = that.tokenUrl;
                    var code = v.code;
                    if(func.query.pr_id){
                        var pr_id = func.query.pr_id;
                    }else{
                        var pr_id =0;
                    }
                    
                    if(func.encode){
                        var encode = func.encode;
                    }else{
                        var encode =0;
                    }
                    
                    var param ={
                        code:code,
                        pr_id:pr_id,
                        encode:encode
                    };
                    that._postData(url,param).then((v1)=>{
                            wx.setStorageSync('token', v1.data.token);
                            
                            //获取token后，再执行其他方法
                            func.callback(v1.data);
                    })  
                })
            }else{
                //token有效，执行需要执行的方法
                func.callback(ct.data);
                
            }
        })
    }

    /*获取token封装方法*/
    getTokenFromServer(callBack) {
        var that  = this;
        wx.login({
            success: function (res) {
                wx.request({
                    url: that.tokenUrl,
                    method:'POST',
                    header: {
                        'content-type': "application/x-www-form-urlencoded"
                    },
                    data:{
                        code:res.code
                    },
                    success:function(res){
                        var token = res.data.data.token
                        wx.setStorageSync('token', token);
                        callBack&&callBack(token);
                    }
                })
            }
        })
    }


    /*授权用户信息*/
    isSetting(callback) {
        var that = this;
        wx.getSetting({
            success: function (res) {
                console.log(res)
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权-说明用户不是第一次登录
                    callback(1)
                } else {
                    //未授权,引导用户授权
                    callback(2)
                }
            }
        })
    }

}

export {Token};