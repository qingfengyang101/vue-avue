<template>
  <div>
    <h2 class="layout-pages-title">楼栋管理</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.quartersId"
                     size="small"
                     @change="handleFilter"
                     placeholder="请选择小区">
            <el-option v-for="item in villageOptions"
                       size="small"
                       :key="item.quartersId"
                       :label="item.name"
                       :value="item.quartersId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="请输入楼栋名"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.name"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="1">
          <el-button size="small"
                     type="primary"
                     @click="handleFilter">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="layout-pages-content">
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <el-button type="success"
                 size="mini"
                 class="btn-opearator"
                 v-if="add_building"
                 @click="handleAdd">添加新楼栋</el-button>
      <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 v-if="del_building"
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
                         label="小区">
          <template slot-scope="scope">
            <span>{{scope.row.quartersName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="楼栋名称">
          <template slot-scope="scope">
            <span>{{scope.row.buildsName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="楼栋呼叫号">
          <template slot-scope="scope">
            <span>{{scope.row.callNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="btn-opearator btn-edit"
                  v-if="update_building"
                  @click="handleUpdate(scope.row)">编辑&nbsp;/&nbsp;</span><span class="btn-opearator"
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
      <el-form :model="buildingForm"
               :rules="rules"
               ref="buildingForm"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="小区名称"
                          prop="quartersId">
              <el-select v-model="buildingForm.quartersId"
                         :disabled="dialogStatus=== 'detail'"
                         size="small"
                         placeholder="请选择小区名称">
                <el-option v-for="item in villageOptions"
                           size="small"
                           :key="item.quartersId"
                           :label="item.name"
                           :value="item.quartersId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="楼栋名称"
                          prop="buildsName">
              <el-input v-model="buildingForm.buildsName"
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="楼栋呼叫号"
                          prop="callNo">
              <el-input v-model="buildingForm.callNo"
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
                   @click="handleSubmit('buildingForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('buildingForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getQuarterByRole } from '@/api/village'
import { getListObj, addObj, putObj, delObj, getSIngleObj } from '@/api/building'
import { isNumber } from '@/api/validator'
import { filterError } from "@/util/filterError"
export default {
  data() {
    return {
      add_building: false,
      update_building: false,
      del_building: false,
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
      buildingForm: {
        buildsName: undefined,
        quartersId: undefined,
        callNo: undefined
      },
      rules: {
        buildsName: [
          { required: true, message: '请输入楼栋名称', trigger: 'blur' }
        ],
        quartersId: [
          { required: true, message: '请选择楼栋所在的小区', trigger: 'change' }
        ],
        callNo: [
          { required: true, message: '请输入楼栋呼叫号', trigger: 'blur' },
          {
            validator: isNumber, trigger: 'blur'
          }
        ]
      },
      villageOptions: []
    }
  },
  created() {
    this.add_building = this.permissions['add_building']
    this.update_building = this.permissions['update_building']
    this.del_building = this.permissions['del_building']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.handleGetAllListObj()
  },
  methods: {
    /**
     * desc 获取小区
     */
    async handleGetAllListObj() {

      try {
        ({ data: { data: this.villageOptions, data: [{ quartersId: this.listQuery.quartersId }] } } = await getQuarterByRole())
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 获取数据
     */
    async getList() {
      this.listLoading = true
      
      try {
        const res = ({ 
          data: { 
            data: { 
              total: this.total, 
              records: this.tableData 
            } 
          } 
        } = await getListObj(this.listQuery))
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
     * desc 创建楼号
     */
    async handleSubmit(formName) {
      
      try {
        await this.$refs[formName].validate()
        const res = await addObj(this.buildingForm)
        await filterError(res, 'notify', 1);
        this.formDialogVisible = false;
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
      Object.assign(this.buildingForm, rows)
      this.buildingForm.buildsName = rows.buildsName
      this.formDialogVisible = true
    },

    /**
     * desc 更新楼号
     */
    async handleUptForm(formName) {

      try {
        await this.$refs[formName].validate()
        const res = await putObj(this.buildingForm)
        await filterError(res, 'notify', 2);
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 删除
     */
    async handleDel() {
      const { multipleSelection } = this;
      if (!multipleSelection.length) {
        this.$notify({ title: '失败', message: '请选择要删除的数据', type: 'error'})
        return;
      }
      try {
        await this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {  confirmButtonText: '确定',  cancelButtonText: '取消', type: 'warning' })
        const delIds = {  ids: '' }
          multipleSelection.forEach(item => {
            delIds.ids += item.buildsId + ','
          })
        delIds.ids = delIds.ids.substring(0, delIds.ids.length - 1)
        const res = await delObj(delIds)
        await filterError(res, 'notify', 4);
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    resetForm() {
      this.buildingForm = {
        buildsName: undefined,
        quartersId: undefined,
        callNo: undefined
      }
    },

    /**
     * desc 查看详情
     */
    async handleDetail({ buildsId }) {

      try {
        const res = ({ data: { data: this.buildingForm } } = await getSIngleObj(buildsId))
        await filterError(res, 'notify');
        this.dialogStatus = 'detail'
        this.formDialogVisible = true
      }catch(err) {
        console.log(err)
      }
    }
  }
}
</script>
