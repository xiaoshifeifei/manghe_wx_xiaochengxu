
class Config{
    constructor(){

    }
}

// Config.restUrl = 'http://www.zahuodian.com/api/v1/';
//local
// Config.restUrl = 'http://ht-app/';
// Config.restCdnUrl = 'http://ht-cdn/';
// Config.restUploadUrl = 'http://ht-app/';
//test
// Config.restUrl = 'https://ht-app.test.hetunb.com/';
// Config.restCdnUrl = 'https://ht-cdn.test.hetunb.com/';
// Config.restUploadUrl = 'https://ht-app.test.hetunb.com/';
// Config.restUrl = 'https://ht-app.qmwlxcx.com/';
// Config.restCdnUrl = 'https://ht-app.qmwlxcx.com/';
// Config.restUploadUrl = 'https://ht-app.qmwlxcx.com/';
//release
//  Config.restUrl = 'https://ht-app.hetunb.com/';
//  Config.restCdnUrl = 'https://ht-cdn.hetunb.com/';

Config.restUrl = 'https://wj-app.hizhiliao.cn/';
Config.restCdnUrl = 'https://wj-cdn.hizhiliao.cn/';

//  Config.restUploadUrl = 'https://ht-adm.hetunb.com/';
Config.signKey = 'mDaJczDACEZFHsnzGZkxTbrGyJz236hD';  //e9c5e04b500b79603746d088128f7ad1   8b380842b29fb6e21780ed6d92736a45   mDaJczDACEZFHsnzGZkxTbrGyJz236hD   wx17af2c3ec09f4e68
Config.onPay=true;  //是否启用支付

export {Config};