/**
 * Created by Eric on 19/6/10.
 */
import { Token } from '../../utils/token.js';
import {Base} from '../../utils/base.js';

class Home2 extends Base{
    constructor(){
      super();
      this.tokenUrl = this.baseRestUrl+'token/gettoken'; //获取token
      this.ImgUrl1 = this.restCdnUrl+'ht-app-wx/wx_img/demo-01.png'; 
      this.ImgUrl2 = this.restCdnUrl+'ht-app-wx/wx_img/42.png';
      this.ImgUrl3 = this.restCdnUrl+'ht-app-wx/wx_img/631.png';
      this.PageBackImg = this.restCdnUrl+'ht-app-wx/wx_img/01.png';
      this.ImgUrl = this.restCdnUrl+'ht-app-wx/wx_img/';//icon网络地址
    }

   //获取积分商城列表
    getGoodsData(p,callback){
        var param = {
            url:'v3/home/integralgoods',
            data:{
                p:p
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

export {Home2};