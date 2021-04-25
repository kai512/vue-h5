<template>
    <div class='pay-type'>
        <div class="tit">选择支付方式</div>
		<radio-group v-model="payType">
		    <cell-group>
                <cell :icon="item.icon" :title="item.name" clickable @click="selectPayType(item)" v-for="(item, index) in payTypeList" :key="index">
                    <template #right-icon>
                        <c-radio :name="item.payType" checked-color="#26d199"/>
                    </template>
                </cell>
		    </cell-group>
		</radio-group>
    </div>
</template>

<script>
import { Cell, CellGroup, RadioGroup, Radio } from 'vant';
export default {
    components : {
        'c-radio' : Radio,
        Cell, CellGroup, RadioGroup
    },
    data() {
    	return {
    		payTypeList : [],
    		
    		payType : this.defaultPayType,
    		alipay : {
    			icon : "alipay",
    			name : "支付宝",
    			payType : "alipay"
    		},
    		
    		
    		wechatH5Pay : {
    			icon : "wechat",
    			name : "微信支付",
    			payType : "wechatH5Pay"
    		}
    		
    	}
    },
    props : {
    	defaultPayType : {
    		type : String,
    		default : ''
    	},
    	
    	defaultPay : {
    		type : Array,
    		default(){
    			
    			return ["alipay", "wechatH5Pay"]
    		}
    		
    	}
    	
    },
    mounted(){
    	
    	for(let i = 0, len=this.defaultPay.length; i<len; i++){
    		
    		this.payTypeList.push(this[this.defaultPay[i]]);
    		
    	}
    	
    },
    watch: {
    	defaultPayType(val, oldVal){
    		
    		this.payType = val;
    		
    		
    	}
    	
    },
    methods:{
    	
    	/**
    	 * 选择支付方式
    	 */
		selectPayType(item){
			
			this.payType = item.payType;
			
			$emit("selected-success", item);
		}
    }
};
</script>

<style lang="less" scoped>
	@import '~@/assets/style/color.less';
	.pay-type{
		.tit{
			font-size: 0.75rem;
			color: #26d199;
			padding: 0.75rem 1rem;
		}
		.van-icon-epay::before{
			content: "\e94f";
			font-family: icon;
			color: #d81e06;
			font-size: 1.25rem;
		}
		.van-icon-wechat{
			color: #00c901;
			font-size: 1.25rem;
		}
	}
</style>

