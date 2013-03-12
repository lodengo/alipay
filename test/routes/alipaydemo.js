var alipay = require('../alipay_config').alipay;
//alipay.on('verify_fail', function(){console.log('emit verify_fail')});	
	
exports.create_direct_pay_by_user = function(req, res){
	if(req.route.method == 'get'){
		res.render('create_direct_pay_by_user'); 
	}
	else if(req.route.method == 'post'){		
		var data = {
			 out_trade_no:req.body.WIDout_trade_no 
			,subject:req.body.WIDsubject 
			,total_fee:req.body.WIDtotal_fee 
			,body: req.body.WIDbody
			,show_url:req.body.WIDshow_url
		 };		
		
		alipay.create_direct_pay_by_user(data, res)
		.on('verify_fail', function(){})
		.on('create_direct_pay_by_user_trade_finished', function(out_trade_no, trade_no){})
		.on('create_direct_pay_by_user_trade_success', function(out_trade_no, trade_no){});
	}
}

exports.refund_fastpay_by_platform_pwd =function(req, res){
	if(req.route.method == 'get'){
		res.render('refund_fastpay_by_platform_pwd'); 
	}
	else if(req.route.method == 'post'){		
		var data = {
			 refund_date:req.body.WIDrefund_date 
			,batch_no:req.body.WIDbatch_no 
			,batch_num:req.body.WIDbatch_num 
			,detail_data: req.body.WIDdetail_data			
		 };
		 	
		alipay.refund_fastpay_by_platform_pwd(data, res)
		.on('verify_fail', function(){})
		.on('refund_fastpay_by_platform_pwd_success', function(batch_no, success_num, result_details){})
		
	}
}

exports.create_partner_trade_by_buyer = function(req, res){
	if(req.route.method == 'get'){
		res.render('create_partner_trade_by_buyer'); 
	}
	else if(req.route.method == 'post'){		
		var data = {
			 refund_date:req.body.WIDrefund_date 
			,batch_no:req.body.WIDbatch_no 
			,batch_num:req.body.WIDbatch_num 
			,detail_data: req.body.WIDdetail_data			
		 };	
		
		alipay.refund_fastpay_by_platform_pwd(data, res)
		.on('verify_fail', function(){})
		.on('create_partner_trade_by_buyer_wait_buyer_pay', function(out_trade_no, trade_no){})
		.on('create_partner_trade_by_buyer_wait_seller_send_goods', function(out_trade_no, trade_no){})
		.on('create_partner_trade_by_buyer_wait_buyer_confirm_goods', function(out_trade_no, trade_no){})
		.on('create_partner_trade_by_buyer_trade_finished', function(out_trade_no, trade_no){});
		
	}
}

exports.send_goods_confirm_by_platform = function(req, res){
	if(req.route.method == 'get'){
		res.render('send_goods_confirm_by_platform'); 
	}
	else if(req.route.method == 'post'){		
		var data = {
			 trade_no:req.body.WIDtrade_no 
			,logistics_name:req.body.WIDlogistics_name 
			,invoice_no:req.body.WIDinvoice_no
			,transport_type: req.body.WIDtransport_type			
		 };	
		
		alipay.send_goods_confirm_by_platform(data, res)
		.on('send_goods_confirm_by_platform_fail', function(error){res.send(error)})
		.on('send_goods_confirm_by_platform_success', function(out_trade_no, trade_no, xml){});		
	}
}

exports.create_direct_bankpay_by_user = function(req, res){
	if(req.route.method == 'get'){
		res.render('create_direct_bankpay_by_user'); 
	}
	else if(req.route.method == 'post'){		
		var data = {
			 out_trade_no:req.body.WIDout_trade_no 
			,subject:req.body.WIDsubject 
			,total_fee:req.body.WIDtotal_fee 
			,body: req.body.WIDbody
			,show_url:req.body.WIDshow_url
			,paymethod:'bankPay'
			,defaultbank:req.body.WIDdefaultbank			
		 };		
		
		alipay.create_direct_pay_by_user(data, res)
		.on('verify_fail', function(){})
		.on('create_direct_pay_by_user_trade_finished', function(out_trade_no, trade_no){})
		.on('create_direct_pay_by_user_trade_success', function(out_trade_no, trade_no){});		
	}
}

exports.trade_create_by_buyer = function(req, res){
	if(req.route.method == 'get'){
		res.render('trade_create_by_buyer'); 
	}
	else if(req.route.method == 'post'){		
		var data = {
			 out_trade_no:req.body.WIDout_trade_no 
			,subject:req.body.WIDsubject 
			,total_fee:req.body.WIDtotal_fee 
			,body: req.body.WIDbody
			,show_url:req.body.WIDshow_url
			,paymethod:'bankPay'
			,defaultbank:req.body.WIDdefaultbank			
		 };		
		
		alipay.trade_create_by_buyer(data, res)
		.on('verify_fail', function(){})
		.on('trade_create_by_buyer_wait_buyer_pay', function(out_trade_no, trade_no){})
		.on('trade_create_by_buyer_wait_seller_send_goods', function(out_trade_no, trade_no){})
		.on('trade_create_by_buyer_wait_buyer_confirm_goods', function(out_trade_no, trade_no){})
		.on('trade_create_by_buyer_trade_finished', function(out_trade_no, trade_no){});	
	}
}