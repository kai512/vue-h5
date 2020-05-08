import appAjax from "@/libs/app-ajax"

/**
 * 获取oss上传参数
 */
export const getUploadParams = () => {
	
	return new Promise((resolve, reject) => {
		appAjax.postJson({
			service: '/tongplatform/common/third-party-extranet/v1/alioss/token-for-pc',
			type: 'GET',
			data: {
				size: 1
			},
			success(data) {
				resolve(data)
			},
			error() {
				reject()
			}
		})
		
	})
}