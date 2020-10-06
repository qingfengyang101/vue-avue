<template>
  <div>
    <h2 class="layout-pages-title">商品分类</h2>
    <!-- <div class="layout-pages-search">
      <el-input placeholder="请输入商品类别"
                size="small"
                class="search-btn"
                v-model="listQuery.catName"
                @keyup.native.enter='handleFilter'
                clearable>
      </el-input>
      <el-button size="small"
                 type="primary"
                 @click="handleFilter">搜索</el-button>
    </div> -->
    <div class="layout-pages-content">
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <el-button type="success"
                 size="mini"
                 class="btn-opearator"
                 v-if="add_goodscats"
                 @click="handleAdd">添加商品分类</el-button>
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
                         label="商品分类名称">
          <template slot-scope="scope">
            <span>{{scope.row.catName}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center"
                         label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="update_goodscats"
                  @click="handleUpdate(scope.row)">
              编辑
            </span>
            <span class="tag-opearte"
                  @click="handleDel(scope.row)"
                  v-if="del_goodscats">
              删除
            </span>
            <span class="tag-opearte"
                  @click="handleDetail(scope.row)">
              详情
            </span>
            <!-- <el-dropdown>
              <span class="el-dropdown-link tag-opearte">
                二级分类管理
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided
                                  @click.native="handleShowSecondMenu(scope.row)">查看二级分类</el-dropdown-item>
                <el-dropdown-item v-if="add_sec_goods"
                                  @click.native="handleAddSecondMenu(scope.row)">添加二级分类</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
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
      <el-form :model="goodscatsForm"
               :rules="rules"
               ref="goodscatsForm"
               label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品分类名称"
                          prop="catName">
              <el-input v-model="goodscatsForm.catName"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序"
                          prop="catSort">
              <el-input v-model="goodscatsForm.catSort"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
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
                   @click="handleSubmit('goodscatsForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('goodscatsForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="二级商品分类"
               :visible.sync="secondTableVisible">
      <el-table :data="secondGridData">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="商品分类名称">
          <template slot-scope="scope">
            <span>{{scope.row.catName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="edit_sec_goods"
                  @click="handleUpdate(scope.row)">
              编辑
            </span>
            <span class="tag-opearte"
                  @click="handleDel(scope.row)"
                  v-if="del_sec_goods">
              删除
            </span>
            <span class="tag-opearte"
                  @click="handleDetail(scope.row)">
              详情
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, addObj, putObj, delObj, getChildCats } from '@/api/goodscats'
import VDistpicker from 'v-distpicker'
export default {
  data() {
    return {
      add_goodscats: false,
      update_goodscats: false,
      del_goodscats: false,
      add_sec_goods: false,
      del_sec_goods: false,
      edit_sec_goods: false,
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
      goodscatsForm: {
        parentId: undefined,
        catName: undefined,
        catSort: undefined,
        createTime: undefined
      },
      rules: {
        catName: [
          { required: true, message: '请输入商品分类名称', trigger: 'blur' }
        ]
      },
      secondTableVisible: false,
      secondGridData: [],
      firstRow: {}
    }
  },
  created() {
    this.add_goodscats = this.permissions['add_goodscats']
    this.update_goodscats = this.permissions['update_goodscats']
    this.del_goodscats = this.permissions['del_goodscats']
    this.add_sec_goods = this.permissions['add_sec_goods']
    this.del_sec_goods = this.permissions['del_sec_goods']
    this.edit_sec_goods = this.permissions['edit_sec_goods']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
  },
  components: { VDistpicker },
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
      this.resetFirstForm()
      this.formDialogVisible = true
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addObj(this.goodscatsForm).then(res => {
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
      Object.assign(this.goodscatsForm, rows)
      this.formDialogVisible = true
    },
    handleUptForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          putObj(this.goodscatsForm).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false
              this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success'
              })
              this.getList()
              if (this.firstRow.id) {
                this.handleShowSecondMenu(this.firstRow)
              }
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
    handleDel(row) {
      delObj(row.id).then(res => {
        if (res.data.code === 0) {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
          if (this.firstRow.id) {
            this.handleShowSecondMenu(this.firstRow)
          }
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    resetFirstForm() {
      this.goodscatsForm = {
        parentId: -1,
        catName: undefined,
        catSort: undefined,
        createTime: undefined
      }
    },
    handleDetail(rows) {
      this.dialogStatus = 'detail'
      this.goodscatsForm = rows
      this.formDialogVisible = true
    },
    handleAddSecondMenu(row) {
      this.dialogStatus = 'create'
      this.resetFirstForm()
      this.goodscatsForm.parentId = row.id
      this.formDialogVisible = true
    },
    handleShowSecondMenu(row) {
      this.firstRow = row
      getChildCats({ parentId: row.id }).then(res => {
        if (res.data.code === 0) {
          this.secondGridData = res.data.data
          if (this.secondGridData.length) {
            this.secondTableVisible = true
          } else {
            this.$message({
              message: '该分类下暂无子分类',
              type: 'warning'
            })
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>

