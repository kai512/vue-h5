<template>
	<div class="upload-wrap mt-m">
		<div class="weui-uploader attachment" :class="[classes]">
			<div class="weui-uploader__bd" :class="{small: size === 'small'}">
				
				<ul class="weui-uploader__files">
					<draggable :options="sortOptions" @end="sortEnd" element="div" class="js-sort-box" v-model="fileslist">
					<li class="weui-uploader__file sortable" v-for="(item, index) in fileslist" :index="index" :key="index">
						<i class="del-btn" @click="remove(index)"></i>
						<span>{{item.fileName}}</span>
						
					</li>
					</draggable>
				</ul>
				<div v-show="!readonly && fileslist.length < maxCount" class="weui-uploader__input-box" @click="add">
					<input v-if="!handleClick" ref="input" class="weui-uploader__input" type="file" :multiple="multiple"  @change="handleChange">
					<span @click="add">添加附件</span>
				</div>
			</div>
		</div>
	</div>
	
</template>

<script>
	import {getAuthClient} from "_libs/util";
	import oss from "_libs/oss-utils";
	import draggable from "_libs/vue-draggable";
	import underscore from "underscore-extend"
    import axios from 'axios'
    import config from "@/config"
	export default {
		props: {
			files : {
				type : Array,
				default : () => []
			},
			maxSize : {
				type : Number,
    			default : 2048
			},
			maxCount : {
				type : Number,
				default : 1
			},
			format: {
                type: Array,
                default () {
                   return  ['xls', 'xlsx', 'doc', 'docx', "pdf","txt"]
                }
            },
			multiple : {
				type : Boolean,
				default : true
			},
			otherData : {},
            otherParams : {
            	type: Object,
                default () {
                    return {
                    	header : getAuthClient()
                    	
                    };
                }
            },
            loadingStyle : {
            	type : String,
            	default : ""
            },
			readonly : {
				type : Boolean,
				default : false
			},
			// 是否接管+号的click事件，如果是，点击不弹出选择文件的框
			handleClick: {
				type: Boolean,
				default: false
			},
			uploadUrl: {
				type: String,
				default: config.UPLOAD_URL || `${config.serviceBaseUrl.base}/zuul/tongplatform/common/third-party-extranet/v1/attachment/upload-files`
			},
			size: {
				type: String,
				default: 'normal'
			},
			name: {
				type: String,
				default: config.UPLOAD_URL ? 'file' : "files"
			},
			params: {
				type: Object,
				default(){
					
					return {};
				}
			},
			classes : {
				type : String,
				default : "attachment"
			},
			sort : {
				type : Boolean,
				default : false
				
			},
			sortOptions: {
    			type : Object,
    			default() {
    				return {
    					animation: 400,
    					handle: '.sortable',
    					draggable: '.sortable',
    					disabled: !this.sort
    				}
    			}
    		}
		},
		components: {
			draggable
		},
		data(){
			
			return {
				flag : true,
				temParams : {},
				count : 0,
				fileslist : this.files
			}
		},
		methods: {
			
			/**
			 * 选择文件
			 */
			handleChange(e){
				
				const files = e.target.files;

                if (!files) {
                    return;
                }
                this.uploadFiles(files);
                this.$refs.input.value = null;
			},
			
			/**
			 * 上传处理
			 */
			uploadFiles(files){
				
				let postFiles = Array.prototype.slice.call(files);
                if (!this.multiple) postFiles = postFiles.slice(0, 1);

                if (postFiles.length === 0) return;

                postFiles.forEach(file => {
                    this.upload(file);
                });
			},
			
			/**
			 * 上传
			 */
			upload(file){
				
				// 限制格式
            	if (this.format.length) {
                    const _file_format = file.name.split('.').pop().toLocaleLowerCase();
                    const checked = this.format.some(item => item.toLocaleLowerCase() === _file_format);
                    if (!checked) {
                        this.handleFormatError(file);
                        return false;
                    }
                }

                // 限制大小
                if (this.maxSize) {
                    if (file.size > this.maxSize * 1024) {
                        this.handleMaxSize(file, this.fileList);
                        return false;
                    }
                }
                this.count++;
				
				this.loadingStyle == "wholeLoading" && this.$toast.loading({message : "正在上传", forbidClick: true, duration : 0});
                const before = this.beforeUpload(file);
                if (before && before.then) {
                    before.then(processedFile => {
                        if (Object.prototype.toString.call(processedFile) === '[object File]') {
                            this.post(processedFile);
                        } else {
                            this.post(file);
                        }
                    }, () => {
                        // this.$emit('cancel', file);
                    });
                } else if (before !== false) {
                	
                    this.post(file);
                } else {
                    // this.$emit('cancel', file);
                }
				
			},
			
			/**
			 * 上传交互
			 */
			post(file){
                
                let formData = new window.FormData()
				
				if(this.params) {
					for(let key in this.params) {
						formData.append(key, this.params[key])
					}
				}
                formData.append(this.name, file)
                
                // 上传
            	axios.post(this.uploadUrl, formData, this.otherParams)
					.then((response) => {
						if(this.$toast && this.$toast.loading && this.loadingStyle == "wholeLoading") {
							this.$toast.loading({message : "正在上传", forbidClick: true, duration : 1});
						}
						this.$refs.input.value = '';
						var ret = (response.data && response.data.content && response.data.content.length > 0) ? response.data.content[0] : {};
						
						// oss上传特殊处理
						if(config.UPLOAD_URL){
							
							ret = {
								filePath : oss.buildResizeUrl(config.UPLOAD_URL + "/" + this.temParams[file.name], null, null, 70),
								fileName : file.name,
								fileId : this.temParams[file.name]
							}
						}
						
						// 多图上传
						if(this.multiple){
							
							this.fileslist.push(ret);
						}else{
							this.fileslist = [ret];
						}
						
						this.count = this.fileslist.length;
						this.$emit("handle-success", ret);
					}).catch(function (error) {
						
						if(this.$toast && this.$toast.loading && this.loadingStyle == "wholeLoading") {
							this.$toast.loading({message : "正在上传", forbidClick: true, duration : 1});
						}
					    this.count--;
					    this.$emit("handle-error", error);
					});
			},
			
			/**
			 * 上传前函数
			 */
			beforeUpload(file){
				!this.flag && (this.temParams = {});
        		this.flag = true;
        		if(this.multiple && (this.count > this.maxCount)){
            		return false;
            	}
        		
        		this.$emit("before-upload", file, this.otherData);
        		
				if(config.UPLOAD_URL){
        			return new Promise((resolve) => {
	        			oss.getUploadParams(file, (data) => {
        					this.params = underscore.deepExtend(this.params, data);
        					this.flag = false;
        					this.temParams[file.name] = this.params.key;
        					resolve();
	        			}, ()=>{
		        			this.count--;
		        		})
	        			
	        		})
        		}
			},
			
			/**
        	 * 超过文件大小
        	 */
        	handleMaxSize(file){

        		let fileSize = this.maxSize > 1024 
        			? (parseFloat(this.maxSize / 1024).toFixed(2) + "M")
        			: (this.maxSize + "KB");
        		
        		this.$toast("请选择小于"+fileSize+"的文件");        		
        		
        		this.$emit("on-exceeded-size", file, this.otherData);
        	},
        	
        	/**
        	 * 文件格式有误
        	 */
        	handleFormatError(file){
        		
        		this.$toast("请上传正确的文件格式");
        		
        		this.$emit("on-format-error", file, this.otherData);
        	},
			
			add() {
				this.handleClick && this.$refs.input.click();
			},
			
			/**
			 * 排序回调
			 */
			sortEnd(e){
				
				if(e.newIndex != e.oldIndex) {
					this.$emit("handle-sort-end", this.fileslist, this.otherData);
        		}
			},
			
			/**
			 * 删除文件
			 */
			remove(index) {
				const fileList = this.fileslist;
                fileList.splice(index, 1);
                this.count--;
                this.$emit("remove-handle", this.fileslist);
			}
		},
		 watch: {
        	files: {
        		handler: function (val, oldVal) {     		
        			this.fileslist = val;
        		},
      			deep: true
        	}
        }
	}
