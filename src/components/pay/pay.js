import { addUrlParam, getUrlParameter } from "util"
var privateMethods = {
	
	/**
	 * 是否可以微信支付
	 */
	canUseWxPay(){
		var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\\\.]+)/i);
		if( !wechatInfo ) {
			console.info("该环境不是微信浏览器");
			return false;
		} else if ( +wechatInfo[1].split(".")[0] < 5 ) {
			console.info("微信支付,仅支持微信5.0以上版本");
			return false;
		}
		return true;
		
	},
	
	/**
	 * 微信jsapi支付
	 */
	getWxPay(payParams, successCallback, failCallback){
		
		function onBridgeReady() {
			var brigeType = 'getBrandWCPayRequest';
			var callback = function(res) {
				// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
				if(res.err_msg == "get_brand_wcpay_request:ok") {
					successCallback("ok");
					
				}else {
					if(res.err_msg == "get_brand_wcpay_request:cancel") {
					
						// 用户取消支付，跳转订单详情页
						successCallback("cancel");
											
					}else if(res.err_msg == "get_brand_wcpay_request:fail") {
						// 支付失败
						failCallback();
					}else if(res.err_msg == "调用支付JSAPI缺少参数：total_fee") {
						console.error("调用支付JSAPI缺少参数：total_fee");
					}
				}
			};
			WeixinJSBridge.invoke(brigeType, payParams, callback);
		};
		
		if(typeof WeixinJSBridge == "undefined") {
			if(document.addEventListener) {
				document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
			} else if(document.attachEvent) {
				document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
				document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
			}
		} else {
			onBridgeReady();
		}
		
	}
};

class Payment{
	constructor(options){
		var that = this;
		this.options = {
			vm : null,
			onConfirm(){},
			onCancel(){}
		};
		
		this.options = Object.assign(this.options, options);
		
		if(getUrlParameter("payfrom", window.location.href)){
			
			this.options.vm.$dialog.confirm({
				title : "支付确认",
                message : "请确认微信支付是否已完成",
			  	confirmButtonText : "完成支付",
			  	cancelButtonText : "未完成"
			}).then(() => {

                that.options.onConfirm();
            }).catch(() => {

                that.options.onCancel();
            });
		}
	}
	
	/**
	 * 支付
	 */
	pay(payType, res, successCallback, failCallback){
		
		// 阿里支付
		if(payType == "alipay"){
			location.href = res;
		}

		// 微信h5
		if(payType == "wechatH5Pay"){
			
			var redirect = encodeURIComponent(utils.addUrlParam("payfrom", "wechat", window.location.href));
			var forward = res + "&redirect_url=" + redirect;
			location.href = forward;	
		}

		// 微信公众号
		if(payType == "wechatJSPay"){
			res = JSON.parse(res);
			
			// 微信环境调用微信支付
			if(privateMethods.canUseWxPay()) {
				privateMethods.getWxPay({
					"appId": res.appId, 			//公众号名称，由商户传入     
					"timeStamp": res.timeStamp+"", 	//时间戳，自1970年以来的秒数     
					"nonceStr": res.nonceStr, 		//随机串     
					"package": res.package,		//订单详情扩展字符串
					"signType": res.signType, 				//微信签名方式：     
					"paySign": res.paySign 		//微信签名 
				}, successCallback, failCallback);	
			}	
		}
	}
}

export default Payment
