<template>
	<div class="hello" style="background: #07C160;height: 100vh;">
		<input type="text"/>
		
		<divider v-if="true" :style="{ padding: '0 50px' }">我是有底线的</divider>
		<van-button type="danger" @click="jump">危险按钮</van-button>
	</div>
</template>

<script>
	// import "../assets/demo.less"
	import { Button, Divider, Toast } from 'vant';
	import { back } from '@/libs/util';
	export default {
		beforeRouteEnter(to, from, next){
			//to.meta.keepAlive = false
			next()
		},
		name : "test",
		props: {
			msg: String
		},
		components: {
			vanButton: Button,
			Divider
		},
		mounted() {
//			Toast("123")
//			this.$toast("555")
		},
		methods : {
			
			jump(){
				
				this.$router.push({path : "/demo/HelloWorld", query :{d:123}})
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>