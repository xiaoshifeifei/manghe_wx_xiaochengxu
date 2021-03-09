/**
 * Created by Eric&Pany on 2020/04/01.
 */
import {Base} from '../../utils/base.js'

class Search extends Base{

    constructor(){
        super();
        this.ImgUrl3 = this.restCdnUrl+'ht-app-wx/wx_img/631.png';
    }

    /*搜索页面默认显示内容*/
    searchList(callback){
        var url = 'v1/search/searchlist';
        var param = {
            url: url,
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

    /*搜索内容*/
    searchContent(search_content,p,callback){
        var url = 'v1/search/search';
        var param = {
            url: url,
            data: {
                search_content: search_content,
                p:p
            },
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }

    /*删除搜索记录*/
    delSearchLog(callback){
        var url = 'v1/search/delsearchlog';
        var param = {
            url: url,
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.newrequest(param);
    }
}

export {Search};