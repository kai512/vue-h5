
import appAjax from '_libs/app-ajax';

/**
 * 获取验证码
 */
export const getVerifyCode = (phone) => {
	
	return appAjax.postJson({
		type : "POST",
		autoShowWait : true,
		service : `/tongplatform/base/user-info/v1/user/get-register-vertify-code`,
		data : {
			phone : phone
		}
	})
	
}
