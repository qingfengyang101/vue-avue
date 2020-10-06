<template>
  <div>
    <h2 class="layout-pages-title">家政分类</h2>
    <div class="layout-pages-search">
      <el-input placeholder="请输入家政名"
                size="small"
                class="search-btn"
                v-model="listQuery.title"
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
                 v-if="add_home"
                 @click="handleAdd">添加新家政分类</el-button>
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
                         label="家政名称">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="update_home"
                  @click="handleUpdate(scope.row)">编辑</span>
            <span class="tag-opearte"
                  v-if="del_home"
                  @click="handleDel(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
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
            <el-form-item label="家政名称"
                          prop="title">
              <el-input v-model="villageForm.title"
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
import { filterError } from '@/util/filterError.js'
import { getListObj, addObj, putObj, delObj } from '@/api/home'
export default {
  data() {
    return {
      add_home: false,
      update_home: false,
      del_home: false,
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
        quartersId: undefined,
        title: undefined
      },
      rules: {
        title: [
          { required: true, message: '请输入服务分类', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.add_home = this.permissions['add_home']
    this.update_home = this.permissions['update_home']
    this.del_home = this.permissions['del_home']
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
        let res = ( { data: { data: this.tableData, data: { length: this.total } } } = await getListObj(this.listQuery));
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
    handleAdd() {
      this.dialogStatus = 'create'
      this.resetForm()
      this.formDialogVisible = true
    },

    /**
     * desc 添加数据
     */
    async handleSubmit(formName) {

      try {
        await this.$refs[formName].validate();
        const res = await addObj(this.villageForm)
        await filterError(res, 'notify', 1)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }

    },

    /**
     * desc 触发更新按钮
     */
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      Object.assign(this.villageForm, rows)
      this.formDialogVisible = true
    },

    /**
     * desc 更新数据
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
     * desc 删除数据
     */
    async handleDel({ id }) {

      try {
        const res = await delObj({ id })
        await filterError(res, 'notify', 4)
        this.getList()
      }catch(err) {
        console.log(err)
      }

    },

    /**
     * desc 重置表单数据
     */
    resetForm() {
      this.villageForm = {
        quartersId: undefined,
        title: undefined
      }
    }
  }
}
</script>