</script>
<style lang="less" scoped>
@import url("../../assets/style/var.less");
.upload-wrap{
	padding: .75rem;
	background: white;
}
.weui-uploader:not(.attachment){
	margin-right: -.75rem;
	margin-bottom: -.75rem;
	
	.weui-uploader__info {
		color: #B2B2B2;
	}
	.weui-uploader__bd {
	  font-size: 0;
	  position: relative;
	  min-height: e('calc(33.3vw - 1.125rem + .75rem + 2px)');
	}
	.weui-uploader__bd>*{
		font-size: initial;
	}
	.weui-uploader__files {
		list-style: none;
		display: inline-block;
		vertical-align: top;
		font-size: 0;
		box-sizing: border-box;
	}
	
	.weui-uploader__file {
		display: inline-block;
		vertical-align: top;
		margin-right: .75rem;
		margin-bottom: .75rem;
		background: no-repeat center center;
		background-size: cover;
		border: solid 1px #e0e0e0;
		position: relative;
	}
	.weui-uploader__file .del-btn{
		width: 1.25rem;
		height: 1.25rem;
		background: rgba(0,0,0,.5);
		position: absolute;
		right: 0;
		top:0;
		border-radius: 0 0 0 0.3125rem;
		color: white;
	}
	.weui-uploader__file .del-btn:before{
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjIwN0EyQTZBOThCQTExRTlCQTkxODE0QjM5RjI0MEI4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjIwN0EyQTZCOThCQTExRTlCQTkxODE0QjM5RjI0MEI4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjA3QTJBNjg5OEJBMTFFOUJBOTE4MTRCMzlGMjQwQjgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjA3QTJBNjk5OEJBMTFFOUJBOTE4MTRCMzlGMjQwQjgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz50UvybAAADnklEQVR42uzcv4sTQRQH8PWRSkRFO3+UIjbWNv4DFmdjIYiWnhEr8bgo2ljc5ewUuVjYWiiicKWNnTYWcjZirZWIFoKCnOt75y5ILmd2N/Pj+2begy8pNtkk88luZmd2l8qyLDgHOA85nzhfOC84J6tlFvc5zXnF+V61+X3OflkmCw9xPpZba4Mzb43nPINycn3g7KOiKFY4B4utJcsecPqFlasacJa3WXaEc1MafW7KSlYNxTtGXXMCsqvBygzFP4bUbgFZb7hSQ/GLIfVWQJZarNxQ/GH8lucKyOMWLzIUPxhSVzgv/+2ODct21bcubOuu7dS2HF+RoUTEmARiKBExtgMxlEgY/wMxlAgY00AMpVluu2yjJm9oKAHbJtobG8ZsIIYSqC3afpBbhuL3hxm1R2EYbkByRQmyy4boexuGG5BcUIJ2ZqCOUnPHcAWSKkqUbj7keE6uGK5BUkGJegAMPfKZG4YvEK0oEENDKuYIcsHwDaIFBWrQVNVsWuoYoUBQUSCnE1TOOwfG2Ai51ao9GSAgxrmQbaT6DI3UMGKBxEKBx4gJEhpFBUZskFAoajAQQLqgLKSKgQLSBWWQIgYSiGsUlRhoIK5Q1GIggsyKohpD0gO8Nm9YPTa9Pq9+3l7OYosLLC9wHqF9+R2bm0kaF00W2jHq22eglmwp13PCQAdxjQKPoQHEFYoKDC0gs6KowdAE0hWl1IShDaTu2rbqRXIOa/qC2raQxQ6vW6660AYCgKEOpQf++WSXc6+6U86stTw2EmAgHTDkVlCXHK4THoUSwShbogwMxB+GHGecb9klhkXpJYAxfpzRdpQYa/cFNBcgI88jB/MZPqaDs5ugcoWhHiVFDNUoqWKoRUkZQyVK6hh1+lpQSGnXtm2NOJc1HKdQBhiqUCgTDDUolBGGChTKDAMehTLEgEahTDFgUShjDEgUyhwDDoUMAwuFDAMLhQwDC4UMAwuFDAMLpRcQ4xfnLOdZoadG1eNqCxSpYWiQLhhnOGuFvgqKQoaBtfsiw8BCIcPAQiHDwEIhw8BCIcPAQiHDwEIhw8BCIcPAQiHDwEIhw8BCIcPAQqlBDCM+yuY1kjLae9EwvKHUP/YmtcRZly3kqmHAbCnXBOSoYcCgHBOQb4YBg/JZQJ4YBgzKUwG5wXk/YeFPw/CCMl/8PdljvF5z7tS3id3DWeCc4uzkvOGscN5ZG3qpE/IHzjnO+cp5zrnL+fFHgAEAfOkPFmWAa04AAAAASUVORK5CYII=) no-repeat center;
		background-size: .75rem .75rem;
		content: "";
		display: block;
		width: 100%;
		height: 100%;
	}
	.weui-uploader__file,
	.weui-uploader__input-box{
		background-color: white;
		width: e('calc(33.3vw - 1.125rem)');
		height: e('calc(33.3vw - 1.125rem)');
	}
	
	.weui-uploader__file_status {
		position: relative;
	}
	
	.weui-uploader__file_status:before {
		content: " ";
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}
	
	.weui-uploader__file_status .weui-uploader__file-content {
		display: block;
	}
	
	.weui-uploader__file-content {
		display: none;
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		color: #FFFFFF;
	}
	
	.weui-uploader__file-content .weui-icon-warn {
		display: inline-block;
	}
	
	.weui-uploader__input-box {
		display: inline-block;
		vertical-align: top;
		position: relative;
		margin-right: .75rem;
		margin-bottom: .75rem;
		border: 1px dashed #e0e0e0;
	}
	
	.weui-uploader__input-box:before,
	.weui-uploader__input-box:after {
		content: " ";
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		background-color: #bbb;
	}
	
	.weui-uploader__input-box:before {
		width: 0.125rem;
		border-radius: 0.0625rem;
		height: 1.125rem;
	}
	
	.weui-uploader__input-box:after {
		width: 1.125rem;
		height: 0.125rem;
		border-radius: 0.0625rem;
	}
	
	.weui-uploader__input {
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	}
	
	
	
	&.single{
		.weui-uploader__input-box{
			position: absolute;
			left: 0;
			top:0;
			z-index: 1;
		}
		.weui-uploader__files{
			white-space: nowrap;
			width: e('calc(33.3vw - 1.125rem + 2px)');
			z-index: 3;
			overflow: hidden;
			position: relative;
			pointer-events: none;
		}
		.weui-uploader__file{
			pointer-events: auto;
		}
		
	}
}
.weui-uploader.attachment{
	.weui-uploader__file{
		padding: .5rem .75rem;
		background: #f2f5f5;
		margin-bottom:0.2rem;
		font-size: 0.75rem;
		display: block;
		position: relative;
		padding-left: 1.9375rem;
	}
	.weui-uploader__files{
		overflow: hidden;
	}
	.del-btn{
		position: absolute;
		left: .2rem;
		top:.3rem;
		display: inline-block;
		vertical-align: top;
		width: 1.5rem;
		height: 1.5rem;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY2NzAwMUQ0OThDNTExRTlCNjVDRjVCMzNBNjk5MDg1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY2NzAwMUQ1OThDNTExRTlCNjVDRjVCMzNBNjk5MDg1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjY3MDAxRDI5OEM1MTFFOUI2NUNGNUIzM0E2OTkwODUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjY3MDAxRDM5OEM1MTFFOUI2NUNGNUIzM0E2OTkwODUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4ulG2GAAADgklEQVR42uycS2xNQRzGp+3tI14lUbSJV8TOm9ImniFCCBEqEgtprCUS3VjYCQlhg42FRxChCI3dreiKhWejiIVnkHoErYpGS33/nGnSXGfknnPunDv39vuSX6RzdDrnlznvmUkkk0llIcVgs2YeGAcKVbzpA+3gPmgE58GvTP8RGzu1EDwGZ8E6UJUFeZICUAnWgFPgCVjkukDpcTfAVOVepui2bXJV4BxwBpQodyOnltO6rU4JlMPlmOPy+jMEHNVtjpxEhhq1DNQYtn0H90BvzKKKdE8r99lWC5aAFlcEbjCUt+ht37LU20aAC2CVoc0trhzC033KfoOtWZQn6QT1ui2pmebSObDKp+wFeO/AOa/d0I4KlwSW+pR1O3Th6LNVcaFiKJACKXDwJjHgGVaeEUeFrGeMT9lkkHRkPzPdvq/Ke8PTKAIbwEELjR4GVjjceaK2rw7slEN4Fw/E0Gko1I87TLiMFIGX6CF0Lso5cIf+YSMYSidppQtckXNgQj9wb9MwvA+kQAqkQMa6wFnK++Y7OsLfngiWR6yjQtcxIeLj7AwwNg6B8qHmHHgAroGXyvtwHTR7lPfGuhm8CXkHUK9/t1m3Y3eIOmTUxHPQqry31oeDVlAQcGjHFuUNkRiYD2A86EmzjrngbkpZt+5FnwL0PJFXNqDsj/K+wrWmu+/gmfp3EIB8bLpqqwcu8CmTrj8pQB3VPmUiYmaAOmanyOvfl5oAdVQq/xEUS20ewqWG8rIgvT5g3X4pzsD+mD7pltgUyFAgBVIgBTIUSIEUSIEMBVIgBVIgBTIUSIEUSIEMBVIgBVIgQ4EUSIEUyFAgBVIgBTKuCuwylH8OUMcXQ3nnYBB4HXxMKZMhw3cC1CH/92FKmYxYbRoMAmWu7WJwWYs7DlYrb4huuunVv3MCtClvvt9K5S3yE2sSWTp1yNjkqIuAyXIm23kR4UWEAhkKpEAKpEAmFoHdebTvphlJPTYFvjOUz89BgbX/uUG3JrDNUL5feRMAcyUysfGAYdtTm49yN/WzbOoaWzL9VKawymKzHY7LG668ecJFPtvkTVHSpkBZSv0Q2GvozdU5fl48An7YvgrLrO5WlX95BPbFcRvzE6wFr/JI3mvlrQHRFdd94Ft95W3KA3nygrcmbIeI8j5Q1jdYr28H6vW/snZCuePCOnQHuA1OgltRKvsrwAAU74qu0OD3EwAAAABJRU5ErkJggg==)no-repeat center;
		background-size: 1rem;
	}
	.weui-uploader__input-box{
		line-height: 2.5rem;
		height: 2.5rem;
		background: #f2f5f5;
		text-align: center;
		color: @main-color;
		position: relative;
		font-size:0.9375rem;
		input{
			display: block;
			width: 100%;
			height: 100%;
			opacity: 0;
			position: absolute;
			left: 0;
			top:0;
		}
	}
	.weui-uploader__input-box span{
		display: block;
		pointer-events: none;
	}
	.weui-uploader__input-box span:before{
		content: "\e922";
		font-family: icon;
		font-size: 1.2rem;
		margin-right: .2rem;
		line-height: 1.40625rem;
		display: inline-block;
		vertical-align: top;
		margin-top: .6rem;
	}
}
</style>