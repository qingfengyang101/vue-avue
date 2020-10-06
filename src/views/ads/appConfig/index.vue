<template>
  <div>
    <h2 class="layout-pages-title">app推送配置</h2>

    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="4"
                :offset="1">
          <el-input placeholder="请输入手机号"
                    size="small"
                    class="search-btn"
                    v-model="searchText"
                    @keyup.native.enter='handleFilter'
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
      <p class="total-number">(共<span>{{ total }}</span>条数据)</p>
      <el-button type="success"
                 size="mini"
                 class="btn-opearator"
                 @click="handleAdd">添加</el-button>
       <!-- <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 @click="batchAuditHandler">删除</el-button>  -->
      <el-table :data="tableData"
                class="layout-pages-content-table"
                @selection-change="handleSelectionChange"
                style="width: 100%">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="手机号">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         width="320"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  @click="handleDel(scope.row)"
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
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="formDialogVisible"
               width="60%">
      <el-form :model="drDoorphoneForm"
               :rules="rules"
               ref="drDoorphoneForm"
               label-width="100px">
        <el-row>
          <el-col :span="13">
            <el-form-item label="手机号"
                          prop="mobile">
              <el-input v-model="drDoorphoneForm.mobile"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13">
            <el-form-item label="名称"
                          prop="name">
              <el-input v-model="drDoorphoneForm.name"
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
                   @click="handleSubmit('drDoorphoneForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getListObj, addObj, delObj } from '@/api/appConfig'
import { filterError } from '@/util/filterError'

const rules = {
    mobile: [
        { required: true, message: '请输入手机号', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' }
    ]
}

export default {
  data() {
    return {
      listLoading: false,
      total: 0, // 数据数量
      tableData: [], // 列表数据
      listQuery: { // 获取列表参数
        page: 1,
        limit: 20,
        mobile: undefined
      },
      formDialogVisible: false, // 编辑框隐藏状态
      dialogStatus: '', // 操作状态
      textMap: {// 提示对象
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      searchText: '',// 搜索数据
      drDoorphoneForm: {
        mobile: undefined,
        name: undefined
      },
      selectionData: [], // 全选数据
      updateId: '', // 更新数据id
      rules // 输入规则
    }
  },
  created() {
      this.getList();
  },
  
  methods: {
    /**
     * desc 列表
     */
    async getList() {

        try {
            const res = ({data: { data: { total: this.total, records: this.tableData } }} = await getListObj(this.listQuery))
            await filterError(res, 'notify')
        }catch(err) {
            console.log(err)
        }
    },

    /**
     * desc 批量删除
     */
    async batchAuditHandler() {
       
        try {
            const { selectionData } = this;
            if (!selectionData.length) {
              this.$alert('请选择要操作的数据', '提示', { confirmButtonText: '确定' })
              return;
            }

           let str = '';
           selectionData.forEach(item => {
              str += `,${item.id}`
           })

           this.handleDel({ id: str.slice(1), type: 'batch' })
        }catch(err) {
          console.log(err)
        }
    },
    handleFilter() {
      const { searchText } = this;
      this.listQuery.page = 1
      this.listQuery.mobile = searchText
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
    
    /**
     * desc 打开新增窗口
     */
    handleAdd() {
      this.dialogStatus = 'create'
      this.formDialogVisible = true
      this.drDoorphoneForm = {
        mobile: undefined,
        name: undefined
      }
    },

    /**
     * desc 创建新消息
     */
    handleSubmit(formName) {

      this.$refs[formName].validate(async (valid) => {
        if (!valid) { return; }
 
        try {

            const res = await addObj(this.drDoorphoneForm)

            await filterError(res, 'notify', 1)
            this.formDialogVisible = false
            this.getList()
          
        } catch(err) {
            console.log(err)
        }
      })
    },

    /**
     * desc 删除按钮被单击
     */
    async handleDel({ id, type }) {
        try {
            await this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })

            let res;

            if (type === 'batch') {
              res = await deleteList({ ids: id })
            } else {
              res = await delObj(id)
            }

            await filterError(res, 'notify', 4)
            this.getList()

        }catch(err) {
            console.log(111, err)
        }
    },
    
    handleSelectionChange(ev) {
        this.selectionData = ev;
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-push {
  font-weight: bold;
}
</style>


