import appAjax from "_libs/app-ajax"
export const login = ({ userName, password }) => {

}

/**
 * 获取用户信息 
 */
export const getUserInfo = () => {
	
	return new Promise(() => {
		appAjax.postJson({
			service : "/tongplatform/base/user-sso/v1/user/isLoginWithoutSdToken",
			type : "get",
			success(result){
				if(result) {
					resolve(result);
					return;
				}
				reject();
			},
			error(){
				reject()
			}
			
		})
		
	})
}

/**
 * 判断是否微信授权
 */
export const wechatAuthCheck = () => {
	
	return new Promise((resolve, reject) => {
		appAjax.postJson({
			service : "/tongplatform/base/user-sso/v1/user-third-info/third-auth-check",
			type : "get",
			success(result){
				if(result) {
					resolve(result);
					return;
				}
				reject();
			},
			error(){
				reject()
			}
		})
	})
}

