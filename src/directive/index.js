import directive from './directives'

const importDirective = Vue => {

	/**
	 * clipboard指令 v-draggable="options"
	 * options = {
	 *  value:    /在输入框中使用v-model绑定的值/,
	 *  success:  /复制成功后的回调/,
	 *  error:    /复制失败后的回调/
	 * }
	 */
	Vue.directive('clipboard', directive.clipboard)

	Vue.directive('focus', {
		inserted : function(el) {
			el.focus()
		}
	})
}

export default importDirective