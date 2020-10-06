<template>
  <div>
    <h2 class="layout-pages-title">生活分类</h2>
    <div class="layout-pages-search">
      <el-input placeholder="请输入小区名"
                size="small"
                class="search-btn"
                v-model="listQuery.name"
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
                 v-if="add_lifecate"
                 @click="handleAdd">添加新生活分类</el-button>
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
                         label="服务类别名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="分类类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">无地址</span>
            <span v-else>有地址</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="update_lifecate"
                  @click="handleUpdate(scope.row)">编辑</span>
            <span class="tag-opearte"
                  v-if="del_lifecate"
                  @click="handleDel(scope.row)">删除</span>
            <span class="tag-opearte"
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
      <el-form :model="villageForm"
               :rules="rules"
               ref="villageForm"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="类别名称"
                          prop="name">
              <el-input v-model="villageForm.name"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类类型"
                          prop="type">
              <el-select v-model="villageForm.type"
                         clearable
                         placeholder="请选择"
                         :disabled="dialogStatus=== 'detail'"
                         size="small">
                <el-option v-for="item in options"
                           :key="item.type"
                           :label="item.label"
                           :value="item.type">
                </el-option>
              </el-select>
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
                   @click="handleSubmit('villageForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('villageForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, addObj, putObj, delObj, getSIngleObj } from '@/api/lifecategory'
import VDistpicker from 'v-distpicker'
import { filterError } from '@/util/filterError.js'
export default {
  data() {
    return {
      add_lifecate: false,
      update_lifecate: false,
      del_lifecate: false,
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
      villageForm: {
        name: undefined,
        categoryId: undefined,
        type: undefined
      },
      rules: {
        name: [
          { required: true, message: '请输入类别名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择分类类型', trigger: 'blur' }
        ]
      },
      options: [{
        type: '0',
        label: '无地址'
      }, {
        type: '1',
        label: '有地址'
      }]
    }
  },
  created() {
    this.add_lifecate = this.permissions['add_lifecate']
    this.update_lifecate = this.permissions['update_lifecate']
    this.del_lifecate = this.permissions['del_lifecate']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
  },
  components: { VDistpicker },
  methods: {
    /**
     * desc 获取生活分类列表
     */
    async getList() {

      try {
        this.listLoading = true
        const res = ({ data: { data: { total: this.total, records: this.tableData } } } = await getListObj(this.listQuery))
        this.listLoading = false
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
      }
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
    /**
     * desc 触发添加按钮
     */
    handleAdd() {
      this.dialogStatus = 'create'
      this.resetForm()
      this.formDialogVisible = true
    },
    /**
     * desc 添加生活分类
     */
    async handleSubmit(formName) {

      try {
        await this.$refs[formName].validate()
        const res = await addObj(this.villageForm)
        await filterError(res, 'notify', 1)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 触发编辑按钮
     */
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      Object.assign(this.villageForm, rows)
      this.formDialogVisible = true
    },

    /**
     * desc 更新生活分类数据
     */
    async handleUptForm(formName) {

      try {
        await this.$refs[formName].validate()
        const res = await putObj(this.villageForm)
        await filterError(res, 'notify', 2)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },
    /**
     * desc 删除生活分类数据
     */
    async handleDel({ categoryId }) {

      try {
        await this.$confirm('此操作将删除该条数据, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        const res = await delObj(categoryId)
        await filterError(res, 'notify', 4)
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    resetForm() {
      this.villageForm = {
        name: undefined,
        categoryId: undefined
      }
    },

    /**
     * desc 查看详情
     */
    async handleDetail({ categoryId }) {

      try {
        const res = ({ data: { data: this.villageForm } } = await getSIngleObj(categoryId))
        await filterError(res, 'notify')
        this.dialogStatus = 'detail'
        this.formDialogVisible = true
      }catch(err) {
        console.log(err)
      }
    }
  }
}
</script>

