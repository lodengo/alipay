
/**
 * Module dependencies.
 */

var express = require('express')
  , demo = require('./routes/alipaydemo')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./alipay_config').alipay.route(app);

app.get('/', function(req, res){	
	res.render("index");	
});

app.get('/test', function(req, res){
	var DOMParser = require('xmldom').DOMParser;
	require('fs').readFile('test.xml', function (err, data) {
		var doc = new DOMParser().parseFromString(data.toString());
		var alipay = doc.getElementsByTagName('alipay').item(0).nodeValue;
		console.dir(doc.getElementsByTagName('is_success').item(0).firstChild.nodeValue);
		res.send('');
	});
	
});

app.all('/create_direct_pay_by_user', demo.create_direct_pay_by_user);
app.all('/create_direct_bankpay_by_user', demo.create_direct_bankpay_by_user);
app.all('/refund_fastpay_by_platform_pwd', demo.refund_fastpay_by_platform_pwd);
app.all('/create_partner_trade_by_buyer', demo.create_partner_trade_by_buyer);
app.all('/send_goods_confirm_by_platform', demo.send_goods_confirm_by_platform);
app.all('/trade_create_by_buyer', demo.trade_create_by_buyer);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
