<template>
    <div :id="domId" ref="qrcode"></div>
</template>
<script>

import QRCode from 'qrcodejs2'
export default {
    data(){

        return {


        }
    },
    props: {
        config : {
            type : Object,
            default(){
                return {}
            }
        },

        domId : String
    },
    mounted(){

        new QRCode(this.domId, this.config)
    }
}
</script>>