<template>
    <div class="wel-app">
        <div ref="welApp" class="app"></div>
        <el-row :gutter="24">
            <el-col :span="8">
                <p class="text">近三十天注册数: <span>{{ census.last30Appregisttotal }}人</span></p>
            </el-col>
            <el-col :span="8">
                <p class="text">APP注册总数: <span>{{ census.totalAppRegisterCount }}人</span></p>
            </el-col>
            <el-col :span="8">
                <p class="text">用户总数: <span>{{ census.totalOwner }}人</span></p>
            </el-col>
        </el-row>
    </div>
</template>
<script>

import { getCensus } from '@/api/statistics'

function initHandler(data, max = 100) {
    var titleArr= [], seriesArr=[];
    const colors=[['#66bef1', '#d7e3fe'],['#7366f1', '#d7e3fe'],['#f16666', '#d7e3fe'], ['#f1a166', '#d7e3fe']]
    data.forEach(function(item, index){
        titleArr.push(
            {
                text:item.name,
                left: index * 24 + 11 + '%',
                top: '40%',
                textAlign: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: '16',
                    color: colors[index][0],
                    textAlign: 'center',
                },
            }        
        );
        seriesArr.push(
            {
                name: item.name,
                type: 'pie',
                clockWise: false,
                radius: [55, 60],
                itemStyle:  {
                    normal: {
                        color: colors[index][0],
                        shadowColor: colors[index][0],
                        shadowBlur: 0,
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                    }
                },
                hoverAnimation: false,
                center: [index * 24 + 12 +'%', '50%'],
                data: [{
                    value: item.value,
                    label: {
                        formatter: function(params){
                            return params.value + '人';
                        },
                        position: 'center',
                        show: true,
                        textStyle: {
                            fontSize: '14',
                            color: colors[index][0],
                            padding: [40, 4, 5, 6]
                        }
                    },
                }, {
                    value: max-item.value,
                    name: 'invisible',
                    itemStyle: {
                        normal: {
                            color: colors[index][1]
                        },
                        emphasis: {
                            color: colors[index][1]
                        }
                    }
                }]
            }    
        )
    });

    const option = {
        title:titleArr,
        series: seriesArr
    }

    return option;
}

const data = [
    {
        name: '今日注册',
        value: 54
    },{
        name: '近7天注册',
        value: 44
    },{
        name: 'APP新增用户',
        value: 35
    },{
        name: '活跃用户',
        value: 30
    }]
    
    export default {
        data() {
            return {
                census: {}
            }
        },
        mounted() {
            this.getCensus();
        },
        methods: {
            /**
             * desc 
             */
            setOption(data, max) {
                // 基于准备好的dom，初始化echarts实例
                var myChart1 = this.$echarts.init(this.$refs.welApp);
                myChart1.setOption(initHandler(data, max));
            },

            async getCensus() {
                try {
                    ({ data: { data: this.census} } = await getCensus());

                    const { totayRegisterTotal, last7Appregisttotal, totaynewcount, totalAliveOwner } = this.census;
                    let listData = [totayRegisterTotal, last7Appregisttotal, totaynewcount, totalAliveOwner]

                    listData.forEach((item, index) => {
                        data[index].value = item;
                    })

                    let newArr = JSON.parse(JSON.stringify(listData))
                    newArr.sort((v1, v2) => v2 - v1)

                    this.setOption(data, Number(newArr[0]) + 30)
                }catch(err) {
                    console.log(err)
                }
            },
        }
    }
</script>
<style lang="scss" scoped>
.wel-app {
    width: 100%;
    height: 245px;
    border-radius: 15px;
    overflow:hidden;
    margin-bottom: 20px;

    .app {
        width: 100%;
        height: 180px;
    }

    .text {
      width: 100%;
      text-align:center;
      font-size: 16px;
      color:#616060;
      height: 40px;
      line-height: 20px;

      >span {
          font-size: 18px;
          color: #585858;
      }
  }
}
</style>