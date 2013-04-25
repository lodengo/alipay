/**
 * Created with JetBrains WebStorm.
 * User: dengdl
 * Date: 13-3-7
 * Time: 上午11:26
 * To change this template use File | Settings | File Templates.
 */

var qs = require('querystring');
var fs = require('fs');
var https = require('https');
//var Iconv  = require('iconv').Iconv;

/* *
 * 支付宝接口公用函数
 * 详细：该类是请求、通知返回两个文件所调用的公用函数核心处理文件
 * 版本：3.3
 * 日期：2012-07-19
 * 说明：
 * 以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 * 该代码仅供学习和研究支付宝接口使用，只是提供一个参考。
 */

/**
 * 把对象所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
 * @param para 需要拼接的对象
 * return 拼接完成以后的字符串
 */
exports.createLinkstring = function(para){
    //return qs.stringify(para);
	var ls = '';
	for(var k in para){
		ls = ls + k + '=' + para[k] + '&';
	}
	ls = ls.substring(0, ls.length - 2);
	return ls;
}

/**
 * 把对象所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串，并对字符串做urlencode编码
 * @param para 需要拼接的对象
 * return 拼接完成以后的字符串
 */
exports.createLinkstringUrlencode = function(para){
    return qs.stringify(para);
}

/**
 * 除去对象中的空值和签名参数
 * @param para 签名参对象
 * return 去掉空值与签名参数后的新签名参对象
 */
exports.paraFilter = function(para){
    var para_filter = new Object();
    for (var key in para){
        if(key == 'sign' || key == 'sign_type' || para[key] == ''){
            continue;
        }
        else{
            para_filter[key] = para[key];
        }
    }

    return para_filter;
}

/**
 * 对对象排序
 * @param para 排序前的对象
 * return 排序后的对象
 */
exports.argSort = function(para){
    var result = new Object();
    var keys = Object.keys(para).sort();
    for (var i = 0; i < keys.length; i++){
        var k = keys[i];
        result[k] = para[k];
    }
    return result;
}

/**
 * 写日志，方便测试（看网站需求，也可以改成把记录存入数据库）
 * 注意：服务器需要开通fopen配置
 * @param word 要写入日志里的文本内容 默认值：空值
 */
exports.logResult = function(word){
    word = word || '';
    var str = "执行日期：" + Date().toString() + "\n" + word + "\n";
    fs.appendFile('log.txt', str);
}

/**
 * 远程获取数据，POST模式
 * 注意：
 * 1.使用Crul需要修改服务器中php.ini文件的设置，找到php_curl.dll去掉前面的";"就行了
 * 2.文件夹中cacert.pem是SSL证书请保证其路径有效，目前默认路径是：getcwd().'\\cacert.pem'
 * @param url 指定URL完整路径地址
 * @param cacert_url 指定当前工作目录绝对路径
 * @param para 请求的数据
 * @param input_charset 编码格式。默认值：空值
 * return 远程输出的数据
 */
exports.getHttpResponsePOST = function(url, cacert_url, para, input_charset, callback){
    input_charset = input_charset || '';
    if(input_charset.trim() != ''){
        url = url + "_input_charset=" + input_charset;
    }

    var parsed_url = require('url').parse(url);

    var para_str = qs.stringify(para);

    var options = {
        hostname:parsed_url.host,
        port:443,
        path:parsed_url.path,
        method:'POST',
        cert:fs.readFileSync(cacert_url),
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Length':para_str.length
        }
    };

    var req = https.request(options, function(res) {
        var responseText='';
        res.on('data', function(chunk){
            responseText += chunk;
        });
        res.on('end', function(){
			callback && callback(responseText);
        });
    });

    req.write(para_str);
    req.end();
}

/**
 * 远程获取数据，GET模式
 * 注意：
 * 1.使用Crul需要修改服务器中php.ini文件的设置，找到php_curl.dll去掉前面的";"就行了
 * 2.文件夹中cacert.pem是SSL证书请保证其路径有效，目前默认路径是：getcwd().'\\cacert.pem'
 * @param url 指定URL完整路径地址
 * @param cacert_url 指定当前工作目录绝对路径
 * return 远程输出的数据
 */
exports.getHttpResponseGET = function(url,cacert_url, callback){
    var parsed_url = require('url').parse(url);

    var options = {
        hostname:parsed_url.host,
        port:443,
        path:parsed_url.path,
        method:'GET',
        cert:fs.readFileSync(cacert_url)
    };

    var req = https.request(options, function(res) {
        var responseText='';
        res.on('data', function(chunk){
            responseText += chunk;
        });
        res.on('end', function(){
           callback && callback(responseText);
        });
    });

    req.end();
}

/**
 * 实现多种字符编码方式
 * @param input 需要编码的字符串
 * @param _output_charset 输出的编码格式
 * @param _input_charset 输入的编码格式
 * return 编码后的字符串
 */
exports.charsetEncode = function(input,_output_charset ,_input_charset) {
    var output = "";
    _output_charset  = _output_charset ||_input_charset;
    if(_input_charset == _output_charset || input == null) {
        output = input;
    }
    else {
            //var iconv = new Iconv(_input_charset,_output_charset);
            //output = iconv.convert(input);
    }

    return output;
}

/**
 * 实现多种字符解码方式
 * @param input 需要解码的字符串
 * @param _output_charset 输出的解码格式
 * @param _input_charset 输入的解码格式
 * return 解码后的字符串
 */
exports.charsetDecode = function(input,_input_charset ,_output_charset){
    var output = "";
    _input_charset = _input_charset || _output_charset;
    if(_input_charset == _output_charset || input == null) {
        output = input;
    }
    else{
        //var iconv = new Iconv(_input_charset,_output_charset);
        //output = iconv.convert(input);
    }

    return output;
}
