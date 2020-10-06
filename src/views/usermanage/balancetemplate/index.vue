<template>
  <div>
    <h2 class="layout-pages-title">余额模板</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="5" :offset="1">
          <el-input placeholder="请输入要查询金额"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.amount"
                    clearable>
          </el-input>
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
                         label="排序">
          <template slot-scope="scope">
            <span>{{scope.row.sort}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="金额">
          <template slot-scope="scope">
            <span>{{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="U贝">
          <template slot-scope="scope">
            <span>{{scope.row.shellAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="注册时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="备注">
          <template slot-scope="scope">
            <span>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         width="180px"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  @click="handleUpdate(scope.row)"
                  effect="plain">
              编辑
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
    <!-- 编辑、详情、添加 -->
    <el-dialog title="更新"
               :visible.sync="formDialogVisible">
      <el-form :model="balanceForm"
               :rules="rules"
               ref="balanceForm"
               label-width="100px">
      <el-row>
          
          <el-col :span='13'>
            <el-form-item label="金额"
                          prop="amount">
              <el-input v-model="balanceForm.amount"
                        clearable
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='13'>
            <el-form-item label="U贝"
                          prop="shellAmount">
              <el-input v-model="balanceForm.shellAmount"
                        clearable
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='13'>
            <el-form-item label="排序"
                          prop="sort">
              <el-input v-model="balanceForm.sort"
                        clearable
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='13'>
            <el-form-item label="备注">
              <el-input v-model="balanceForm.remark"
                        clearable
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUptForm('balanceForm')">更 新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getListObj, putObj } from '@/api/balancetemplate'


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
      formDialogVisible: false,
      multipleSelection: [],
      balanceForm: {
        sort: undefined,
        amount: undefined,
        remark: undefined
      },
      rules: {
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        shellAmount: [
          { required: true, message: '请输入U贝', trigger: 'blur' }
        ]
      }
    }
  },
 
  mounted() {
    this.getList()
  },
  methods: {
    
    /**
     * desc 
     */
    async getList() {
      this.listLoading = true

        try {
            ({data: { total: this.total, records: this.tableData }} = await getListObj(this.listQuery))
            this.listLoading = false
        }catch(err) {
            console.log(err)
        }
    },

    /**
     * desc 编辑
     */
    handleUpdate(rows) {
      Object.assign(this.balanceForm, rows)
      this.formDialogVisible = true
    },

    /**
     * desc 更新
     */
    async handleUptForm(formName) {

        try {
            await this.$refs[formName].validate()
            const res = await putObj(this.balanceForm)
            await filterError(res, 'notify', 1)
            this.formDialogVisible = false
            this.getList();
        }catch(err) {
            console.log(err)
        }
    }
  }
}
</script>


