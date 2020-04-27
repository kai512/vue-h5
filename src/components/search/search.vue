<template>
    <div class="search-pop" v-if="isShow">
        <div class="flex-v" style="height: 100%;">
            <div class="search-box">
                <div class="van-search" style="background: rgb(255, 255, 255);">
                    <div class="van-search__content van-search__content--round">
                        <div class="van-cell van-cell--borderless van-field">
                            <div class="van-field__left-icon">
                                <i class="van-icon van-icon-search"><!----></i>
                            </div>
                            <div class="van-cell__value van-cell__value--alone van-field__value">
                                <div class="van-field__body">
                                    <input type="search" v-model="keyword" placeholder="中文/拼音/首字母/手机号" class="van-field__control" v-focus @input="inputChange" @keyup.enter="inputChange">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div role="button" tabindex="0" class="van-search__action" @click="canelSearch">取消</div>
                </div>
            </div>
            <div class="flex-v f1" style="overflow-y: auto;">
                <div class="history" v-if="searchHistory && searchHistory.length > 0 && !keyword">
                    <div class="tit b-border">历史记录</div>
                    <div class="cell-list">
                        <div class="cell b-border" v-for="(item, index) in searchHistory" :key="index">
                            <label>{{item}}</label>
                            <i class="icon-pre icon-del" @click="deleteWord(item, index)"></i>
                        </div>
                    </div>
                    <a class="btn b-border" @click="clearHistory">清空搜索记录</a>
                </div>
                <slot></slot>
                
            </div>
        </div>
    </div>
</template>
<script>

export default {
    data(){
        return {
            isShow : false,
            keyword : "",
            searchResult : null
        }
    },
    props : {

    },
    computed : {
        searchHistory(){

            return this.$store.state.search.historyWord
        }
    },
    methods : {
        show(){

            this.isShow = true
        },
        canelSearch(){

            this.isShow = false;

            // 清除搜索足迹
            this.keyword = "";
            this.$emit("search", this.keyword);
            
            // 取消回调
            this.$emit("cancel-search");
        },

        deleteWord(value, index){
            this.searchHistory.splice(index, 1)
        },

        /**
         * 输入监听
         */
        inputChange(){
            this.$emit("search", this.keyword);
            
        },

        /**
         * 清除历史记录
         */
        clearHistory(){

            this.$store.commit("setHistoryWord", []);

        },

        /**
         * 添加缓存
         */
        addHistoryWord(){
            let keyword = this.keyword.trim();
            keyword && this.$store.commit("setHistoryWord", keyword)
        }

    }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/style/color.less';
    .search-pop{
        background: #f2f5f5;
        position: fixed;
        z-index: 17;
        left: 0;
        top:0;
        right: 0;
        bottom: 0;
        color: #888;
        .icon-time{
            margin-right: 8px;
        }
        .icon-time::before{
            content: "\e93d";
            font-family: icon;
            color: #bbb;
        }
        .icon-del::before{
            content: "\e906";
            font-family: icon;
            color: #bbb;
        }
        .btn{
            display: block;
            padding: 12px;
            background: white;
            font-size: 13px;
            text-align: center;
            position: relative;
            color: #999;
            &::before{
                content: "\E947";
                font-family: icon;
            }
        }
    }

    .search-box{
		position: relative;
    }

	// 搜索end
	.history{
		.tit{
			font-size: 16px;
			padding: 12px;
			padding-left: 24px;
			background: white;
			position:relative;
			color: #141414;
			&:after{
				left: 12px;
				right: 12px;
			}
			&::before{
				width: 3px;
				height: 15px;
				border-radius: 3px;
				background: @main-color;
				content: "";
				display: block;
				position: absolute;
				left: 12px;
				top:50%;
				margin-top: -7.5px;
			}
		}
    }

</style>
