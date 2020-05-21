<template>
	<div style="height: 300px;" ref="lineDom"></div>
</template>

<script>
	import echarts from 'echarts'
	import tdTheme from './theme.json'
    import { on, off } from '@/libs/tools'
    import underscore from "underscore-extend";
	echarts.registerTheme('tdTheme', tdTheme)
	export default {
		name: 'LineBar',
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

                if(this.lineDom){
                    this.defaultOptions = underscore.deepExtend(this.defaultOptions, params);

				    this.lineDom.setOption(this.defaultOptions)
                }
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
                this.lineDom = echarts.init(this.$refs.lineDom, 'tdTheme')
                
                this.defaultOptions = underscore.deepExtend(this.defaultOptions, this.options);

				this.lineDom.setOption(this.defaultOptions)
				on(window, 'resize', this.resize)
			})
		},
		beforeDestroy() {
			off(window, 'resize', this.resize)
		}
	}
</script>