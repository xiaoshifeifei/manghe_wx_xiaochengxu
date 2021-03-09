import {Base} from '../../utils/base.js';
class BargainDetail extends Base{
    constructor(){
        super();
        this.getPreOrderUrl1 = this.baseRestUrl+'v2/product/preorderkj';//生成砍价盲盒预订单
        this.tokenUrl = this.baseRestUrl+'token/gettoken'; //获取token
        //砍价弹窗图片
        this.image42 = this.restCdnUrl+'ht-app-wx/wx_img/42.png';

        this.PriceImg = this.restCdnUrl+'ht-app-wx/wx_img/44.png';//价格背景图
    }
    
    //生成店铺盲盒预订单
    getpreorder1(par){
        var that = this;
        var timerName = setTimeout(function() {
            that.showLoading('玩命加载中...');
        },500);
        //生成签名
        var timestamp = Date.parse(new Date());  
        var time = timestamp / 1000; 
        //获得token
        var token = wx.getStorageSync('token');
        var myarr=new Array();
        myarr['p_id']= par.p_id;
        myarr['act_id']= par.act_id;
        myarr['num']= par.num;
        myarr['token']= token;
        myarr['time']=time;
        var key =this.signKey;
        var sign =this.createsign(myarr,key);
        wx.request({
          url: this.getPreOrderUrl1,
          header: {
            'content-type': 'application/json',
            'token': wx.getStorageSync('token'),
            'sign':sign
          },
          data: {
            p_id:par.p_id,
            act_id:par.act_id,
            num:par.num,          
            time:time
          },
          success: function (res) {
            clearTimeout(timerName); 
            that.hideLoading();  

            if(res.data.err==1000){
                par.callback && par.callback(res.data.data);
            }else{
                if(res.data.err==1032){
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration: 3000
                    })
                   
                }else if(res.data.err==1006){
                    //token过期
                    that.getNewToken(par);
                
                }else{
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration: 2000
                    })
                }    
              
            }
          },
          fail: function (res) {
                that.hideLoading()
          }
        });
    }
    

    /*获取砍价商品列表*/
    getBargainDetail(id,callback){
        var param = {
            url:'v1/invite/productdetail',
            data:{
                id:id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
    /*
     *token过期时，获取新的token
     */
    getNewToken(par){
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
                        if(token){
                           that.getHomeData(par)
                        }
                    }
                })
            }
        })
        
    }
}
export {BargainDetail};