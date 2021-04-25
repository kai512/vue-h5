<template>
	<div>
		<div :class="['send', btnWaiting ? 'hide' : '']" @click='getCode'>{{btnStr}}</div>
		<div :class="['send', 'disabled', btnWaiting ? '' : 'hide']">{{count}}秒</div>
	</div>
</template>

<script>
	import validRule from '@/libs/field-validate-rules.js'
	
	import { getVerifyCode } from './api'
	import { Toast } from 'vant';
	export default {
		
		props : {
			phone : String
		},
		data(){		
			return {
				btnStr : '获取验证码',
				count : 60,
				btnWaiting : false
			}
		},
		mounted(){
			
			
		},
		methods : {
			getCode(){
				
				if(!this.phone){
					Toast("请输入手机号");
					return;
				}
				
				if(!validRule.phone.regex.test(this.phone)) {
					Toast(validRule.phone.errorMsg);
					return;
				}
				
				if(this.btnWaiting) return;
				
				
				getVerifyCode(this.phone).then((data) => {
					this.btnWaiting = true;
					this.count--;

					let timeTiok = setInterval(() => {

						this.count--;
						
						if(this.count == 0){
							clearInterval(timeTiok)
													
							this.btnWaiting = false;
							
							this.count = 60;
							
							this.btnStr = '重新获取'
							
						}
					}, 1000)
				}, () => {
					this.btnWaiting = false;
					
					this.count = 60;
					this.btnStr = '获取验证码'
				})
				
				
			}
		}
	}
</script>

<style lang="less">
	
.send{
   position: relative;
   padding: 0 0 0 20rpx;
   height: 88rpx;
   line-height: 88rpx;
   text-align: center;
   /*color: $uni-color-primary;*/
   color:#06857a;
   font-size: 30rpx;
   z-index: 5;

}
.send::before{
   width: 1px;
   left: 0;
   top:24rpx;
   bottom: 24rpx;
   content: "";
   display: block;
   background: #e0e0e0;
   position: absolute;
   -webkit-transform: scaleX(.5);
   transform: scaleX(.5);
}
.send.disabled{
	color: #bbb;
}
</style>
