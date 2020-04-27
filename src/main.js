import '_libs/base'
import App from './App.vue'
import router from './router'
import store from './store'
import VueTouch from 'vue-touch';

import importDirective from '@/directive'

// mock的时候可以开起来
//if (process.env.NODE_ENV !== 'production') require('@/mock')
Lw.config.productionTip = false
Lw.use(VueTouch)


/**
 * 注册指令
 */
importDirective(Lw)

new Lw({	
	el: '#app',
	render: h => h(App),
	router,
	store
})
