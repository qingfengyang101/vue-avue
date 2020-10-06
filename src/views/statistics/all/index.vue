<template>
  <div class="app-container">
    
    <div class="statistics-layout">
      <div class="layout-title">
        <p class="layout-title-l">小区统计</p>
        <div class="layout-title-r">
          <el-select v-model="value" @change="handleFilter" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.quartersId"
              :label="item.name"
              :value="item.quartersId">
            </el-option>
          </el-select>
        </div>
      </div>
      <el-row>
        <el-col :span="4">
          <div style="padding: 20px">
            <div>
              <div style="color: #909399;font-size: 14px">今日新增用户</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{ quarters.quarterNewOwner }}</div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">小区用户数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{ quarters.quarterTotal }}</div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">小区今日活跃用户</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{ quarters.quartertotayaliveOwner }}</div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">小区今天注册量</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{ quarters.quartertotayreg }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <!-- <el-date-picker
              style="float: right;z-index: 1"
              size="small"
              v-model="orderCountDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
              :picker-options="pickerOptions">
            </el-date-picker> -->
            <div>
              <div ref="main" style="width: 100%;height:500px;"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="out-border">
            <div class="layout-title">APP详情统计</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="4" class="color-danger overview-item-value">{{ census.totalAppRegisterCount }}</el-col>
                <el-col :span="2" class="color-danger overview-item-value">{{ census.totayRegisterTotal }}</el-col>
                <el-col :span="4" class="color-danger overview-item-value">{{ census.last7Appregisttotal }}</el-col>
                <el-col :span="4" class="color-danger overview-item-value">{{ census.last30Appregisttotal }}</el-col>
                <el-col :span="2" class="color-danger overview-item-value">{{ census.totaynewcount }}</el-col>
                <el-col :span="4" class="color-danger overview-item-value">{{ census.totalOwner }}</el-col>
                <el-col :span="4" class="color-danger overview-item-value">{{ census.totalAliveOwner }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="4" class="overview-item-title">app注册总数</el-col>
                <el-col :span="2" class="overview-item-title">今日注册数</el-col>
                <el-col :span="4" class="overview-item-title">近7天注册数</el-col>
                <el-col :span="4" class="overview-item-title">近30天注册数</el-col>
                <el-col :span="2" class="overview-item-title">今日APP新增用户</el-col>
                <el-col :span="4" class="overview-item-title">用户总数</el-col>
                <el-col :span="4" class="overview-item-title">活跃用户</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="out-border">
            <div class="layout-title">APP主页访问次数</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">{{ appObj.visitsAppindextotay }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ appObj.visitsAppindexCurweek }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ appObj.yesterday }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ appObj.visitsAppindexCurrmonth }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">今日</el-col>
                <el-col :span="6" class="overview-item-title">本周</el-col>
                <el-col :span="6" class="overview-item-title">昨天</el-col>
                <el-col :span="6" class="overview-item-title">本月</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="out-border">
            <div class="layout-title">商城访问量</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">{{ shopObj.visitsshopindextotay }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ shopObj.visitsShopindexCurweek }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ shopObj.yesterdayshop }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ shopObj.visitsShopindexCurrmonth }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">今日</el-col>
                <el-col :span="6" class="overview-item-title">本周</el-col>
                <el-col :span="6" class="overview-item-title">昨天</el-col>
                <el-col :span="6" class="overview-item-title">本月</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import { getCensus, getQuarterOwner, getAppindex, getShopindex, getQuarterByRole } from '@/api/statistics'
import { getDay } from "@/util/date.js"

export default {
    data() {
        return {
            loading: false,
            dataEmpty: false,
            orderCountDate: '',
            chartSettings: {
                xAxisType: 'time',
                area:true,
                axisSite: { right: ['orderAmount']},
                labelMap: {'orderCount': '订单数量', 'orderAmount': '订单金额'}},
                chartData: {
                columns: [],
                rows: []
            },
            value: '',
            census: {},
            appObj: {},
            shopObj: {},
            quarters: {},
            options: [],
            day: {},
            option: {
              type: 'value',
              xAxis: {
                  //type: 'category',
                  showMaxLabel: true,
                  data: [],
                  axisLabel:{
                    interval:0,//0：全部显示，1：间隔为1显示对应类目，2：依次类推，（简单试一下就明白了，这样说是不是有点抽象）
                    //rotate:-30,//倾斜显示，-：顺时针旋转，+或不写：逆时针旋转
                    }
              },
              yAxis: {
                  type: 'value'
              },
              series: [{
                  data: [21, 23, 234],
                  type: 'line'
              }]
            }
        }
    },
    mounted() {
      // // 基于准备好的dom，初始化echarts实例
      //   var myChart = this.$echarts.init(this.$refs.main);
        
      //   // 指定图表的配置项和数据
      //   var option = {
      //       xAxis: {
      //           type: 'category',
      //           data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      //       },
      //       yAxis: {
      //           type: 'value'
      //       },
      //       series: [{
      //           data: [820, 932, 901, 934, 1290, 1330, 1320],
      //           type: 'line'
      //       }]
      //   };

      //   // 使用刚指定的配置项和数据显示图表。
      //   myChart.setOption(this.option);
      this.setOption();
    },
    created() {
      this.initDate()
      this.getCensus();
      this.getAppindex();
      this.getShopindex();
      this.getQuarterByRole();
    },
    methods: {

        /**
         * desc 
         */
        setOption() {
          // 基于准备好的dom，初始化echarts实例
          var myChart = this.$echarts.init(this.$refs.main);
          myChart.setOption(this.option);
        },

        initDate() {
          let day = {}
          for (let i = 0; i < 15; i++) {
            day[getDay(-i)] = 0;
          }

          this.day = day;
        },
        async getCensus() {
          try {
            ({ data: { data: this.census} } = await getCensus())
          }catch(err) {
            console.log(err)
          }
        },

        async getAppindex() {
          try {
            ({ data: { data: this.appObj } } = await getAppindex())
          }catch(err) {
            console.log(err)
          }
        },

        async getShopindex() {
          try {
            ({ data: { data: this.shopObj } } = await getShopindex())
          }catch(err) {
            console.log(err)
          }
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

        handleFilter() {
          this.getQuarterOwner();
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

            this.option.xAxis.data = data.map(item => item.substring(5))
            
            this.option.series.data = series

            this.$nextTick(() => {
              
              this.$echarts.init(this.$refs.main).setOption({
                type: 'value',
                // title: {
                //     text: '小区用户统计'
                // },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                  data:['小区注册用户', '小区活跃用户']
                },
                xAxis: {
                    //type: 'category',
                    showMaxLabel: true,
                    data: data.map(item => item.substring(5)),
                    axisLabel:{
                      interval:0,//0：全部显示，1：间隔为1显示对应类目，2：依次类推，（简单试一下就明白了，这样说是不是有点抽象）
                      //rotate:-30,//倾斜显示，-：顺时针旋转，+或不写：逆时针旋转
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name:'小区注册用户',
                    data: series,
                    type: 'line',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    }
                },
                {   
                    name:'小区活跃用户',
                    data: alivetotal,
                    type: 'line',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    }
                }]
              }, true)
            })
          }catch(err) {
            console.log(err)
          }
        }
    }
}

</script>

<style scoped>
  .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }


  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    padding: 20px;
    height: 100px;
    position:relative;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    text-align:center;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    text-align:center;
  }

  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
    overflow:hidden;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title-l {
    float:left;
  }

  .layout-title-r {
    float: right
  }
  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }
  .address-content{
    padding: 20px;
    font-size: 18px
  }
</style>
