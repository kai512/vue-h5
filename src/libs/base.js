import Vue from 'vue'
import '../assets/style/var.less'
import '../assets/style/icon-font.css'
import '../assets/style/b-icon-font.css'
import '../assets/style/custom.less'
import { Notify, Toast, Dialog } from 'vant';
Vue.use(Notify);
Vue.use(Toast);
Vue.use(Dialog);
Toast.setDefaultOptions('text', {
	position: "bottom"
})
window.Lw = Vue

window.mui = {}

