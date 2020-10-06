<template>
  <div>
    <h2 class="layout-pages-title">系统参数</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="5" :offset="1">
          <el-input placeholder="请输入参数Key"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.configKey"
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
        <el-table-column align="center"
                         label="编号id">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="配置项">
          <template slot-scope="scope">
            <span>{{scope.row.configKey}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="配置值">
          <template slot-scope="scope">
            <span>{{scope.row.configValue}}</span>
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
      <el-form :model="cloudForm"
               :rules="rules"
               ref="cloudForm"
               label-width="100px">
      <el-row>
          
          <el-col :span='13'>
            <el-form-item label="配置值" prop="configValue">
              <el-input v-model="cloudForm.configValue"
                        clearable
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUptForm('cloudForm')">更 新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getListObj, putObj } from '@/api/param'


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
        configKey: undefined
      },
      formDialogVisible: false,
      multipleSelection: [],
      cloudForm: {
        cardNo: undefined
      },
      rules: {
        configValue: [
          { required: true, message: '请输入配置值', trigger: 'blur' }
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
            ({data: { data: { total: this.total, records: this.tableData }}} = await getListObj(this.listQuery))
            this.listLoading = false
        }catch(err) {
            console.log(err)
        }
    },

    /**
     * desc 编辑
     */
    handleUpdate(rows) {
      Object.assign(this.cloudForm, rows)
      this.formDialogVisible = true
    },
    
    /**
     * desc 更新
     */
    async handleUptForm(formName) {

        try {
            await this.$refs[formName].validate()
            const res = await putObj(this.cloudForm)
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


