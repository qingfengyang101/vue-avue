<template>
    <div ref="welDoor" class="map-position"></div>
</template>
<script>

function initDoorHandler(data) {
    const arrName = getArrayValue(data, "name");
    const arrValue = getArrayValue(data, "value");
    const sumValue = eval(arrValue.join('+'));
    const objData = array2obj(data, "name");
    const optionData = getData(data);
    function getArrayValue(array, key) {
        var key = key || "value";
        var res = [];
        if (array) {
            array.forEach(function(t) {
                res.push(t[key]);
            });
        }
        return res;
    }

    function array2obj(array,key) {
        var resObj = {};
        for(var i=0;i<array.length;i++){
            resObj[array[i][key]] = array[i];
        }
        return resObj;
    }

    function getData(data) {
        var res = {
            series: [],
            yAxis: []
        };
        for (let i = 0; i < data.length; i++) {
            res.series.push({
                name: '',
                type: 'pie',
                clockWise: false, //顺时加载
                hoverAnimation: false, //鼠标移入变大
                radius: [65 - i * 15 + '%', 55 - i * 15 + '%'],
                center: ["30%", "55%"],
                label: {
                    show: false
                },
                itemStyle: {
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: false
                    },
                    borderWidth: 5,
                },
                data: [{
                    value: data[i].value,
                    name: data[i].name
                }, {
                    value: sumValue - data[i].value,
                    name: '',
                    itemStyle: {
                        color: "rgba(0,0,0,0)",
                        borderWidth: 0
                    },
                    tooltip: {
                        show: false
                    },
                    hoverAnimation: false
                }]
            });
            res.series.push({
                name: '',
                type: 'pie',
                silent: true,
                z: 1,
                clockWise: false, //顺时加载
                hoverAnimation: false, //鼠标移入变大
                radius: [65 - i * 15 + '%', 55 - i * 15 + '%'],
                center: ["30%", "55%"],
                label: {
                    show: false
                },
                itemStyle: {
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: false
                    },
                    borderWidth: 5,
                },
                data: [{
                    value: 7.5,
                    itemStyle: {
                        color: "#E3F0FF",
                        borderWidth: 0
                    },
                    tooltip: {
                        show: false
                    },
                    hoverAnimation: false
                }, {
                    value: 2.5,
                    name: '',
                    itemStyle: {
                        color: "rgba(0,0,0,0)",
                        borderWidth: 0
                    },
                    tooltip: {
                        show: false
                    },
                    hoverAnimation: false
                }]
            });
            res.yAxis.push((data[i].value / sumValue * 100).toFixed(2) + "%");
        }
        return res;
    }

    const option = {
        backgroundColor:'#fff',
        title: {
            text: '门禁统计',
            top: 25,
            left: 30,
            textStyle: {
                fontSize: 16,
                fontWeight: '100',
                color:'#585858'
            }
        },
        legend: {
            show: true,
            top: "center",
            left: '70%',
            data: arrName,
            itemWidth: 30,
            itemHeight: 20,
            width:50,
            padding: [0, 5],
            itemGap: 25,
            formatter: function(name) {
                return "{title|" + name + "}\n{value|" + (objData[name].value) + "次}"
            },
            textStyle: {
                rich: {
                    title: {
                        fontSize: 12,
                        lineHeight: 16,
                        color: "rgba(0,0,0,.45)"
                    },
                    value: {
                        fontSize: 14,
                        lineHeight: 20,
                        color: "rgba(0,0,0,.85)"
                    }
                }
            },
        },
        tooltip: {
            show: true,
            trigger: "item",
            formatter: "{a}<br>{b}:{c}({d}%)"
        },
        color: ['#FF8700', '#ffc300', '#00e473', '#009DFF'],
        grid: {
            top: '20%',
            bottom: '48%',
            left: "30%",
            containLabel: false
        },
        yAxis: [{
            type: 'category',
            inverse: true,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0,
                inside: true,
                textStyle: {
                    color: "#ccc",
                    fontSize: 16,
                },
                show: true
            },
            data: optionData.yAxis
        }],
        xAxis: [{
            show: false
        }],
        series: optionData.series
    };

    return option
}



const data = [{
        name: "手机开门",
        value: 53211
    },
    {
        name: "门禁卡开门",
        value: 42111
    },
    {
        name: "人脸开门",
        value: 31711
    },
    {
        name: "通话开门",
        value: 21711
    }
];


export default {
    props: {
        doorList: {
            type: Array,
            default() {
                return []
            }
        }
    },
    watch: {
        doorList(to, from) {
            if (to) {
                this.setOption()
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

          if (!this.doorList.length) {
              return;
          }
          // 基于准备好的dom，初始化echarts实例
          var myChart = this.$echarts.init(this.$refs.welDoor);
          myChart.setOption(initDoorHandler(this.doorList));
        },
    }
}

</script>
<style lang="scss" scoped>
.map-position {
    width: 100%;
    height: 380px;
    background:#fff;
    border-radius:15px;
    overflow:hidden;
}
</style>