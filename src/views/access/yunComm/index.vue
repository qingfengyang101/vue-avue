<template>
  <div>
    <h2 class="layout-pages-title">云之讯管理</h2>
    <div class="layout-pages-search">
      <el-form :model="yunCForm"
               :rules="rules"
               ref="yunCForm"
               label-width="0">
        <el-row>
          <el-col :span="4">
            <el-form-item style="margin-bottom:0px">
              <el-input placeholder="请输入云之讯token"
                        size="small"
                        class="search-btn"
                        v-model="listQuery.token"
                        @keyup.native.enter='handleFilter'
                        clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item style="margin-bottom:0px">
              <el-select v-model="listQuery.status"
                         size="small"
                         clearable
                         @change="handleFilter"
                         placeholder="请选择云之讯状态">
                <el-option v-for="item in statusOption"
                           size="small"
                           :key="item.id"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1"
                  :offset="1">
            <el-button size="small"
                       class="search-btn-small"
                       type="primary"
                       @click="handleFilter">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="layout-pages-content">
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <el-button type="success"
                 size="mini"
                 class="btn-opearator"
                 v-if="add_yun"
                 @click="handleAdd">添加云之讯设备</el-button>
      <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 v-if="del_yun"
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
                         label="设备名称">
          <template slot-scope="scope">
            <span>{{scope.row.doorphoneName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="云之讯账号">
          <template slot-scope="scope">
            <span>{{scope.row.accountId}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center"
                         label="云之讯token">
          <template slot-scope="scope">
            <span>{{scope.row.token}}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center"
                         label="云之讯状态">
          <template slot-scope="scope">
            <span v-if="scope.row.doorphoneId">已分配</span>
            <span v-else>未分配</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="btn-opearator btn-edit"
                  v-if="update_yun"
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
               :visible.sync="formDialogVisible">
      <el-form :model="yunComForm"
               :rules="rules"
               ref="yunComForm"
               label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="云之讯账号"
                          prop="accountId">
              <el-input v-model="yunComForm.accountId"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="云之讯token"
                          prop="token">
              <el-input v-model="yunComForm.token"
                        type="textarea"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="门禁机"
                      prop="doorphoneId">
          <el-input v-model="yunComForm.doorphoneId"
                    clearable
                    :disabled="dialogStatus=== 'detail'"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false"
                   v-if="dialogStatus=== 'create' || dialogStatus=== 'update'">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'create'"
                   @click="handleSubmit('yunComForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('yunComForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, addObj, putObj, delObj, getSingleObj } from '@/api/yunComm'
export default {
  data() {
    return {
      add_yun: false,
      update_yun: false,
      del_yun: false,
      listLoading: false,
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      yunCForm: {},
      formDialogVisible: false,
      multipleSelection: [],
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      yunComForm: {
        id: undefined,
        accountId: undefined,
        token: undefined
      },
      rules: {
        token: [
          { required: true, message: '请输入云之讯token', trigger: 'blur' }
        ],
        accountId: [
          { required: true, message: '请输入云之讯账号', trigger: 'blur' }
        ]
      },
      statusOption: [{
        id: 0,
        value: '0',
        label: '未分配'
      }, {
        id: 1,
        value: '1',
        label: '已分配'
      }]
    }
  },
  created() {
    this.add_yun = this.permissions['add_yun']
    this.update_yun = this.permissions['update_yun']
    this.del_yun = this.permissions['del_yun']
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
          addObj(this.yunComForm).then(res => {
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
      Object.assign(this.yunComForm, rows)
      this.formDialogVisible = true
    },
    handleUptForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          putObj(this.yunComForm).then(res => {
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
          let flag = true
          this.multipleSelection.forEach(item => {
            delIds.ids += item.id + ','
            if (item.doorphoneId) {
              flag = false
            }
          })
          if (flag) {
            delIds.ids = delIds.ids.substring(0, delIds.ids.length - 1)
            delObj(delIds).then(res => {
              if (res.data.code === 0) {
                this.formDialogVisible = false
                this.$notify({
                  title: '成功',
                  message: res.data.msg,
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
          } else {
            this.$notify({
              title: '失败',
              message: '不能删除已分配的云之讯token',
              type: 'error'
            })
          }
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
      this.yunComForm = {
        id: undefined,
        accountId: undefined,
        token: undefined
      }
    },
    handleDetail(rows) {
      getSingleObj(rows.id).then(res => {
        if (res.data.code === 0) {
          this.dialogStatus = 'detail'
          this.yunComForm = res.data.data
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

<style lang="scss">
</style>

