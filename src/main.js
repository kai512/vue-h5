import '_libs/base'
import App from './App.vue'
import router from './router'
import store from './store'
import VueTouch from 'vue-touch';
Lw.config.productionTip = false
Lw.use(VueTouch)

new Lw({
	
	el: '#app',
	render: h => h(App),
	router,
	store
})
