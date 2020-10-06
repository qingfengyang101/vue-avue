<template>
  <div>
    <h2 class="layout-pages-title">消费记录管理</h2>
    <div class="layout-pages-search"
         style="width: 100%;">
      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.payType"
                     size="small"
                     clearable
                     @change="handleFilter"
                     placeholder="请选择消费方式">
            <el-option size="small" label="支付宝消费" value="ALIPAY"></el-option>
            <el-option size="small" label="微信消费" value="WXPAY"></el-option>
            <el-option size="small" label="余额消费" value="UJ"></el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span='3'>
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
        </el-col> -->
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
                         label="消费用户">
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
                         label="消费方式">
          <template slot-scope="scope">
            <span>{{scope.row.paytype}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="消费状态">
          <template slot-scope="scope">
            <span v-if='scope.row.paystatus ==="0"'>待支付</span>
            <span v-if='scope.row.paystatus ==="1"'>付款成功</span>
            <span v-if='scope.row.paystatus ==="2"'>付款失败</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="金额">
          <template slot-scope="scope">
            <span>{{scope.row.totalprice}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="消费时间">
          <template slot-scope="scope">
            <span>{{scope.row.createtime}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="消费方式">
          <template slot-scope="scope">
            <span>{{scope.row.productname}}</span>
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
import { getListObj } from '@/api/paymentRecord'
import { filterError } from '@/util/filterError.js'
export default {
  data() {
    return {
      listLoading: false,
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      multipleSelection: [],
      searchLabel: 1,
      searchList: [
        {
          id: 1,
          label: '订单状态'
        }, {
          id: 2,
          label: '消费方式'
        }],
      payStatusList: [{
        id: '0',
        label: '待支付'
      }, {
        id: '1',
        label: '付款成功'
      }, {
        id: '2',
        label: '付款失败'
      }]
    }
  },

  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.listLoading = true
        const res = ({ data: { data: { total: this.total, records: this.tableData } } } = await getListObj({ ...this.listQuery, orderType: 2 }))
        this.listLoading = false
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
      }
    },

    handleSearchLabel() {
      if (this.searchLabel === 1) {
        this.listQuery = { ...this.listQuery, orderType: undefined, productName: undefined }
      } else if (this.searchLabel === 2) {
        this.listQuery = { ...this.listQuery, orderType: undefined, payStatus: undefined }
      }
    }
  }
}
</script>

