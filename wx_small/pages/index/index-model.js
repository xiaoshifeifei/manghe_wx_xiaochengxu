/**
 * Created by Eric on 19/6/10.
 */
import { Token } from '../../utils/token.js';
import {Base} from '../../utils/base.js';

class Index extends Base{
    constructor(){
      super();
      this.tokenUrl = this.baseRestUrl+'token/gettoken'; //获取token
      this.ImgUrl2 = this.restCdnUrl+'ht-app-wx/wx_img/42.png';
      this.ImgUrl3 = this.restCdnUrl+'ht-app-wx/wx_img/631.png';
      this.PageBackImg = this.restCdnUrl+'ht-app-wx/wx_img/01.png';//背景图

      this.PriceImg = this.restCdnUrl+'ht-app-wx/wx_img/44.png';//价格背景图
      this.ImgUrl = this.restCdnUrl+'ht-app-wx/wx_img/';//icon网络地址
    }

    /*获取首页信息*/
    getHomeData(callback){
        var param = {
            url:'v3/home/gethome',
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    /*获取固定栏目商品列表*/
    getFixedProductList(type,p,sort,way,send,callback){
        var param = {
            url:"v3/home/getFixedproductlist",
            data:{
                p:p,
                type:type,
                sort:sort,
                way:way,
                send:send,
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }

    /*获取标签商品列表*/
    getProductList(tid,p,sort,way,send,callback){
        var param = {
            url:"v3/home/getproductlist",
            data:{
                p:p,
                tid:tid,
                sort:sort,
                way:way,
                send:send,
            },
            sCallback:function(data){
                callback && callback(data);
            }
        };
        this.newrequest(param);
    }
    
    
    /*保存用户同意自由发货协议的记录*/
    saveUserAgree(callback){
        var param = {
            url:'v2/home/saveuseragree',
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
  
    /*创建用户点击小红点记录*/
    clickRedDot(hpc_id,callback){
        var param = {
            url:'v1/home/clickreddot',
            data: {
                hpc_id: hpc_id,
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    /*获取砍价弹窗信息*/
    getCutWin(actid,id,callback){
        var param = {
            url:'v1/invite/cutdetail',
            data: {
                actid: actid,
                id: id
            },
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
     /*获取专题宣传图*/
    getTopic(callback){
        var param = {
            url:'/share/activitytopic',
            sCallback:function(data){
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
    
    /*获取分享配置*/
    getShareConfig(type,callback){
        var param = {
            url:'share/getshareconfig',
            data: {
                type: type,
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
    getNewToken(par,action_name){
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
                           if(action_name=='getHomeData'){
                               that.getHomeData(par);
                           }
                        }
                    }
                })
            }
        })
        
    }
};

export {Index};