<template>
  <div>
    <div ref="main1" style="width: 100%" class="layout-statistics"></div>
    <div class="layout-pages-search"
         style="width: 100%;">


      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.payType"
                     size="small"
                     clearable
                     @change="handleFilter"
                     placeholder="请选择充值方式">
            <el-option size="small" label="支付宝充值" value="ALIPAY"></el-option>
            <el-option size="small" label="微信充值" value="WXPAY"></el-option>
          </el-select>
        </el-col>
        <el-col :span='3'>
          <el-select size="small"
                     v-model="listQuery.payStatus"
                     clearable
                     @change='handleFilter'
                     class="searchSelect"
                     placeholder="请选择订单状态">
            <el-option v-for="item in payStatusList"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span='3'
                v-if="searchLabel === 2">
          <el-input placeholder="请输入消费方式"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.productName"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
        </el-col> -->
        <el-col :span='3'>
          <el-input placeholder="请输入手机号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.mobile"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
        </el-col>
        <el-col :span='1'
                :offset="1">
          <el-button size="small"
                     type="primary"
                     @click="handleFilter">搜索</el-button>
        </el-col>
      </el-row>   
      <!-- <el-row>
        <el-col :span='3'>
          <el-select v-model="searchLabel"
                     size="small"
                     @change="handleSearchLabel"
                     class="searchSelect">
            <el-option v-for="item in searchList"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='3'
                v-if="searchLabel === 1">
          <el-select size="small"
                     v-model="listQuery.payStatus"
                     @change='handleFilter'
                     class="searchSelect">
            <el-option v-for="item in payStatusList"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='3'
                v-if="searchLabel === 2">
          <el-input placeholder="请输入商品名称"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.productName"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
        </el-col>
        <el-col :span='3'>
          <el-input placeholder="请输入用户手机号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.mobile"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
        </el-col>
        <el-col :span='1'
                :offset="1">
          <el-button size="small"
                     type="primary"
                     @click="handleFilter">搜索</el-button>
        </el-col>
      </el-row> -->
    </div>
    <div class="layout-pages-content">
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>

      <el-table :data="tableData"
                class="layout-pages-content-table"
                v-loading="listLoading"
                @selection-change="handleSelectionChange"
                style="width: 100%">
      
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="订单编号">
          <template slot-scope="scope">
            <span>{{scope.row.orderid}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="充值用户">
          <template slot-scope="scope">
            <span>{{scope.row.userid}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="手机号">
          <template slot-scope="scope">
            <span>{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
       
        <el-table-column align="center"
                         label="付款方式">
          <template slot-scope="scope">
            <span>{{scope.row.paytype}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="支付状态">
          <template slot-scope="scope">
            <span v-if='scope.row.paystatus ==="0"'>待支付</span>
            <span v-if='scope.row.paystatus ==="1"'>付款成功</span>
            <span v-if='scope.row.paystatus ==="2"'>付款失败</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="商品名称">
          <template slot-scope="scope">
            <span>{{scope.row.productname}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="总价">
          <template slot-scope="scope">
            <span>{{scope.row.totalprice}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="充值时间">
          <template slot-scope="scope">
            <span>{{scope.row.createtime}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="layout-pages-pagination">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10, 20, 30, 50]"
                     :page-size="listQuery.limit"
                     layout="sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>

import { getListObj, payCensus } from '@/api/paymentRecord';
import { filterError } from '@/util/filterError'

const colors = ['#5793f3', '#d14a61', '#675bba'];

const option = {
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {type: 'cross'}
    },
    grid:{
      containLabel: true
    },
    toolbox: {
      feature: {
        restore: {show: true},
        saveAsImage: {show: true}
      }
    },
    legend: {
        data:['金额','人次']
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: []
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '金额',
        position: 'right',
        axisLine: {
            lineStyle: {
                color: colors[0]
            }
        },
        axisLabel: {
            formatter: '{value} 元'
        }
      },
      {
        type: 'value',
        name: '人次',
        position: 'left',
        axisLine: {
            lineStyle: {
                color: colors[1]
            }
        },
        axisLabel: {
          formatter: '{value} 人'
        }
      }
    ],
    series: [
        {
          name:'金额',
          type:'bar',
          data:[]
        },
        {
          name:'人次',
          type:'line',
          yAxisIndex: 1,
          data:[]
        }
    ]
};




export default {
  data() {
    return {
      listLoading: false,
      list: [],
      reslist: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      searchLabel: 1,
      searchList: [
        {
          id: 1,
          label: '订单状态'
        }, {
          id: 2,
          label: '商品名称'
        }
      ],
      payStatusList: [{
        id: '0',
        label: '支付中'
      }, {
        id: '1',
        label: '付款成功'
      }, {
        id: '2',
        label: '付款失败'
      }]
    }
  },
  created() {
    this.payCensus();
  },
  
  mounted() {
    this.getList()
  },
  methods: {

    /**
     * desc 获取充值统计
     */
    async payCensus() {
      try {
        ({ data: { data: { data: { reslist: this.reslist } } } } = await payCensus());
        this.setOption();
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 
     */
    setOption() {
      // 基于准备好的dom，初始化echarts实例
      const { reslist, resData } = this;
      var myChart = this.$echarts.init(this.$refs.main1);
      let date = []
      let amounts = [];
      let counts = [];
      
      reslist.forEach(({ amount, count, key, persontimes }) => {
        date.push(key.substring(5));
        amounts.push(amount);
    
        counts.push(count);
      })

      option.xAxis[0].data = date;
      option.series[0].data = amounts;
      option.series[1].data = counts;

      myChart.setOption(option);
    },

    async getList() {
      this.listLoading = true
      
      try {
        const res = ({ data: { data: { total: this.total, records: this.tableData } } } = await getListObj({ ...this.listQuery, orderType: 1 }))
        this.listLoading = false
        await filterError(res, 'notify')

      }catch(err) {
        console.log(err)
      }

    },
    
    /**
     * desc 筛选
     */
    handleSearchLabel() {
      if (this.searchLabel === 1) {
        this.listQuery.orderType = undefined
        this.listQuery.productName = undefined
      } else if (this.searchLabel === 2) {
        this.listQuery.orderType = undefined
        this.listQuery.payStatus = undefined
      }
      this.getList()
    }
  }
}
</script>

<style>
.layout-pages-pagination {
  text-align: left;
}

.layout-statistics {
  height: 600px;
}
</style>
