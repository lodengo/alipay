node js 封装实现支付宝商家收款产品api
包括担保交易收款，即时到帐收款， 双功能收款，网银支付，即时到账批量退款，支付宝确认发货等

用法
1.npm install alipay
2.cd test
3.npm install 
4.node app
5.http://localhost:3000

代码说明：
alipay_config.js设置参数
app.js中 require('./alipay_config').alipay.route(app); 设置了支付宝通知路由
alipaydemo.js中使用事件处理交易状态等

依赖：
express, xmldom
