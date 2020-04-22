import {
	login
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
	state: {
		token: getToken()
	},
	mutations: {

		setToken(state, token) {
			state.token = token
			setToken(token)
		}
	},
	getters: {},
	actions: {

		// 登录
		handleLogin({
			commit
		}, {
			userName,
			password
		}) {
			userName = userName.trim()
			return new Promise((resolve, reject) => {
				login({
					userName,
					password
				}).then(res => {
					const data = res.data
					commit('setToken', data.token)
					resolve()
				}).catch(err => {
					reject(err)
				})
			})
		},
		// 退出登录
		handleLogOut({
			state,
			commit
		}) {
			// commit('setToken', '')
			// commit('setAccess', [])
			// resolve()
		},
		// 获取用户相关信息
		getUserInfo({
			state,
			commit
		}) {
			return new Promise((resolve, reject) => {
				try {

					getUserInfo(state.token).then(res => {

					}).catch(err => {
						reject(err)
					})
				} catch(error) {
					reject(error)
				}
			})
		}
	}
}