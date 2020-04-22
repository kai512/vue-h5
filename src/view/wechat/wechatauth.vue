<template>

</template>

<script>
	import { getParams } from '@/libs/util'
	export default {
		/**
	 * 路由守卫
	 */
		beforeRouteEnter (to, from, next){
			
			// TODO 进行交互获取token
			next({path : decodeURIComponent(to.query.service), replace:true})
			
		},
		props: {
		},
		components: {
		},
		mounted() {

		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>