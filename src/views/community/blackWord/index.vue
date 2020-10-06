<template>
  <div>
    <div class="layout-pages-search">
      <el-input placeholder="请输入屏蔽词"
                size="small"
                class="search-btn"
                v-model="listQuery.word"
                @keyup.native.enter='handleFilter'
                clearable>
      </el-input>
      <el-button size="small"
                 type="primary"
                 @click="handleFilter">搜索</el-button>
    </div>
    <div class="layout-pages-content">
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <el-button type="success"
                 size="mini"
                 class="btn-opearator"
                 v-if="add_blackWord"
                 @click="handleAdd">添加屏蔽词</el-button>
      <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 v-if="del_blackWord"
                 @click="handleDel">删除</el-button>
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
                         label="屏蔽词">
          <template slot-scope="scope">
            <span>{{scope.row.word}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="btn-opearator btn-edit"
                  v-if="update_blackWord"
                  @click="handleUpdate(scope.row)">编辑&nbsp;/&nbsp;</span>
            <span class="btn-opearator"
                  @click='handleDetail(scope.row)'>详情</span>
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
               append-to-body>
      <el-form :model="blackWordForm"
               :rules="rules"
               ref="blackWordForm"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="屏蔽词"
                          prop="word">
              <el-input v-model="blackWordForm.word"
                        size="small"
                        clearable
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
                   @click="handleSubmit('blackWordForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('blackWordForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, addObj, putObj, delObj, getSingleObj } from '@/api/blackWord'
export default {
  data() {
    return {
      add_blackWord: false,
      update_blackWord: false,
      del_blackWord: false,
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
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      blackWordForm: {
        id: undefined,
        word: undefined
      },
      rules: {
        word: [
          { required: true, message: '请输入屏蔽词', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.add_blackWord = this.permissions['add_blackWord']
    this.update_blackWord = this.permissions['update_blackWord']
    this.del_blackWord = this.permissions['del_blackWord']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getListObj(this.listQuery).then(res => {
        this.listLoading = false
        if (res.data.code === 0) {
          this.total = res.data.data.total
          this.tableData = res.data.data.records
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
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
    handleAdd() {
      this.dialogStatus = 'create'
      this.resetForm()
      this.formDialogVisible = true
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addObj(this.blackWordForm).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success'
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      Object.assign(this.blackWordForm, rows)
      this.formDialogVisible = true
    },
    handleUptForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          putObj(this.blackWordForm).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false
              this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success'
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleDel() {
      if (this.multipleSelection.length) {
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const delIds = {
            ids: ''
          }
          this.multipleSelection.forEach(item => {
            delIds.ids += item.id + ','
          })
          delIds.ids = delIds.ids.substring(0, delIds.ids.length - 1)
          delObj(delIds).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        })
      } else {
        this.$notify({
          title: '失败',
          message: '请选择要删除的数据',
          type: 'error'
        })
      }
    },
    resetForm() {
      this.blackWordForm = {
        id: undefined,
        word: undefined
      }
    },
    handleDetail(rows) {
      getSingleObj(rows.id).then(res => {
        if (res.data.code === 0) {
          this.dialogStatus = 'detail'
          this.blackWordForm = res.data.data
          this.formDialogVisible = true
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

