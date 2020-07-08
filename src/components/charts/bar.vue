<template>
	<div style="height: 350px;" ref="dom"></div>
</template>

<script>
	import echarts from 'echarts'
	import tdTheme from './theme.json'
    import { on, off } from '@/libs/tools'
    import underscore from "underscore-extend";
	echarts.registerTheme('tdTheme', tdTheme)
	export default {
		name: 'ChartBar',
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
            }
        },
		mounted() {
			this.$nextTick(() => {
				this.defaultOptions = {
                    
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c}',
                        confine: true
                    },
                    xAxis: {
                        type: 'category',
                        data: [],
                        axisPointer: {
                            type: 'shadow'
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            interval: 0,
                            showMinLabel: true,
                            showMaxLabel: true,
                        }
                    },
                    yAxis: {
                        type: 'value',
                        splitLine: {
                            show: false
                        }
                    },
                    series: [
                        {
                            data: [],
                            type: 'bar',
                            label: {
                                show: true,
                                position: 'top',
                                fontSize: 11
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