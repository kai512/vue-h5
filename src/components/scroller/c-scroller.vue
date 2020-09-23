<template>
	<scroller :use-pullup="usePullup" :pullup-config="pullupConfig" @on-pullup-loading="loadMore"
	    :use-pulldown="usePulldown" :pulldown-config="pulldownConfig" @on-pulldown-loading="refresh"
	    lock-x ref="scrollerBottom" :height="contentHeight">
	    
	    <div>
	    	<!--有数据的列表-->
	    	<div v-if="list && list.length">
	    		<slot></slot>
	    	</div>
	    	
	    	<!--默认空界面-->
	    	<div v-else-if="list && list.length <= 0">
	    		<slot name="empty">
					<empty :msg='emptyTips'></empty>
	    		</slot>
	    	</div>
	    	<divider v-if="isNoMore" :style="{ padding: '0 50px' }">我是有底线的</divider>
	    </div>
	</scroller>
</template>
<script>
	import appAjax from '@/libs/app-ajax'
	import { Divider } from 'vant';
	import Scroller from './Scroller.vue'
    import underscore from "underscore-extend";
    import empty from "@/components/empty/empty"
	var privateMethods = {
		
		/**
		 * 获取列表
		 * @param {Object} callback
		 */
		getList : function(callback, failCallback){
			var that = this;
			appAjax.postJson({
				service : this.serviceUrl,
				data : this.sendData,
				otherParams : this.otherParams,
				type : this.type || "get"
			}).then(data => {
                if(!data || data.length < that.sendData.pageSize){
						
                    that.sendData.type == "UP" ? that.isNoMore = true : that.isNoMore = false;
                    that.$refs.scrollerBottom.disablePullup();
                }else{
                    
                    that.isNoMore = false;
                    that.$refs.scrollerBottom.enablePullup();
                    
                }
                callback && callback(data);
            }).catch(() => {
				failCallback && failCallback();
            })
		}
	};
    export default {
        
        data () {
            return {
            	sendData : {
            		pageSize : 10,
	    			lastdate : 0,
	    			type : "DOWN"
            	},
            	
            	list : null,
            	isNoMore : false
            }
        },
       	props : {
       		serviceUrl : String,
       		postData : {
       			type : Object,
       			default(){
       				
       				return {}
       			}
       			
       		},
       		contentHeight : String,
       		usePullup : {
       			type : Boolean,
       			default : true
       			
       		},
       		usePulldown : {
       			type : Boolean,
       			default : true
       			
       		},
       		useAutoRefresh : {
       			type : Boolean,
       			default : true
       		},
       		type : String,
       		otherParams : {
       			type : Object,
       			default(){
       				
       				return null;
       			}
       			
       		},
       		pullupConfig : {
       			default(){
       				return {
       					content: '',
						pullUpHeight: 60,
						height: 48,
						autoRefresh: false,
						downContent: '释放后加载',
						upContent: '上拉加载更多',
						loadingContent: '加载中...',
						clsPrefix: 'xs-plugin-pullup-'
       				}
       			},
       			type : Object
       		},
       		pulldownConfig : {
       			default(){
       				return {
       					content: '下拉刷新',
						height: 40,
						autoRefresh: false,
						downContent: '下拉刷新',
						upContent: '释放后刷新',
						loadingContent: '正在刷新...',
						clsPrefix: 'xs-plugin-pulldown-'
       				}
       			},
       			type : Object
       		},
       		emptyTips : {
       			type : String,
       			default : "暂无数据"
       		}
       	},
        components: {
	    	Scroller,
            Divider,
            empty
	  	},
        mounted(){
        	this.sendData = underscore.deepExtend(this.sendData, this.postData);
        	
        	// 如果自动刷新
        	if(this.useAutoRefresh){
        		this.refresh();
	    	  	this.$nextTick(() => {
			  		this.$refs.scrollerBottom.reset()
			 	})
        	}
        	
        },
        methods: {
        	
        	/**
        	 * 上拉
        	 */
        	loadMore(){
        		this.sendData.type = "UP"; 
        		this.list.length > 0 && (this.sendData.lastdate = this.list[this.list.length - 1].lastdate || 0);
        		
        		privateMethods.getList.call(this, (data)=>{
        			
        			if(data && data.length > 0){
        				var ret = this.list.concat(data);
        				
        				this.list = ret;
        				this.$emit("on-pullup-loading", ret);
        			}
        		
        			this.$refs.scrollerBottom.donePullup()
					this.$nextTick(() => {
				  		this.$refs.scrollerBottom.reset()
				  	})	
        		}, ()=>{
        			this.$emit("on-error");
        			
        			this.$refs.scrollerBottom.donePullup()
					this.$nextTick(() => {
				  		this.$refs.scrollerBottom.reset()
				  	})	
        			
        		});
			},
			
			/**
			 * 下拉
			 */
			refresh(){
				this.sendData.type = "DOWN"; 
				this.sendData.lastdate = 0;
				privateMethods.getList.call(this, (data)=>{
					this.list = data || [];
					
        			this.$emit("on-pulldown-loading", this.list);
        			
		   			this.$refs.scrollerBottom.donePulldown()
					this.$nextTick(() => {
					  	this.$refs.scrollerBottom.reset({top : "0"})
					})
        		
        		}, ()=>{
        			this.$emit("on-error");
        			
        			this.$refs.scrollerBottom.donePulldown()
					this.$nextTick(() => {
					  	this.$refs.scrollerBottom.reset({top : "0"})
					})
        			
        		});
				
			},
			
			/**
			 * 过滤数据
			 */
			filterData(data){
				
				this.sendData = underscore.deepExtend(this.sendData, data || {});
				this.refresh();
			}
    		
        }
    }
</script>
