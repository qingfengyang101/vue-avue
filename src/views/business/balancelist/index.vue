<template>
  <div>
    <h2 class="layout-pages-title">商户余额列表</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-input placeholder="请输入要查询的账户号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.merAccount"
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-input placeholder="请输入要查询的手机号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.mobile"
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="1"
                :offset="2">
          <el-button size="small"
                     type="primary"
                     @click="handleReset"
                     plain>重置</el-button>
        </el-col>
        <el-col :span="1"
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
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="账户号">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="商家名称">
          <template slot-scope="scope">
            <span>{{scope.row.merName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="商家手机号">
          <template slot-scope="scope">
            <span>{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="收款状态">
          <template slot-scope="scope">
            <span v-if="scope.row.receivFlag === 'O'">打开</span>
            <span v-else>关闭</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="提现状态">
          <template slot-scope="scope">
            <span v-if="scope.row.drawFlag === 'O'">打开</span>
            <span v-else>关闭</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="余额">
          <template slot-scope="scope">
            <span>{{ scope.row.balance }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         width="280px"
                         label="管理">
          <template slot-scope="scope">
              <span class="tag-opearte"
                    @click='handleExamine("update", scope.row)'
                    effect="plain">
                编辑
                </span>
                <span class="tag-opearte"
                    @click='handleExamine("detail", scope.row)'
                    effect="plain">
                查看
                </span>
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

    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="formDialogVisible">
      <el-form :model="balanceForm"
               :rules="rules"
               ref="balanceForm"
               label-width="100px">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="商家名称"
                          prop="fullName">
              <el-input v-model="balanceForm.merName"
                        clearable
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="身份证号"
                          prop="idcard">
              <el-input v-model="balanceForm.idcard"
                        clearable
                        :disabled="true"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="交易账户号"
                          prop="mobile">
              <el-input v-model="balanceForm.id"
                        clearable
                        :disabled="true"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="商家等级"
                          prop="mobile">
              <el-input v-model="balanceForm.rank"
                        clearable
                        :disabled="dialogStatus === 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="dialogStatus === 'detail'" :span='12'>
            <el-form-item label="余额"
                          prop="mobile">
              <el-input v-model="balanceForm.balance"
                        clearable
                        :disabled="true"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="dialogStatus === 'detail'" :span='12'>
            <el-form-item label="可提现余额"
                          prop="mobile">
              <el-input v-model="balanceForm.drawBalance"
                        clearable
                        :disabled="true"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="dialogStatus === 'detail'" :span='12'>
            <el-form-item label="收益"
                          prop="mobile">
              <el-input v-model="balanceForm.totalBalance"
                        clearable
                        :disabled="true"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="dialogStatus === 'detail'" :span='12'>
            <el-form-item label="已提现"
                          prop="mobile">
              <el-input v-model="balanceForm.drawtotalBalance"
                        clearable
                        :disabled="true"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="dialogStatus === 'detail'" :span='12'>
            <el-form-item label="创建时间"
                          prop="mobile">
              <el-input v-model="balanceForm.createTime"
                        clearable
                        :disabled="true"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="手机号"
                          prop="mobile">
              <el-input v-model="balanceForm.mobile"
                        clearable
                        :disabled="dialogStatus === 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="银行卡号"
                          prop="mobile">
              <el-input v-model="balanceForm.bankCard"
                        clearable
                        :disabled="dialogStatus === 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="dialogStatus === 'detail'" :span='6'>
            <el-form-item label="收款状态: "
                          prop="mobile">
              {{ balanceForm.receivFlag === 'C' ? '关闭': '打开' }}
            </el-form-item>
          </el-col>
          <el-col v-if="dialogStatus === 'detail'" :span='6'>
            <el-form-item label="提现状态: "
                          prop="mobile">
                {{ balanceForm.drawFlag === 'C' ? '关闭': '打开' }}
            </el-form-item>
          </el-col>
          <el-col v-if="dialogStatus === 'update'" :span='12'>
            <el-form-item label="收款状态"
                          prop="mobile">
                <el-select v-model="balanceForm.receivFlag"
                            size="small"
                            clearable
                            placeholder="请选择状态">
                    <el-option size="small" label="打开" value="O"></el-option>
                    <el-option size="small" label="关闭" value="C"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="dialogStatus === 'update'" :span='12'>
            <el-form-item label="提现状态"
                          prop="mobile">
                <el-select v-model="balanceForm.drawFlag"
                            size="small"
                            clearable
                            placeholder="请选择状态">
                    <el-option size="small" label="打开" value="O"></el-option>
                    <el-option size="small" label="关闭" value="C"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus === 'update'"
                   @click="handleUptForm('balanceForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus === 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, updateObj } from '@/api/business/balancelist'
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
        mobile: undefined,
        merAccount: undefined
      },
      dialogStatus: 'detail',
      formDialogVisible: false,
      balanceForm: {},
      rules: {
        quartersId: [
          { required: true, message: '请输入小区名称', trigger: 'change' }
        ]
      },
      textMap: {
          detail: '查看',
          update: '更新'
      },
      villageOptions: [
        {
          name: '申请中',
          value: 'N'
        },
        {
          name: '已通过',
          value: 'A'
        },
        {
          name: '已拒绝',
          value: 'R'
        },
        {
          name: '已完成',
          value: 'E'
        }
      ]
    }
  },
  created() {
    
  },
  
  mounted() {
    this.getList()
  },
  methods: {

    async getList() {
      this.listLoading = true

      try {
          let res = ( { data: { data: { total: this.total, records: this.tableData } } } = await getListObj(this.listQuery))
          await filterError(res, 'notify')
          this.listLoading = false
      } catch(err) {
          console.log(err)
      }
    },

    /**
     * 审核
     */
    async handleExamine(status, row) {
        this.dialogStatus = status;
        this.formDialogVisible = true;
        this.balanceForm = row
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        mobile: undefined,
        merAccount: undefined,
        applyStatus: undefined
      }

      this.getList();
    },

    async handleUptForm() {
        try {
            const res = await updateObj(this.balanceForm)
            await filterError(res, 'notify', 3)
            this.getList();
            this.formDialogVisible = false;
        }catch(err) {
            console.log(err)
        }
    }
  }
}
</script>


