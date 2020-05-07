<template>
   <div class="mian-content">
		<div class="page-500">
			<span>啊哦…内部服务器出错了！</span>
			<!--<a>返回首页</a>-->
		</div>
	</div>
</template>

<script>
export default {
    data() {
    	return {}
    },
    watch: {
    },
    methods:{

    }
};
</script>
<style lang="less" scoped>
@import url("../../assets/style/var.less");
.page-401,
.page-500,
.page-505,
.page-404{
    background: url(../../assets/images/404-bg.png) center 1rem no-repeat;
    padding-top: 3.125rem;
    height: 14.375rem;
    padding-top: 9.375rem;
    background-size: 15.53125rem 7.84375rem;
    position: absolute;
    top:46%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
}
.page-500{
    background: url(../../assets/images/500-bg.png) center 1rem no-repeat;
    background-size: 15.28125rem 7.84375rem;
}
.page-401{
    background: none;
    padding-top: 0;
    height: auto;
}
.page-500 span,
.page-404 span{
    display: block;
    font-size: 0.9375rem;
    color: #999;
    text-align: center;
}
.page-500 a,
.page-404 a{
    display: block;
    margin: 1.125rem auto;
    width: 5rem;
    height: 1.75rem;
    line-height: 1.75rem;
    font-size: .75rem;
    color: @main-color;
    text-align: center;
    border:solid 1px currentColor;
    border-radius: 0.1875rem;
}
</style>

