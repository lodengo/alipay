/**
 * Created with JetBrains WebStorm.
 * User: dengdl
 * Date: 13-3-7
 * Time: 下午2:33
 * To change this template use File | Settings | File Templates.
 */

/* *
 * MD5
 * 详细：MD5加密
 * 版本：3.3
 * 日期：2012-07-19
 * 说明：
 * 以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 * 该代码仅供学习和研究支付宝接口使用，只是提供一个参考。
 */

var crypto = require('crypto');

/**
 * 签名字符串
 * @param prestr 需要签名的字符串
 * @param key 私钥
 * return 签名结果
 */

exports.md5Sign = function(prestr, key){
    prestr = prestr + key;

    return crypto.createHash('md5').update(prestr, 'utf8').digest("hex"); //crypto.createHash('md5').update(prestr).digest("hex");
}

/**
 * 验证签名
 * @param prestr 需要签名的字符串
 * @param sign 签名结果
 * @param key 私钥
 * return 签名结果
 */

exports.md5Verify = function(prestr, sign, key){
    prestr = prestr + key;
    var mysgin = crypto.createHash('md5').update(prestr, 'utf8').digest("hex");

    if(mysgin == sign) {
        return true;
    }
    else {
        return false;
    }
}
