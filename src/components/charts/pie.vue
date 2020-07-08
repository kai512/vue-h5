<template>
	<div ref="dom" style="height: 300px;"></div>
</template>

<script>
	import echarts from 'echarts'
	import tdTheme from './theme.json'
    import { on, off } from '@/libs/tools'
    import underscore from "underscore-extend";
	echarts.registerTheme('tdTheme', tdTheme)
	export default {
		name: 'ChartPie',
		props: {
			value: Array,
			options : {
                type : Object,
                default(){
                    return {};
                }
            }
		},
		data() {
			return {
                dom: null,
                defaultOptions : {}
			}
            
		},
		methods: {
			resize() {
				this.dom.resize()
            },
            
             /**
             * 过滤
             */
            setOption(params){

                if(this.dom){
                    this.defaultOptions = underscore.deepExtend(this.defaultOptions, params);

				    this.dom.setOption(this.defaultOptions)
                }
            }
        },
        watch : {
            options(newData){
                this.setOption(newData);
            },

            value(newData){
                this.setOption({series : [{data : newData}]});
            }
        },
		mounted() {
			this.$nextTick(() => {
				// let legend = this.value.map(_ => _.name)
				this.defaultOptions = {
                    
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c} ({d}%)',
                        confine: true
                    },
                    legend: {
                        left: 10,
                    },
                    series: [
                        {
                            type: 'pie',
                            avoidLabelOverlap: true,
                            labelLine: { // 设置指示线的长度
                                normal: {
                                    length: 8,
                                    // length2: 8
                                }
                            },
                            label: {
                                show: true,
                                align: 'left',
                                formatter: '{b}\n{d}%',
                                textStyle: {
                                    fontSize: 11
                                },
                            },
                            data: this.value,
                            itemStyle: {
                                borderWidth: 3, //设置border的宽度有多大
                                borderColor: '#fff',
                            },
                        }
                    ]
        
				}
                this.dom = echarts.init(this.$refs.dom, 'tdTheme')
                
                this.defaultOptions = underscore.deepExtend(this.defaultOptions, this.options);

				this.dom.setOption(this.defaultOptions)
				on(window, 'resize', this.resize)
			})
		},
		beforeDestroy() {
			off(window, 'resize', this.resize)
		}
	}
</script>