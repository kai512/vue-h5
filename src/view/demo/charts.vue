<template>

    <div class="page">
        <div class="main-content economy">
            <div class="flex-v" style="height: 100vh;">
                <div class="f1" style="overflow-y: auto;">
                    <div class="info-list" v-if="totalValue">
                        <template v-for="(item, index) in totalValue.gdpForm">
                            <div class="cell b-border" :key="index+'a'">
                                <div class="tit">{{item.label}}</div>
                                <div class="dl">
                                    <div class="val">{{item.value}}</div>
                                    <div class="count">
                                        <div class="dd">增长率<b :class="item.growthRateColor == 1? 'red':'blue'">{{item.growthRate}}</b></div>
                                        <div class="dd">目标增长<b class="blue">{{item.goalGrowthRate}}</b></div>
                                    </div>
                                </div>
                            </div>
                        </template>

                    </div>
                    <h2 class="g-tit b-border mt-m">三大产业机构比重</h2>
                    <div class="chart-card">
                
                        <!--此处放图表-->
                        <pie :value="pieData" :options="pieParams"></pie>
                      
                    </div>
                    <h2 class="g-tit b-border mt-m">近四季度生产总值走势图</h2>
                    <div class="chart-card">
                        <bar :options="barParams"></bar>
                    </div>
                    <h2 class="g-tit b-border mt-m">二三产业走势图</h2>
                    <div class="chart-card">
                        <chart-Line :options="lineParams"></chart-Line>
                    </div>
                    <h2 class="g-tit b-border mt-m">行业分类情况（万元）</h2>

                    <div class="data-list" v-if="totalValue">
                        <template v-for="(item, index) in totalValue.industryCategoryForm">
                            <div class="cell b-border" :key="index+'b'">
                                <img class="icon" :src="'data:image/png;base64,'+item.base64Icon"/>
                                <div class="info">
                                    <div class="name">{{item.label}}</div>
                                    <div class="val-box">
                                        <span class="val">{{item.value}}</span>
                                        <span class="change" :class="(item.growthRateColor == 1 || !item.growthRateColor)? 'red':'green'">{{item.growthRate}}</span>
                                        <i v-if="item.growthRate != '-'" class="b-icon-pre" :class="item.growthRateColor == 1? 'b-icon-up':'b-icon-down'"></i>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>

import { getChartsData } from "@/api/data";
import { pie, bar, chartLine } from "@/components/charts"
import { resetLabel } from "@/components/charts/util"
export default {
    components : {
        pie,
        bar,
        chartLine
    },
    data(){
        return {
            totalValue : null,
            pieData : [],
            pieParams : {

                 legend: {
                    left: 'center',
                    bottom: '10',
                    icon: 'circle',
                    itemWidth: 10,
                    itemHeight: 10,
                },
                series: [
                    {
                        radius: ['43%', '65%'],
                        label: {
                            show: true,
                            formatter: '{b}\n{d}%',
                            align: 'left'
                        }
                    }
                ]
            },
            barParams : {},

            lineParams : {},
        }
    },
    mounted(){
        this.renderTotalValue();
    },
    methods : {
        renderTotalValue(){

            getChartsData().then(data => {
                if (data) {
                    this.totalValue = data;

                    this.pieData = data.thirdIndustrySGPie;
                
                    this.renderBarOrPie(data.nearlyFourQuartersGDP);
                    this.renderLine(data.secondThirdIndustryLine);
                }
            })
        },

        /**
         * 渲染柱状图和折线图
         */
        renderBarOrPie(data, elem) {
            data.series.forEach((item, index) => {
                if (item.type != 'bar') {
                    item.label = {
                        show: false
                    };

                    item.yAxisIndex = 1;
                } else {
                    item.barWidth = 25;
                    item.barCategoryGap = '35%';

                    // 类型转换
                    item.data.forEach(child => {
                        child.value = parseInt(child.value);
                    })
                }
            });

            this.barParams =  {
                grid: {
                    top: '50',
                    bottom: '40'
                },
                legend: {
                    left: 'center',
                    // bottom: '0%'
                },
                xAxis: {
                    type: 'category',
                    data: data.xAxis ? data.xAxis : [],
                    axisLabel: {
                        formatter: function (params) {
                            return resetLabel(params, 5)
                        },
                        rich: {
                            a: {
                                lineHeight: 10,
                            },
                            b: {
                                lineHeight: 15,
                            },
                        }
                    }
                },
                yAxis: {
                    name: '单位：亿元',
                },
                grid : {
                    left: '20%',
                    right: 30
                },
                yAxis : [
                    {
                        name: '单位：万元',
                    },
                    {
                        name: '单位：%',
                    }
                ],
                series: data.series || []
            }

            this.barParams.xAxis.axisLabel.formatter = function (params) {
                return resetLabel(params, 5);
            }
        },

        /**
         * 渲染折线图
         */
        renderLine(data){
            data.series.forEach((item, index) => {
   
                item.barWidth = 25;
                item.barCategoryGap = '35%';

                // 类型转换
                item.data.forEach(child => {
                    child.value = parseInt(child.value);
                })
            });

            this.lineParams = {
                grid: {
                    top: '50',
                    bottom: '40'
                },
                legend: {
                    left: 'center',
                    // bottom: '0%'
                },
                xAxis: {
                    type: 'category',
                    data: data.xAxis ? data.xAxis : [],
                    axisLabel: {
                        formatter: function (params) {
                            return resetLabel(params, 5);
                        },
                        rich: {
                            a: {
                                lineHeight: 10,
                            },
                            b: {
                                lineHeight: 15,
                            },
                        }
                    }
                },
                yAxis: {
                    name: '单位：亿元',
                },
                series: data.series || []
                
            };

        }
    }
}
</script>
<style scoped lang="less">
@import '~@/assets/style/color.less';

