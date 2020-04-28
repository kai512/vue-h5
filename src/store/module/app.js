import config from '@/config'
import routers from '@/router/module'
const {
	homeName
} = config

export default {
	state: {
		navList : []
	},
	getters: {

	},
	mutations: {
		setNavList(state, list) {
			let navList = []
			if(list) {
				navList = [...list]
			} else navList = [...routers] || []
			state.navList = navList
		}

	},
	actions: {

	}
}