var config = {
    partner:'' //合作身份者id，以2088开头的16位纯数字
    ,key:''//安全检验码，以数字和字母组成的32位字符
    ,seller_email:'' //卖家支付宝帐户 必填 
};

var Alipay = require('alipay').Alipay;

exports.alipay = new Alipay(config);