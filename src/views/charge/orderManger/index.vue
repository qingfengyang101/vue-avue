<template>
  <div>
    <h2 class="layout-pages-title">充电订单管理</h2>
    <div class="layout-pages-search"
         style="width: 100%;">
      <el-row>
        <el-col :span='3'>
          <el-select v-model="listQuery.status"
                     size="small"
                     clearable
                     placeholder="请选择状态"
                     @change="handleFilter"
                     class="searchSelect">
            <el-option v-for="item in statusList"
                       :key="item.value"
                       :label="item.value"
                       :value="item.status">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='3'>
          <el-select v-model="searchLabel"
                     size="small"
                     clearable
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
                v-if="searchLabel === 0">
          <el-input placeholder="请输入订单编号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.orderNum"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
        </el-col>

        <el-col :span='3'
                v-if="searchLabel === 1">
          <el-input placeholder="请输入设备编号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.status"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
        </el-col>
        <el-col :span='3'>
          <el-input placeholder="请输入手机号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.phone"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
        </el-col>

        <el-col :span='3'>
          <el-date-picker
            size="small"
            v-model="listQuery.startTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-col>

        <el-col style="margin-left: 30px" :span='3'>
          <el-date-picker
            size="small"
            v-model="listQuery.endTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-col>

        <el-col style="margin-left: 70px" :span='1'>
          <el-button size="small" type="primary"  @click="handleFilter">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="layout-pages-content">
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>

      <el-table :data="tableData"
                class="layout-pages-content-table"
                v-loading="listLoading"
                style="width: 100%">
        <el-table-column align="center"
                         label="订单编号">
          <template slot-scope="scope">
            <span>{{ scope.row.orderNum }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="设备编号">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="设备地址">
          <template slot-scope="scope">
            <span>{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="用户昵称">
          <template slot-scope="scope">
            <span>{{scope.row.uid}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="充电时长(分钟)">
          <template slot-scope="scope">
            <span>{{scope.row.chargeTimes}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="最大功率">
          <template slot-scope="scope">
            <span>{{scope.row.power}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="充电方式">
          <template slot-scope="scope">
            <span>{{scope.row.type === 1 ? '刷卡': '扫码'}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="订单金额（元）">
          <template slot-scope="scope">
            <span>{{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="设备回路序号">
          <template slot-scope="scope">
            <span>{{scope.row.lineNum}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="开始时间">
          <template slot-scope="scope">
            <span>{{scope.row.startTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="结束时间">
          <template slot-scope="scope">
            <span>{{scope.row.endTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="当前充电状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">待支付</span>
            <span v-if="scope.row.status === 2">支付完成</span>
            <span v-if="scope.row.status === 3">充电中</span>
            <span v-if="scope.row.status === 4">充电完成</span>
            <span v-if="scope.row.status === 5">异常终止</span>
            <span v-if="scope.row.status === 6">用户关闭 </span>
            <span v-if="scope.row.status === 7">远程断定退款</span>
            <span v-if="scope.row.status === 8">线下充电设备</span>
            <span v-if="scope.row.status === 9">退款成功</span>
            <span v-if="scope.row.status === 10">未获取时间</span>
            <span v-if="scope.row.status === 11">自检检测功率为0</span>
            <span v-if="scope.row.status === 12">功率超载</span>
            <span v-if="scope.row.status === 13">充满自停</span>
            <span v-if="scope.row.status === 0">后付费待支付</span>
            <span v-if="scope.row.status === 14">远程关闭失败</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="btn-opearator"
                  v-if="del_orderManger"
                  @click="handleDel(scope.row)"><span style="color:red">删除</span>&nbsp;/&nbsp;</span>
            <span class="btn-opearator"
                  @click='handleDetail(scope.row)'>详情</span>
            <template v-if="scope.row.status === 3">
            <p style="cursor: pointer;width:100%;text-align:center;background:#409eff;color:#fff;margin: 5px 0;border-radius: 5px;" @click='getCheckLinePower(scope.row)'>
              检测功率
            </p>
            <p style="cursor: pointer;width:100%;text-align:center;background:#67c23a;color:#fff;margin: 5px 0;border-radius: 5px;" @click='getBeforeChargeBalance(scope.row)'>
              预计算
            </p>
            <p style="cursor: pointer;width:100%;text-align:center;background:#e6a23c;color:#fff;margin: 5px 0;border-radius: 5px;" @click='getFinishChargeBalance(scope.row)'>
              直接结算
            </p>
            </template>
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

    <!-- 编辑、详情、添加 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="formDialogVisible">
      <el-form :model="orderMangerForm"
               ref="orderMangerForm"
               label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单编号"
                          prop="orderNum">
              <el-input v-model="orderMangerForm.orderNum"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="充电时长(分钟)"
                          prop="chargeTimes">
              <el-input v-model="orderMangerForm.chargeTimes"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单金额（元）"
                          prop="amount">
              <el-input v-model="orderMangerForm.amount"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户"
                          prop="uid">
              <el-input v-model="orderMangerForm.uid"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备编号"
                          prop="code">
              <el-input v-model="orderMangerForm.code"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备回路"
                          prop="lineNum">
              <el-input v-model="orderMangerForm.lineNum"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">

            <el-form-item label="开始时间"
                          prop="startTime">
              <el-input v-model="orderMangerForm.startTime"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结束时间"
                          prop="endTime">
              <el-input v-model="orderMangerForm.endTime"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false"
                   v-if="dialogStatus=== 'create' || dialogStatus=== 'update'">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'create'"
                   @click="handleSubmit('orderMangerForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('orderMangerForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, delObj, getSingleObj, getFinishChargeBalance, getBeforeChargeBalance, getCheckLinePower } from '@/api/orderManger'
import { filterError } from '@/util/filterError.js'

export default {
  data() {
    return {
      del_orderManger: false,
      listLoading: false,
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      formDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      orderMangerForm: {
        accountId: undefined,
        token: undefined
        // doorphoneId: undefined
      },
      searchLabel: 0,
      statusList: [
        {
          value: '1-待支付',
          status: 1
        },
        {
          value: '3-充电中',
          status: 3
        },
        {
          value: '6-用户关闭',
          status: 6
        },
        {
          value: '11-自检功率0瓦',
          status: 11
        },
        {
          value: '13-充满自停',
          status: 13
        }
      ],
      searchList: [{
        id: 0,
        label: '订单编号'
      }, {
        id: 1,
        label: '设备编号'
      }]
    }
  },
  created() {
    this.del_orderManger = this.permissions['del_orderManger']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {

      this.listLoading = true
      try {
        const res = ({ data: { data: { total: this.total, records: this.tableData } } } = await getListObj(this.listQuery))
        this.listLoading = false
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 删除数据
     */
    async handleDel({ orderNum }) {

      try {
        await this.$confirm('是否删除此条数据?', '提示', {  confirmButtonText: '确定',  cancelButtonText: '取消', type: 'warning' })
        const res = await delObj(orderNum)
        await filterError(res, 'notify', 4)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 直接结算
     */
    async getFinishChargeBalance({ orderNum }) {
      try {
        await this.$confirm('是否直接结算,结算后充电状态将置为用户关闭？', '提示', {  confirmButtonText: '确定',  cancelButtonText: '取消', type: 'warning' })
        const res = await getFinishChargeBalance({ orderNum })
        if (res.data.code === 0) {
        
          this.$notify({  title: '成功',  message: res.data.msg,  type: 'success'})

        } else {
          await filterError(res, 'notify')
        }

      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 检测功率
     */
    async getCheckLinePower({ orderNum }) {
      try {
        const res = await getCheckLinePower({ orderNum })
        if (res.data.code === 0) {
           this.$notify({  title: '成功',  message: res.data.msg,  type: 'success'})
        } else {
          await filterError(res, 'notify')
        }

      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 预计算
     */
    async getBeforeChargeBalance({ orderNum }) {
      try {
        const res = await getBeforeChargeBalance({ orderNum })
        if (res.data.code === 0) {
           this.$notify({  title: '成功',  message: res.data.msg,  type: 'success'})
        } else {
          await filterError(res, 'notify')
        }

      }catch(err) {
        console.log(err)
      }
    },
    handleDetail(rows) {
      this.dialogStatus = 'detail'
      this.orderMangerForm = rows
      this.formDialogVisible = true
    },
    handleSearchLabel() {
      if (this.searchLabel === 0) {
        this.listQuery.code = undefined
      } else if (this.searchLabel === 1) {
        this.listQuery.orderNum = undefined
      }
    }
  }
}
</script>

