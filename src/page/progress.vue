<template>
<div :ref="ref1" class="wel-progress"></div>
</template>
<script>

function initHandler1(arrayData, title, max) {
    const colors = ['#a17af0', '#7a9bf0', '#a1d266', '#f0a17a'];
    const yAxisData = ['今日', '昨日', '本周', '本月']
    const series = [];

    yAxisData.forEach((item, index) => {
        series.push(
            {
                type: 'bar',
                barWidth: 20,
                barGap: '80%',
                barCategoryGap: 100,
                data: [
                    {
                        value: max,
                        itemStyle: {
                            color: '#d7e3fe'
                        },
                        label: {
                            show: true,
                            position: 'right',
                            formatter: (d) => {
                                return arrayData[index] + ' 次'
                            },
                            fontSize: 14,
                            color: '#585858',
                            offset: [5, 0],
                            itemStyle: {
                                color: '#d7e3fe'
                            },
                        },
                    },
                    {
                        value: arrayData[index],
                        itemStyle: {
                            color: colors[index]
                        },
                        label: {
                            show: true,
                            position: 'left',
                            formatter: (d) => {
                                return item
                            },
                            fontSize: 14,
                            color: '#585858',
                            offset: [-10, 2],
                        },
                        barGap: '-100%',
                    }
                ]
            }
        )
    })

    const option = {

        title: {
            text: title,
            left: 25,
            top: 25,
            textStyle: {
                fontSize: 16,
                color:'#585858'
            }
        },

        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            },
            extraCssText:'width:auto;height:auto;'
        },

        grid: {
            x: 60,
            y:55,
            x2:60,
            y2: 0,
            containLabel: true,
            show: false
        },

        xAxis: {
            type: 'value',
            show: false,
            nameTextStyle:{
                color: '#8597c1',
                fontStyle: 8,
                padding:[0,0 ,-26 ,-8]
            },
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            axisLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            splitLine:{
                show:false
            },
            axisTick:{
                show:false
            },
            data: ['']
        },
        series: series
    };

    return option
}

export default {
    props: {
        ref1: {
            type: String,
            default: ''
        },
        appObj: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    watch: {
        appObj(to, from) {
            if (to) {
                this.setOption();
            }
        }
    },
    mounted() {
        this.setOption()
    },
    methods: {
        /**
         * desc 
         */
        setOption() {
            const { appObj: { list, title, max, ref } } = this;

            if (!list.length) {
                return;
            }
            
            // 基于准备好的dom，初始化echarts实例
            var myChart1 = this.$echarts.init(this.$refs[this.ref1]);
            
            myChart1.setOption(initHandler1(list, title, max));
        },
    }
}
</script>
<style lang="scss" scoped>
.wel-progress {
    width: 100%;
    height: 254px;
    border-radius: 15px;
    overflow:hidden;
    background:#fff;
}
</style>