<template>
    <div class="wel-quarters">
        <div class="layout-title-r">
            <el-select v-model="value" style="position:absolute;z-index:100;left:120px;top:15px;" @change="handleFilter" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.quartersId"
                    :label="item.name"
                    :value="item.quartersId">
                </el-option>
            </el-select>
        </div>
        <div ref="quarters" class="statistics"></div>
        <el-row :gutter="24">
            <el-col :span="6">
                <p class="text">今日新增用户: <span>{{ quarters.quarterNewOwner }}</span></p>
            </el-col>
            <el-col :span="6">
                <p class="text">小区用户总数: <span>{{ quarters.quarterTotal }}</span></p>
            </el-col>
            <el-col :span="6">
                <p class="text">小区今日活跃用户: <span>{{ quarters.quartertotayaliveOwner }}</span></p>
            </el-col>
            <el-col :span="6">
                <p class="text">小区今日注册量: <span>{{ quarters.quartertotayreg }}</span></p>
            </el-col>
        </el-row>
    </div>
</template>
<script>

import { getQuarterOwner, getCensus, getQuarterByRole } from '@/api/statistics'

const option = {
    title: {
        text: '小区统计',
        left: '20',
        top: 5,
        textStyle: {
            color: '#585858',
            fontSize: '16'
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        top: 100
    },
    legend: {
        data:['小区注册用户','小区活跃用户'],
        right:'30',
        top: 30,
        icon: 'rect',
        orient: 'vertical'
    },
    xAxis: {
        type: 'category',
        data: [],
        axisTick: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        splitNumber: 7,
        axisTick: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#727171',
                shadowColor: '#727171',
                shadowOffsetY: -20
            }
        }
    },
    series: [
        {
            name:'小区注册用户',
            type:'line',
            color:'#7a8ef0',
            lineStyle: {
                
            },
            symbol: 'circle', //标注所有数据点
            data:[]
        },
        {
            name:'小区活跃用户',
            type:'line',
            color:'#e37cf6',
            data:[]
        }
    ]
};


export default {
    props: ["appObj"],
    data() {
        return {
            quarters: [],
            options: [],
            value: ''
        }
    },
    created() {
        this.getQuarterByRole();
    },
    mounted() {
        this.setOption()
    },
    methods: {
        /**
         * desc 
         */
        setOption() {
            if (!this.appObj) { return }
          // 基于准备好的dom，初始化echarts实例
          var myChart = this.$echarts.init(this.$refs.quarters);
          myChart.setOption(option, true);
        },

        handleFilter() {
          this.getQuarterOwner();
        },

        async getQuarterByRole() {
          try {
            ({ data: { data: this.options } } = await getQuarterByRole())

            if (Array.isArray(this.options) && typeof this.options[0] === 'object') {
              this.value = this.options[0].quartersId
              await this.getQuarterOwner();
            }
            
          }catch(err) {
            console.log(err)
          }
        },

        async getQuarterOwner() {
          try {
            ({ data: { data: this.quarters } } = await getQuarterOwner({ quarterId: this.value }))
            
            let data = []
            let series = []
            let alivetotal = []

            this.quarters.reslist.forEach(item => {
              data.push(item.key)
              series.push(item.total)
              alivetotal.push(item.alivetotal)
            })

            data.splice(0, 7)
            series.splice(0, 7)
            alivetotal.splice(0, 7)
            option.xAxis.data = data.map(item => item.substring(5))

            // console.log(alivetotal, series)
            
            option.series[0].data = series
            option.series[1].data = alivetotal

            this.$nextTick(() => {
              this.$echarts.init(this.$refs.quarters).setOption(option, true)
            })
          }catch(err) {
            console.log(err)
          }
        }
    }
}
</script>
<style lang="scss" scoped>
.wel-quarters {
  height: 520px;
  width: 100%;
  background: #fff;
  border-radius: 15px;
  position:relative;

  .statistics {
    padding-top: 20px;
    width: 100%;
    height: 460px;
  }

  .text {
      width: 100%;
      text-align:center;
      font-size: 14px;
      color:#616060;
      height: 40px;
      line-height: 20px;

      >span {
          font-size: 16px;
          color: #1d1d1d;
      }
  }
}


</style>