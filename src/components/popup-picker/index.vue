<template>
    <div>
        <field :input-align="inputAlign" :disabled='disabled' 
            @click="onClick" readonly clickable name='idTypeStr' 
            v-model='textName' :label="title" is-link :placeholder="placeholder" 
            :required='required' :rules='rules' class="field-pop">
        </field>		
         <popup v-model="showPop" position="bottom">
			<picker
				show-toolbar
				:columns="data"
                :title='popupTitle'
                :confirm-button-text='confirmButtonText'
                :cancel-button-text='cancelButtonText'
				@confirm="onConfirm"
				@cancel="onCancel"
			/>
		</popup>

    </div>
</template>

<script>
import { Field, Popup, picker } from 'vant'
export default {
    components : {
        Field, Popup, picker
    },
    data(){

        return {
            showPop : false,
            textName : ''
        }
    },
    props : {
        popupTitle : String,
        title : String,
        confirmButtonText : String,
        cancelButtonText : String,
        inputAlign : {
            type : String,
            default : 'right'
        },
        rules : {
            type : Array,
            default(){
                return [];
            }
        },
        required : {
            type : Boolean,
            default : false
        },
        placeholder : String,
        disabled : {
            type : Boolean,
            default : false
        },
        value : {
            type : Array,
            default(){

                return [];
            }
        },

        data : {
            type : Array,
            default(){

                return [];
            }

        }

    },
    methods : {
        onClick () {
            if (!this.disabled) this.showPop = true
        },
        onConfirm(value){

            this.$emit('input', typeof value == 'object' ? [{...value}] : [value]);

            this.showPop = false;

        },
        onCancel(){

            this.showPop = false;
        }

    },
    watch : {

        value(v){

            if(!v || v.length <= 0) {
                this.textName = '';
                return;
            }

            if(typeof v[0] == 'string') this.textName = v[0];

            if(typeof v[0] == 'object') this.textName = v[0].text;
        }
    }
}
</script>
<style lang="less" >
    .van-cell:not(:last-child):after{
        right: 0.75rem;
        left: 0.75rem;
    }
</style>