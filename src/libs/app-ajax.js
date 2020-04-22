/**
 * axios的工具类 -- rest接口
 * @author jliangliang@linewell.com
 * @since 2018-07-03
 */
import axiosUtils from './ajax-utils-rest'
import cookies from './cookie'
import underscore from 'underscore-extend'
import config from '@/config'
import {getToken, getAppInfo} from '@/libs/util'

/**
 * json参数序列化
 * @param {Object} data  参数
 */
var _addUrlParam = function(data) {
	var postData = ''
	for(var key in data) {
		if(!postData) {
			postData = key + '=' + data[key]
		} else {
			postData += '&' + key + '=' + data[key]
		}
	}

	return postData
}

/* 基础通信参数  */
var _authClient = function() {
	
	let {areaCode, appId} = getAppInfo();
	var deviceId = cookies.getCookie('deviceId') || 'H5'
	var auth = {
		clientParams: {
			os: cookies.getCookie('os_type') || 'H5',
			network: '',
			deviceId: deviceId,
			appVersion: ''
		},
		areaCode: areaCode,
		appId: appId,
		loginTerminal: 2 // 用户来源
	}

	return auth
}

/**
 * 提交表单数据
 * @param {Object} params
 */
var _postJson = function(params) {
	var authClient = _authClient()

	// 默认参数
	var defaultParams = {
		service: '', // 服务的配置名称
		data: {}, // 发送的data
		params: {},
		success: function(d) {}, // 成功后回调
		error: null, // 失败后回调
		autoShowWait: false, // 自动显示菊花
		loadingText: '正在加载', // 加载的提示语
		autoCloseWait: false, // 自动关闭菊花
		headers: {
			'base-params': JSON.stringify(authClient),
			'token': unescape(getToken() || '')
			// "token" : "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpblRpbWUiOjE1Njc3NTQ5Nzg5ODIsInBob25lIjoiMTUwNjA2OTA1MjIiLCJpZGVudGl0eVR5cGUiOm51bGwsImFwcElkIjoiZjg0NzEwMzM5ZDdkNGM5ZWJjNTYyMWVhM2I1OGE0ZmEiLCJvc3R5cGUiOiJhbmRyb2lkIiwidXNlclR5cGUiOjEsInVzZXJJZCI6IjIxNWE4OTQ3ZmVjZTQzNDI4YTc3NGZmNGRiZjBiYmJiIiwiZGV2aWNlSWQiOiIwMDAwMDAwMC03ZGVkLTM4MmQtZmZmZi1mZmZmZjg5ZGY4YjYiLCJhY2NvdW50VXNlcklkIjoiMjE1YTg5NDdmZWNlNDM0MjhhNzc0ZmY0ZGJmMGJiYmIiLCJsb2dpblRlcm1pbmFsIjoxfQ.IxWzLW-nsSd7CZzFQof4oqlJfraBujizCBFdJUSl0wuSO8VNCuMUliBx_5LPYCC2KrHt0Dl6oyCNitdqxRmzs4ojFTuaniV4x-zIVjXwgocRJAX6VBbnCh9M_XFWx2TdGyt0phCaf8vV0ZfNmYboqszQoxPmYraB_JMHj_hfp-uOks9MRnEZ_Qn7RFMEvdPJZZ8cOX44QMpN6_bO5rlA43z0GDl27R4NoC-zKbi6Jjd6MBhovLwGbdPHX1VAQgATYs3xLKEzjBvrg2vdvabkrefIELJ6abMvgu1WTPtnQH3GIr38UurIjRs7QfZcHsmYcpsHy55Xa6ZuPaS3ytLSXg"
		},
		isAsync: true
	}

	var ajaxParams = underscore.deepExtend(defaultParams, params)

	if((ajaxParams.type == 'GET' || ajaxParams.type == 'DELETE') && ajaxParams.data && typeof(ajaxParams.data) === 'object') {
		ajaxParams.params = ajaxParams.data
	}

	const baseUrl = process.env.NODE_ENV === 'development' ? config.serviceBaseUrl.dev : config.serviceBaseUrl.pro

	// rest请求路径
	ajaxParams['url'] = baseUrl + params.service

	// 增加请求头部
	ajaxParams['beforeSend'] = function(config) {
		return config
	}

	// 成功回调方法重载
	ajaxParams.success = function(d) {
		ajaxParams['autoShowWait'] && new Lw().$toast.loading({
			message: '加载中...',
			forbidClick: true,
			loadingType: 'spinner',
			duration : 1
		});
		var data = typeof d.data === 'string' ? JSON.parse(d.data) : d.data
		try {
			if(data) {
				switch(data.status) {
					case 1: // 成功
						if(data.content) {
							if(params.success) {
								params.success.call(this, data.content, data)
							}
						} else {
							if(params.success) {
								params.success.call(this, null, data)
							}
						}
						break
					case 2: // 回话过期或者未登录

						break
					default: // 失败或者其他

						var message = data.message ? data.message : '有点忙开个小差，稍后再试~'
						if(params.error) {
							params.error.call(this, message, data)
						} else {
							new Lw().$notify(data.message)
						}
						break
				}
			}
		} catch(e) {
			// handle the exception
			//			ajaxParams["autoShowWait"] && new Lw().$vux.loading.hide();
			console.log(e)
		}
	}

	// 是否显示菊花
	ajaxParams['autoShowWait'] && new Lw().$toast.loading({
		message: '加载中...',
		forbidClick: true,
		loadingType: 'spinner',
		duration : 0
	});

	var errorFn = ajaxParams.error
	ajaxParams.error = function(d) {
		ajaxParams['autoShowWait'] && new Lw().$toast.loading({
			message: '加载中...',
			forbidClick: true,
			loadingType: 'spinner',
			duration : 1
		});
		var data = d.data
		if(errorFn) {
			errorFn(data.message, data)
		} else if(data) {
			new Lw().$notify(data.message)
		}
	}

	try {
		// 交互方法
		axiosUtils.postJson(ajaxParams)
	} catch(e) {
		// 去除加载状态
		ajaxParams['autoShowWait'] && new Lw().$toast.loading({
			message: '加载中...',
			forbidClick: true,
			loadingType: 'spinner',
			duration : 1
		});
	}
}

var exportsMethods = {
	/**
	 * 提交Json对象
	 * @param {Object} params 配置定义的key
	 */
	postJson: function(params) {
		_postJson(params)
	},

	/**
	 * 获取用户登录信息封装对象
	 */
	getAuthClient: function() {
		return {
			'base-params': JSON.stringify(_authClient()),
			'token': unescape(getToken() || "")
		}
	}
}

export default exportsMethods