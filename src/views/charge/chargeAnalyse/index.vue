<template>
  <div>
    <div class="layout-pages-search">
      <el-row :gutter="24">
        <el-col :span='3' :push="1">
          <el-select placeholder="请选择小区" v-model="querySpecificSelect" size="small" @change="handleQuartChange">
            <el-option v-for="item in villageList" size="small" :key="item.quartersId" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='3' :push="1">
          <el-input placeholder="请输入设备编号" size="small" class="search-btn" v-model="listQuery.code"
                    @keyup.native.enter='handleFilter' clearable>
          </el-input>
        </el-col>
        <el-col :span='3' :push="1">
          <el-date-picker v-model="startandendtime" type="datetimerange" size="small" :picker-options="pickerOptions"
                          start-placeholder="开始日期" range-separator="至" end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span='6' :push="1" align="right">
          <el-button 
              type="primary" 
              size="small"
              icon="el-icon-search"
               @click="handleFilter"
          >
            搜索
          </el-button>

        </el-col>
      </el-row>
    </div>
    <div ref="main1" class="layout-statistics layout-pages-content"></div>
    <h2 class="layout-pages-title"></h2>
    <div class="layout-pages-content">
      <p class="total-number">(共<span>{{total}}</span>条数据)<span style="padding-left: 24px;"> 总消费: {{ totalamount }}元
          刷卡消费: {{ cardamount }}元 扫码消费：{{ codeamount }}元</span></p>

      <el-table :data="tableData" class="layout-pages-content-table" v-loading="listLoading" @selection-change="handleSelectionChange"
                style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" width="50">
        </el-table-column>


        <el-table-column v-if="show" align="center" label="设备编号">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="show" align="center" label="安装地址">
          <template slot-scope="scope">
            <span>{{scope.row.address}}</span>
          </template>
        </el-table-column>


        <el-table-column align="center" label="线上消费金额">
          <template slot-scope="scope">
            <span>{{scope.row.amount_sm}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="刷卡消费金额">
          <template slot-scope="scope">
            <span>{{scope.row.amount_sk}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="总消费金额">
          <template slot-scope="scope">
            <span>{{scope.row.amount_all}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="layout-pages-pagination chargerAnalyse-form">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="headerDialog" :visible.sync="formDialogVisible">
      <p class="total-number"><span style="padding-left: 24px;color:#409eff;"> 今日总消费: {{ dailySummary.totalamount || 0 }}元
          本月消费：{{ dailySummary.monthamount || 0 }}元 季度消费: {{ dailySummary.quarteramount || 0 }}元</span></p>
      <el-table :data="reslis2" class="layout-pages-content-table" v-loading="listLoading" style="width: 100%">
        <el-table-column align="center" label="日期">
          <template slot-scope="scope">
            <span>{{scope.row.key}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="人数">
          <template slot-scope="scope">
            <span>{{scope.row.persontimes}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="扫码金额">
          <template slot-scope="scope">
            <span>{{scope.row.codetotal}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="刷卡金额">
          <template slot-scope="scope">
            <span>{{scope.row.cardtotal}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="总金额">
          <template slot-scope="scope">
            <span>{{scope.row.cctotal}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">

        <div class="layout-pages-pagination chargerAnalyse-form">
          <el-pagination @current-change="handleCurrentChange1" :current-page.sync="page" :page-size="15" layout="prev, pager, next, jumper"
                         :total="150">
          </el-pagination>
        </div>

        <el-button type="primary" @click="formDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getQuarterByRole, getUnitListByBuildId} from '@/api/village'
  import {quarter, syfx, vital, chargeVital, quarterSpecific} from '@/api/orderManger';
  import { getBeforeWeekTime, getBeforeMonthTime, getBeforeThhreeMonthTime} from '@/util/date.js';
  import {filterError} from '@/util/filterError.js';

  const colors = ['#5793f3', '#d14a61', '#675bba'];
  const option = {
    title: [{
      text: '近十五天消费统计'
    },
      {
        text: '近十五天消费占比',
        left: '85%',
        top: '6%',
        textAlign: 'center'
      }
    ],
    grid: {
      left: '1%',
      right: '22%',
      top: '16%',
      bottom: '6%',
      containLabel: true
    },
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    toolbox: {
      feature: {
        right: '5%',
        restore: {
          show: true
        },
        saveAsImage: {
          show: true
        },
        magicType: {
          type: ['line', 'bar']
        }
      }
    },
    legend: {
      data: ['扫码消费', '刷卡消费', '人数']
    },
    xAxis: [{
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      data: []
    }],
    yAxis: [{
      type: 'value',
      position: 'left',
      axisLine: {
        lineStyle: {
          color: colors[2]
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    }],
    series: [{
      name: '扫码消费',
      type: 'bar',
      data: [],
      label: {
        normal: {
          show: true,
          position: 'top',
          formatter: '{c}元'
        }
      }
    },
      {
        name: '刷卡消费',
        type: 'bar',
        data: [],
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: '{c}元'
          }
        }
      },
      {
        name: '人数',
        type: 'line',
        data: [],
      },
      {
        type: 'pie',
        center: ['88%', '33%'],
        radius: ['25%', '30%'],
        label: {
          normal: {
            position: 'center'
          }
        },
        data: [{
          value: 150,
          name: '用户来源分析',
          itemStyle: {
            normal: {
              color: colors[0]
            }
          },
          label: {
            normal: {
              formatter: '{d} %',
              textStyle: {
                color: colors[0],
                fontSize: 20

              }
            }
          }
        },
          {
            value: 150,
            name: '占位',
            tooltip: {
              show: false
            },
            itemStyle: {
              normal: {
                color: '#87CEFA'
              }
            },
            label: {
              normal: {
                textStyle: {
                  color: colors[0],
                },
                formatter: '\n\n\n\n扫码消费'
              }
            }
          }
        ]
      },
      {
        type: 'pie',
        center: ['88%', '72%'],
        radius: ['25%', '30%'],
        label: {
          normal: {
            position: 'center'
          }
        },
        data: [{
          value: 435,
          name: '用户来源分析',
          itemStyle: {
            normal: {
              color: colors[1]
            }
          },
          label: {
            normal: {
              formatter: '{d} %',
              textStyle: {
                color: colors[1],
                fontSize: 20

              }
            }
          }
        }, {
          value: 100,
          name: '占位',
          tooltip: {
            show: false
          },
          itemStyle: {
            normal: {
              color: '#87CEFA'
            }
          },
          label: {
            normal: {
              textStyle: {
                color: colors[1],
              },
              formatter: '\n\n\n\n刷卡消费'
            }
          }
        }]
      }
    ]
  };
  export default {
    data() {
      return {
        startandendtime: '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              picker.$emit('pick', [getBeforeWeekTime(), new Date()]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              picker.$emit('pick', [getBeforeMonthTime(), new Date()]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              picker.$emit('pick', [getBeforeThhreeMonthTime(), new Date()]);
            }
          }]
        },
        listLoading: false,
        list: [],
        total: 0,
        page: 1,
        code: '',
        tableData: [],
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
        },
        querySpecificSelect: null,
        reslis: [],
        reslis2: [],
        resData: {
          cardTotal: 0,
          codeTotal: 0,
          total: 0
        },
        dailySummary: {
          totalamount: 0,
          quarteramount: 0,
          monthamount: 0
        },
        totalamount: 0,
        cardamount: 0,
        codeamount: 0,
        formDialogVisible: false,
        headerDialog: '详情',
        villageList: [],
        show: true
      }
    },
    computed: {
      ...mapGetters(['permissions'])
      
    },
    async mounted() {
      this.getList();
      this.getQuarter();
      try {
        await this.getVital();
        this.setOption();
      } catch (err) {
        console.log(err)
      }
    },
    methods: {
      async getVital() {
        
        try {
          let cardTotal, codeTotal, total;
          ({
            data: {
              data: {
                reslist: this.reslist,
                cardTotal,
                codeTotal,
                total
              }
            }
          } = await vital());
          this.resData = {
            cardTotal,
            codeTotal,
            total
          }
        } catch (err) {
          console.log(err)
        }
      },
      async getQuarter() {
        let quartersId, name;
        try {
          const list = ({
            data: {
              data: {}
            }
          } = await quarter())
          this.villageList = list.data.data;
          console.log(this.villageList, 'this.villageList...');
        } catch (err) {
          console.log(err)
        }
      },
      /**
       * desc 选择小区
       */
      handleQuartChange() {
        let querySpecificSelectItem  = {};
        console.log(this.querySpecificSelect, 'querySpecificSelectItem');
        querySpecificSelectItem =  this.villageList.filter(  ( item )  => item.name === this.querySpecificSelect);
        
        if ( !querySpecificSelectItem) return null; 
        this.getQuarterSpecific(querySpecificSelectItem);
      },
      /**
       * getQuarterSpecific  选择具体的小区
       * @param: buildsId { String }
       * @param: buildsName { String s}
       * @return:{ object }
       */
      async getQuarterSpecific () {
          if (!param) return null;

          let resultGetQuarterSpecific = null;
          try {
             resultGetQuarterSpecific = await quarterSpecific(param);
             console.log(resultGetQuarterSpecific, 'resultGetQuarterSpecific')
            if (Array.isArray(resultGetQuarterSpecific)) {
                this.tableData = resultGetQuarterSpecific;
                this.reslist = resultGetQuarterSpecific.reslist;
            }
          } catch (error) {
            console.log(error);
          }
        },
    
      /**
       * desc
       */
      setOption() {
        // 基于准备好的dom，初始化echarts实例
        const {
          reslist,
          resData
        } = this;
        var myChart = this.$echarts.init(this.$refs.main1);
        let date = []
        let cardtotals = [];
        let codetotals = [];
        let persontime = [];
        let cardtotalCount = 0;
        let codetotalCount = 0;
        reslist.forEach(({
                           cardtotal,
                           codetotal,
                           key,
                           persontimes
                         }) => {
          date.push(key.substring(5));
          cardtotals.push(cardtotal);
          cardtotalCount += cardtotal;
          codetotalCount += codetotal;
          codetotals.push(codetotal);
          persontime.push(persontimes);
        })

        option.xAxis[0].data = date;
        option.series[0].data = codetotals;
        option.series[1].data = cardtotals;
        option.series[2].data = persontime;
        option.series[3].data[0].value = codetotalCount;
        option.series[3].data[1].value = cardtotalCount;
        option.series[4].data[1].value = codetotalCount;
        option.series[4].data[0].value = cardtotalCount;
        myChart.setOption(option);
      },

      async getList() {
        try {
          this.listLoading = true
          const res = ({
            data: {
              data: {
                total: this.total,
                records: this.tableData,
                codeamount: this.codeamount,
                cardamount: this.cardamount,
                totalamount: this.totalamount
              }
            }
          } = await syfx(this.listQuery));
          this.listLoading = false
          await filterError(res, 'notify')
        } catch (err) {
          console.log(err)
        }
      },

      handleCurrentChange1() {
        this.handleDetail({
          code: this.code
        })
      },

      /**
       * desc 查看详情
       */
      async handleDetail({
                           code
                         }) {
        try {
          this.code = code;
          const {
            data: {
              data: {
                monthamount,
                quarteramount,
                totalamount
              }
            }
          } = ({
            data: {
              data: {
                reslist: this.reslis2
              }
            }
          } = await chargeVital({
            code,
            page: this.page
          }))
          this.dailySummary = {
            ...this.dailySummary,
            monthamount,
            quarteramount,
            totalamount
          }
          this.formDialogVisible = true
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
</script>
<style>
  .layout-pages-pagination {
    text-align: left;
  }

  .layout-statistics {
    width: 100%;
    height: 600px;
  }
</style>
