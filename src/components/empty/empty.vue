<template>
    <div class="empty-box">
        <span>{{msg}}</span>
    </div>
</template>

<script>
export default {
    data() {
    	return {}
    },
    props : {
        msg : {
            type : String,
            default : "暂无数据"
        }
    },
    watch: {
    },
    methods:{

    }
};
</script>
<style lang="less" scoped>
    @import '~@/assets/style/color.less';

    //空白页
    .empty-box{
        &.bg-white{
            background-color: white;
        }
        background: url(../../assets/images/empty-bg.png)  center 5rem no-repeat;
        background-size: auto 7.5rem;
        height: 20rem;
        box-sizing: border-box;
        padding-top: 14rem;
        text-align: center;
        color: #999;
        font-size: 0.9375rem;
        span{
            display: block;
        }
        .btn{
            font-size: 0.9375rem;
            color: @main-color;
            border:solid 1px @main-color;
            line-height: 2.1875rem;
            padding: 0 1rem;
            min-width: 6.25rem;
            text-align: center;
            border-radius: 1.125rem;
            box-sizing: border-box;
            display: inline-block;
            vertical-align: top;
            margin-top: 0.9375rem;
        }
    }

    //空白页
</style>
