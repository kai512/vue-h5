<template>
	<popup class="select-list" value="true"  position="bottom" v-model="show">
		<div class="list" style="overflow-y: auto;">
			<div class="tit b-border" v-if="showTitle">{{title}}</div>

			<slot>
				<div class="cell b-border" v-for="(item, index) in selectList" :key="index" @click="selectItem(item)">{{item.name}}</div>
			</slot>
		</div>
		<a class="btn" @click="cancelPopup">取消</a>
	</popup>
</template>

<script>
	import { Popup } from 'vant';
	
	export default {
		data(){
			return {
				show : false
			}
		},
		props : {
			showTitle : {
				type : Boolean,
				default : false
			},
			title : String,
			selectList : {
				type : Array,
				default(){
					return [];
				}
			}
		},
		components : {
			Popup
		},
		methods : {

			cancelPopup(){

				this.show = false;
				this.$emit("cancelPopup")
				

			},
			showPopup(){

				this.show = true;
			},
			selectItem(value){

				this.$emit("select-callback", value)
			}
		}
	}
</script>

<style lang="less">
	@import '~@/assets/style/color.less';
	.van-popup--bottom.select-list{
		margin: 12px;
		width: calc(100% - 24px);
		background: none;
	}
	.van-popup--bottom.select-list .flex-v{
		height: 100%;
	}
	.van-popup--bottom.select-list .list{
		text-align: center;
		background: white;
		border-radius: 10px;
	}
	
	.van-popup--bottom.select-list .list .tit{
		font-size: 16px;
		color: #bbbbbb;
		padding: 12px;
		position: relative;
	}
	.van-popup--bottom.select-list .list .cell{
		padding: 12px;
		position: relative;
		overflow: hidden;
		color: @main-color;
	}
	.van-popup--bottom.select-list .btn{
		padding: 12px;
		border-radius: 10px;
		display: block;
		text-align: center;
		background: white;
		margin-top: 12px;
	}
	.van-popup--bottom.select-list .list .icon-pre{
		margin-right: 6px;
		font-size: 18px;
	}
	.icon-void::before{
		content: "\E945";
	}
	.icon-phone::before{
		content: "\E944";
	}
	.icon-camera::before{
		content: "\E943";
	}
	.icon-landline::before{
		content: "\E942";
	}
</style>
