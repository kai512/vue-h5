<template>
	<div id="app">
		<v-touch :swipe-options="{direction: 'horizontal', threshold: 50}">
			<!--threshold 设置左右滑动的距离-->
			<transition :name="transitionName">
				<keep-alive :include="cacheList">
					<router-view></router-view>
					<!--这里是会被缓存的组件-->
				</keep-alive>
			</transition>

		</v-touch>
	</div>
</template>

<script>
	import routers from '@/router/routers'
	import { mapMutations, mapActions, mapGetters } from 'vuex'
	export default {
		name: 'app',
		data() {
			return {
				transitionName: window.navigator.userAgent.indexOf('innoApp') > -1 ? 'slide-left' : ''
			}
		},
		computed: {
			navList () {
		      	return this.$store.state.app.navList
		    },
			cacheList () {
		      	const list = [...this.navList.length ? this.navList.filter(item => (item.meta && item.meta.keepAlive)).map(item => item.name) : []]
		      	return list
		    }
		},
		watch: {
			$route(to, from) {
				
				// 在城市通APP
				if(window.navigator.userAgent.indexOf('innoApp') > -1) {
					let isBack = window.mui.isBack //  监听路由变化时的状态为前进还是后退
					if(isBack) {
						this.transitionName = 'slide-right'
					} else {
						this.transitionName = 'slide-left'
					}
					window.mui.isBack = false
				}
				
				// TODO
				this.setNavList()
			}
		},
		mounted() {

		},
		methods: {
			...mapMutations([
				'setNavList'
			])
		}
	}
</script>
<style lang="less" scoped>
	#app {
		width: 100%;
		-webkit-overflow-scrolling: touch; // 处理苹果滑动卡顿效果
		/*overflow-x: hidden;*/
		/*transform: scale(.5);
       transform-origin: center 0; */
	}
	/*.appView {
	  position: absolute;
	  width:100%;
	  transition: transform 0.3s;
	  height: 100vh;
	}*/
	
	.slide-left-enter-active,
	.slide-left-leave-active,
	.slide-right-enter-active,
	.slide-right-leave-active {
		position: absolute;
		top: 0;
		width: 100%;
		transition: transform 0.4s;
	}
	
	.slide-left-enter {
		transform: translate3d(100%, 0, 0);
	}
	
	.slide-left-leave-active {
		transform: translate3d(-100%, 0, 0);
	}
	
	.slide-right-enter {
		transform: translate3d(-100%, 0, 0);
	}
	
	.slide-right-leave-active {
		transform: translate3d(100%, 0, 0);
	}
	/*.slide-left-enter,
    .slide-right-leave-to {
        -webkit-transform: translateX(100%);
        transform: translateX(100%);
    }
    .slide-right-leave-active {
        z-index: 2;
    }*/
</style>