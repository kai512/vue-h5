<template>
	<div class="hello" style="background: #00A1E9;height: 100vh;">
		<van-button type="danger" @click="jump">危险按钮</van-button>
		<divider v-if="true" :style="{ padding: '0 50px' }">我是有底线的</divider>
	</div>
</template>

<script>
	// import "../assets/demo.less"
	import { Button, Divider } from 'vant';
	import { back } from '@/libs/util';
	export default {
		props: {
			msg: String
		},
		components: {
			vanButton: Button,
			Divider
		},
		mounted() {
			console.log(33)
		},
		methods : {
			
			jump(){
				
				this.$router.push({path : "/demo/test"})
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>