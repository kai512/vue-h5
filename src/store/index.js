import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import search from './module/search'
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex)

export default new Vuex.Store({
	// plugins: [createPersistedState()],
	state: {
		//
	},
	mutations: {
		//
	},
	actions: {
		//
	},
	modules: {
		user,
		app,
		search
	}
})