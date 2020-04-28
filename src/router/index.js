import Router from 'vue-router'
import modules from './module'
import store from '@/store'

import { setToken, getToken, setTitle, setAppInfo, initNativeBack } from '@/libs/util'
import { canTurnTo } from '@/libs/login-filter'
import config from '@/config'

const {
	homeName
} = config

Lw.use(Router)
if (window.history && window.history.pushState) {
    window.onpopstate = function() {
    }
}
const router = new Router({
	routes : [...modules],
	mode: 'history'
})

/**
 * 权限判断 
 */
const turnTo = (to, from, next) => {
	
	canTurnTo(to, from).then(() => {
		
		next();
	}).catch(() => {
		next({
			replace: true,
			path: '/404'
		}) // 无权限，重定向到401页面
	})
}
router.beforeEach((to, from, next) => {
	
	setAppInfo(to).then(() => {
		turnTo(to, from, next)
	})
	
})
router.afterEach(to => {
	setTitle(to, router.app)
	
	initNativeBack();
})

export default router