h2.g-tit{
    display: flex;
    padding: .75rem;
    background: white;
    color: #141414;
    font-size: 0.9375rem;
    position: relative;
    font-weight: normal;
    span{
        flex: 1;
    }
    em{
        font-size: 0.8125rem;
        font-style: normal;
        line-height: 1.5rem;
        margin-left: .75rem;
        color: #999;
    }
    &:before{
        content: "";
        background: @main-color;
        width: 0.15625rem;
        height: 0.9375rem;
        border-radius: 0.09375rem;
        display: inline-block;
        vertical-align: top;
        margin-right: 0.75rem;
        margin-top: 0.3125rem;
    }
    .btn{
        position: absolute;
        right: .75rem;
        top:.75rem;
        color: @main-color;
    }
}
.economy{
    .red{
        color: #ff3b30;
    }
    .blue{
        color: #5c9eff;
    }
    .green{
        color: #27d098;
    }
    .info-list{
        .b-icon-pre{
            margin-left: .2rem;
        }
        .b-icon-up:before{
            content: "\E963";
            color: #ff3b30;
        }
        .b-icon-down:before{
            content: "\E964";
            color: #27d098;
        }
        .cell{
            position: relative;
            background: white;
            padding: 0.75rem;
            &:after{
                left: 0.75rem;
                right: 0.75rem;
            }
            .tit{
                font-size: 0.875rem;
                display: flex;
                span{
                    flex: 1;
                }
                .btn{
                    font-size: 0.75rem;
                    padding: 0 0.75rem;
                    line-height: 1.5rem;
                    border-radius: 0.78125rem;
                    border: solid 1px currentcolor;
                    color: #5c9eff;
                }
            }
            .dl{
                display: flex;
                align-items: center;
            }
            .val{
                font-size: 1.75rem;
                min-width: 8.25rem;
                padding-right: .5rem;
            }
            .count{
                flex: 1;
                .dd{
                    font-size: 0.875rem;
                    b{
                        font-weight: normal;
                        margin-left: .2rem;
                    }
                }
            }
        }
    }
    .chart-card{
        padding: .75rem;
        background: white;
        &>div{
            box-shadow: 0 0 1px rgba(0,0,0,.2);
        }
    }
    .data-list{
        &.has-charts {
            .card{
                flex: 1;
                display: flex;
                padding: .75rem;
                box-shadow: 0 .25rem .5rem rgba(0,0,0,.05);
            }
            .info{
                display: flex;
                justify-content: center;
                flex-direction: column;
                .val-box{
                    margin-top: .3rem;
                }
            }
            .cell:not(:first-child){
                padding-top: 0;
            }
        }
        .cell{
            background: white;
            padding: 0.75rem;
            position: relative;
            display: flex;
            &:after{
                left: .75rem;
                right: .75rem
            }
            .icon{
                width: 3rem;
                height: 3rem;
            }
            .chart{
                width: 6.1875rem;
                height: 6.1875rem;
                &:empty{
                    background: #f3f3f3;
                }
            }
            .info{
                flex: 1 1 0;
                margin-left: .3rem;
            }
            .name{
                color: #666;
                font-size: 0.875rem;
            }
            .val-box{
                display: flex;
            }
            .val{
                flex: 1 1 0;
                font-size: 1.5rem;
                line-height: 1.2;
            }
            .b-icon-pre{
                margin-left: .2rem;
            }
            .b-icon-up:before{
                content: "\E963";
                color: #ff3b30;
            }
            .b-icon-down:before{
                content: "\E964";
                color: #27d098;
            }
        }
    }
    .data-list-row{
        font-size: 0;
        background: white;
        .b-icon-pre{
            margin-left: .2rem;
        }
        .b-icon-up:before{
            content: "\E963";
            color: #ff3b30;
        }
        .b-icon-down:before{
            content: "\E964";
            color: #27d098;
        }
        .cell{
            display: inline-block;
            vertical-align: top;
            text-align: center;
            width: 33.3%;
            padding-bottom: .5rem;
            .icon{
                width: 4.375rem;
                height: 4.375rem;
                margin: .5rem auto;
            }
            .name{
                font-size: 0.875rem;
                color: #666;
            }
            .val{
                font-size: 1.25rem;
            }
            .change{
                font-size: 0.875rem;
            }
        }
    }


    .table-box{
        border:solid 1px #e0e0e0;
        table{
            margin-right: -1px;
            margin-bottom: -1px;
            min-width: e('calc(100% + 1px)');
            border-collapse:collapse;
            font-size: 0.875rem;
        }
        td,th{
            border-right: solid 1px #e0e0e0;
            border-bottom: solid 1px #e0e0e0;
            padding: .5rem;

        }
        th{
            color: #666;
            font-weight: normal;
        }
        .center{
            text-align: center;
        }
    }
}

</style>>