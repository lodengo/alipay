/**
 * Created with JetBrains WebStorm.
 * User: dengdl
 * Date: 13-3-7
 * Time: 下午3:43
 * To change this template use File | Settings | File Templates.
 */

/* *
 * 类名：AlipaySubmit
 * 功能：支付宝各接口请求提交类
 * 详细：构造支付宝各接口表单HTML文本，获取远程HTTP数据
 * 版本：3.3
 * 日期：2012-07-23
 * 说明：
 * 以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 * 该代码仅供学习和研究支付宝接口使用，只是提供一个参考。
 */

var core_funcs = require('./alipay_core.function');
var md5_f = require('./alipay_md5.function');
var DOMParser = require('xmldom').DOMParser;

function AlipaySubmit(alipay_config){
    /**
     *支付宝网关地址（新）
     */
    this.alipay_gateway_new = 'https://mapi.alipay.com/gateway.do?';
    this.alipay_config = alipay_config;
}

/**
 * 生成签名结果
 * @param para_sort 已排序要签名的数组
 * return 签名结果字符串
 */
AlipaySubmit.prototype.buildRequestMysign = function(para_sort){
    //把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
    var prestr = core_funcs.createLinkstring(para_sort);

    var mysign = "";

    var sign_type = this.alipay_config['sign_type'].trim().toUpperCase();
    if(sign_type == "MD5"){
        mysign = md5_f.md5Sign(prestr, this.alipay_config['key']);
    }
    else{
        mysign = "";
    }
    return mysign;
}

/**
 * 生成要请求给支付宝的参数数组
 * @param para_temp 请求前的参数数组
 * @return 要请求的参数数组
 */
AlipaySubmit.prototype.buildRequestPara = function(para_temp){
    //除去待签名参数数组中的空值和签名参数
    var para_filter = core_funcs.paraFilter(para_temp);

    //对待签名参数数组排序
    var para_sort = core_funcs.argSort(para_filter);

    //生成签名结果
    var mysign = this.buildRequestMysign(para_sort);

    //签名结果与签名方式加入请求提交参数组中
    para_sort['sign'] = mysign;
    para_sort['sign_type'] = this.alipay_config['sign_type'].trim().toUpperCase();

    return para_sort;
}

/**
 * 生成要请求给支付宝的参数数组
 * @param para_temp 请求前的参数数组
 * @return 要请求的参数数组字符串
 */
AlipaySubmit.prototype.buildRequestParaToString = function(para_temp){
    //待请求参数数组
    var para = this.buildRequestPara(para_temp);

    //把参数组中所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串，并对字符串做urlencode编码
    var request_data = core_funcs.createLinkstringUrlencode(para);

    return request_data;
}

/**
 * 建立请求，以表单HTML形式构造（默认）
 * @param para_temp 请求参数数组
 * @param method 提交方式。两个值可选：post、get
 * @param button_name 确认按钮显示文字
 * @return 提交表单HTML文本
 */
AlipaySubmit.prototype.buildRequestForm = function (para_temp, method, button_name) {
    //待请求参数数组
    var para = this.buildRequestPara(para_temp);

    var sHtml = "<form id='alipaysubmit' name='alipaysubmit' action='"
            + this.alipay_gateway_new
            +  "_input_charset="
            + this.alipay_config['input_charset'].toLowerCase().trim()
            + "' method='" + method + "'>";

    for(var key in para){
        var val = para[key];
        sHtml += "<input type='hidden' name='" + key + "' value='" + val + "'/>";
    }

    //submit按钮控件请不要含有name属性
    sHtml = sHtml+ "<input type='submit' value='" + button_name + "'></form>";

    sHtml = sHtml + "<script>document.forms['alipaysubmit'].submit();</script>";

    return sHtml; 
}

/**
 * 建立请求，以模拟远程HTTP的POST请求方式构造并获取支付宝的处理结果
 * @param para_temp 请求参数数组
 * @return 支付宝处理结果
 */
AlipaySubmit.prototype.buildRequestHttp = function (para_temp, callback) {
    //待请求参数数组字符串
    var request_data = this.buildRequestPara(para_temp);

    //远程获取数据
	core_funcs.getHttpResponsePOST(this.alipay_gateway_new, this.alipay_config['cacert'],request_data,this.alipay_config['input_charset'].toLowerCase().trim(), callback);    
}

/**
 * 建立请求，以模拟远程HTTP的POST请求方式构造并获取支付宝的处理结果，带文件上传功能
 * @param para_temp 请求参数数组
 * @param file_para_name 文件类型的参数名
 * @param file_name 文件完整绝对路径
 * @return 支付宝返回处理结果
 */
AlipaySubmit.prototype.buildRequestHttpInFile = function (para_temp, file_para_name, file_name, callback) {
    //待请求参数数组
    var para = this.buildRequestPara(para_temp);
    para[file_para_name] = "@" + file_name;

    //远程获取数据
    core_funcs.getHttpResponsePOST(this.alipay_gateway_new, this.alipay_config['cacert'],para,this.alipay_config['input_charset'].toLowerCase().trim(), callback);
}

/**
 * 用于防钓鱼，调用接口query_timestamp来获取时间戳的处理函数
 * 注意：该功能PHP5环境及以上支持，因此必须服务器、本地电脑中装有支持DOMDocument、SSL的PHP配置环境。建议本地调试时使用PHP开发软件
 * return 时间戳字符串
 */
AlipaySubmit.prototype.query_timestamp = function (callback) {
    var url = this.alipay_gateway_new + "service=query_timestamp&partner=" + this.alipay_config['partner'].toLowerCase().trim();
	
	http.get(url, function(res) {
		var responseText='';
        res.on('data', function(chunk){
            responseText += chunk;
        });
        res.on('end', function(){
			var doc = new DOMParser().parseFromString(responseText);
			var itemEncrypt_key = doc.getElementsByTagName( "encrypt_key" );
			var encrypt_key = itemEncrypt_key.item(0).nodeValue;
			callback && callback(encrypt_key);
        });
	});  
}

exports.AlipaySubmit = AlipaySubmit;
