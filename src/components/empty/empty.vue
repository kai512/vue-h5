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

</style>
