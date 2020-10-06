<template>
  <div>
    <h2 class="layout-pages-title">云卡列表</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="5">
          <el-select v-model="listQuery.applyStatus"
                     size="small"
                     clearable
                     @change="handleFilter"
                     placeholder="请选择发卡标识">
            <el-option size="small" label="已激活" value="S"></el-option>
            <el-option size="small" label="已分配" value="D"></el-option>
            <el-option size="small" label="申请中" value="N"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-input placeholder="请输入申请人手机号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.mobile"
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-input placeholder="请输入持卡人手机号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.holderPhone"
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
        <!-- <el-table-column type="selection"
                         width="55">
        </el-table-column> -->
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="小区">
          <template slot-scope="scope">
            <span>{{scope.row.qName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="申请人">
          <template slot-scope="scope">
            <span>{{scope.row.fullName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="申请人手机号">
          <template slot-scope="scope">
            <span>{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="房间">
          <template slot-scope="scope">
            <span>{{scope.row.roomNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="持卡人姓名">
          <template slot-scope="scope">
            <span>{{scope.row.holderName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="持卡人手机号">
          <template slot-scope="scope">
            <span>{{scope.row.holderPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="申请状态">
          <template slot-scope="scope">
            <span v-if="scope.row.applyStatus === 'S'">已激活</span>
            <span v-else-if="scope.row.applyStatus === 'D'">已分配</span>
            <span v-else>申请中</span>
          </template>
        </el-table-column>
         <el-table-column align="center"
                         label="卡号">
          <template slot-scope="scope">
            <span>{{scope.row.cardNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="卡费">
          <template slot-scope="scope">
            <span>{{scope.row.cardCost}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="更新时间">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime}}</span>
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
            <span class="tag-opearte"
                  @click="handleDelete(scope.row)"
                  effect="plain">
              删除
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
            <el-form-item label="卡号" prop="cardNo">
              <el-input v-model="cloudForm.cardNo"
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
import { getListObj, putObj, delObj } from '@/api/cloudCard'


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
        holderPhone: undefined,
        mobile: undefined
      },
      formDialogVisible: false,
      multipleSelection: [],
      cloudForm: {
        cardNo: undefined
      },
      rules: {
        cardNo: [
          { required: true, message: '请输入卡号', trigger: 'blur' }
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
     * desc 删除
     */
    async handleDelete({ id }) {
        try {
            await this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {  confirmButtonText: '确定',  cancelButtonText: '取消', type: 'warning' })
            const res = await delObj(id)
            await filterError(res, 'notify', 4)
            this.getList();
        }catch(err) {
            console.log(err)
        }
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


