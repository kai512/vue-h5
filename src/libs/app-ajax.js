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
		showErrorMsg: true, // 失败后吐司
		autoShowWait: false, // 自动显示菊花
		loadingText: '正在加载', // 加载的提示语
		autoCloseWait: false, // 自动关闭菊花
		headers: {
			'base-params': JSON.stringify(authClient),
			'token': unescape(getToken() || '')
			//"token" : "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpblRpbWUiOjE1OTAxMTQ3ODY2NjAsImV4cGlyZVRpbWUiOjE1OTg3NTQ3ODY2NjAsIm1haWwiOiJjaGVueGlhb3dlaUBsaW5ld2VsbC5jb20iLCJwaG9uZSI6IjE4OTY1NjU2MDg3IiwiaWRlbnRpdHlUeXBlIjpudWxsLCJhcHBJZCI6IjFjN2U3NWMyMzUzMDQyZjE5YzEyMWIyN2MzZDY4MDNkIiwib3N0eXBlIjoiSDUiLCJ1c2VyVHlwZSI6MSwidXNlcklkIjoiNUMwOTg2QzZCOEU2MTZCRTRBRUJDRjg0MkJCMzg2MzIiLCJkZXZpY2VJZCI6Ikg1IiwiYWNjb3VudFVzZXJJZCI6IjVDMDk4NkM2QjhFNjE2QkU0QUVCQ0Y4NDJCQjM4NjMyIiwibG9naW5UZXJtaW5hbCI6bnVsbH0.Iq49UGLD9iO9W8iiP2KsVhp5qyR5YFD2rNHfq_ILZdW2Q9OZYPnWDnrZlUYKAQhXtjapsYjINaX137EMPii_qqIZK6a9sRdZ_SqDGMGlNVEbrtTZQ1IsD0UFIzekygqf2bSlD6gtEYs1vGQm-M7Dc2BBT9sHfNH7fs1jcqSm51R2ze2Y33PjSRkvIZ2HiDG7JWTPvB3aD5q8qb14DuAdIwOJhpPdC0V1uk8kALQFLVNjCsDu5vM6EyFqH6cN_UZW3V5MMHhCnZVubNtaD9_72NfboRCFvzS4qQPqZq1SdOQfl9zHccTW5MmXfiklxJB3lyBZnkE1uxV3ukIoBwXPIw"
		},
		isAsync: true
	}

	var ajaxParams = underscore.deepExtend(defaultParams, params)

	if((ajaxParams.type == 'GET' || ajaxParams.type == 'DELETE') && ajaxParams.data && typeof(ajaxParams.data) === 'object') {
		ajaxParams.params = ajaxParams.data
	}

	const baseUrl = config.serviceBaseUrl.base

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
                        return Promise.resolve(data.content || null, data);
                        break
                    case 2: // 回话过期或者未登录

                        break
                    default: // 失败或者其他

                        var message = data.message ? data.message : '有点忙开个小差，稍后再试~'
                        if(!ajaxParams.showErrorMsg) {
                            new Lw().$notify(message)
                        }
                            
                        return Promise.reject(message, data)
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

	ajaxParams.error = function(message) {
		ajaxParams['autoShowWait'] && new Lw().$toast.loading({
			message: '加载中...',
			forbidClick: true,
			loadingType: 'spinner',
			duration : 1
		});
        
        if(!ajaxParams.showErrorMsg) {
            new Lw().$notify(message)
        }
            
        return Promise.reject(message)        
	}

	try {
		// 交互方法
		return axiosUtils.postJson(ajaxParams)
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
		return _postJson(params)
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