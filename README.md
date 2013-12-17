node.js 实现支付宝 api
包括 `担保交易收款`，`即时到帐收款`，`双功能收款`，`网银支付`，`即时到账批量退款`，`支付宝确认发货`等

用法
```bash
npm install alipay
cd test
node app

# http://localhost:3000
```

代码说明：
```
alipay_config.js # 设置参数
app.js 中 require('./alipay_config').alipay.route(app) # 设置了支付宝通知路由
alipaydemo.js    # 使用事件处理交易状态等
```
