<template>
  <div>
    <h2 class="layout-pages-title">单元管理</h2>
    <div class="layout-pages-search">
      <el-form label-width="80px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="小区"
                          style="margin-bottom:0px">
              <el-select v-model="listQuery.quartersId"
                         size="small"
                         @change="handleQuartChange"
                         placeholder="请选择小区">
                <el-option v-for="item in villageList"
                           size="small"
                           :key="item.quartersId"
                           :label="item.name"
                           :value="item.quartersId">

                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="楼栋"
                          style="margin-bottom:0px">
              <el-select v-model="listQuery.buildsId"
                         size="small"
                         @change="handleFilterAndBuildsId"
                         placeholder="请选择楼栋">
                <el-option v-for="item in buildsList"
                           size="small"
                           :key="item.buildsId"
                           :label="item.buildsName"
                           :value="item.buildsId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="单元名"
                          style="margin-bottom:0px">
              <el-input placeholder="请输入单元名"
                        style="display: inline-block;width: 100%;"
                        size="small"
                        v-model="listQuery.unitName"
                        @keyup.native.enter='handleFilter'
                        clearable>
              </el-input>
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
                 v-if="add_unit"
                 @click="handleAdd">添加新单元</el-button>
      <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 v-if="del_unit"
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
                         label="小区名称">
          <template slot-scope="scope">
            <span v-if="false">{{scope.row}}</span>
            <span>{{villageName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="楼栋名称">
          <template slot-scope="scope">
            <span v-if="false">{{scope.row.unitName}}</span>
            <span>{{buildingName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="单元名">
          <template slot-scope="scope">
            <span>{{scope.row.unitName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="单元呼叫号">
          <template slot-scope="scope">
            <span>{{scope.row.callNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="btn-opearator btn-edit"
                  v-if="update_unit"
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
      <el-form :model="unitForm"
               :rules="rules"
               ref="unitForm"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="楼栋名称"
                          prop="buildsId">
              <el-select v-model="unitForm.buildsId"
                         size="small"
                         clearable
                         :disabled="dialogStatus=== 'detail'"
                         placeholder="请选择楼栋">
                <el-option v-for="item in buildsList"
                           :key="item.buildsId"
                           :label="item.buildsName"
                           :value="item.buildsId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单元名"
                          prop="unitName">
              <el-input v-model="unitForm.unitName"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单元呼叫号"
                          prop="callNo">
              <el-input v-model="unitForm.callNo"
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
                   @click="handleSubmit('unitForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('unitForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { addObj, updateObj, delObj, getListObj, getSingleObj } from '@/api/unit'
import { getQuarterByRole } from '@/api/village'
import { isNumber } from '@/api/validator'
import { mapGetters } from 'vuex'
import { filterError } from "@/util/filterError"
export default {
  data() {
    return {
      tableData: [],
      add_unit: false,
      update_unit: false,
      del_unit: false,
      listQuery: {
        limit: 20,
        page: 1,
        buildsId: ''
      },
      buildsList: [],
      villageList: [],
      listLoading: false,
      list: [],
      total: 0,
      formDialogVisible: false,
      multipleSelection: [],
      dialogStatus: '',
      textMap: {update: '更新', create: '创建', detail: '详情'},
      unitForm: {unitName: undefined, buildsId: undefined, callNo: undefined, unitId: undefined},
      rules: {
        unitName: [
          { required: true, message: '请输入单元名称', trigger: 'blur' }
        ],
        buildsId: [
          { required: true, message: '请选择单元所在的楼栋名称', trigger: 'change' }
        ],
        callNo: [
          { required: true, message: '请选择单元呼叫号', trigger: 'blur' },
          {
            validator: isNumber, trigger: 'blur'
          }
        ]
      },
      allData: [],
      buildingName: '',
      villageName: ''
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.add_unit = this.permissions['add_unit']
    this.update_unit = this.permissions['update_unit']
    this.del_unit = this.permissions['del_unit']
  },
  mounted() {
    this.handleGetAllListObj()
  },
  methods: {
    /**
     * desc 选择小区
     */
    handleQuartChange() {

      try {
      this.listQuery.buildsId = '';

      (
        [{
          buildList: this.buildsList,
          name: this.villageName
        }] = this.villageList.filter(item => item.quartersId === this.listQuery.quartersId)
      );

      if (!this.buildsList || !this.buildsList.length) {
        this.tableData = []
        this.$notify({  title: '警告',  message: '此小区暂未添加楼栋',  type: 'warning'})
        return;
      }

      (
        [{
          buildsId: this.listQuery.buildsId,
          buildsName: this.buildingName
        }] = this.buildsList
      )
      this.handleFilter()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 选择楼栋
     */
    handleFilterAndBuildsId() {
      (
        [{
          buildsName: this.buildingName
        }] = this.buildsList.filter(item => item.buildsId === this.listQuery.buildsId)
      );
      this.handleFilter()
    },

    /**
     * desc 初始化小区数据
     */
    async handleGetAllListObj() {

      try {
        ({
          data: {
            data: this.villageList,
            data: [{
              quartersId: this.listQuery.quartersId,
              buildList: this.buildsList,
              name: this.villageName
            }]
          }
        } = await getQuarterByRole());

        if (!this.villageList.length) {
          this.tableData = []
          this.$notify({  title: '警告',  message: '此小区暂未添加楼栋',  type: 'warning' })
          return;
        }


        ([{ buildsId: this.listQuery.buildsId, buildsName: this.buildingName }] = this.buildsList);
        this.getList()
      }catch(err) {
        console.log(err)
      }

    },
    /**
     * desc 获取数据
     */
    async getList() {
      if (!this.listQuery.buildsId) return;
      this.listLoading = true
      try {
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
     * desc 触发新增按钮
     */
    handleAdd() {
      if (this.buildsList.length) {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.formDialogVisible = true
      } else {
        this.$notify({
          title: '警告',
          message: '请先在该小区下新增楼栋',
          type: 'warning'
        })
      }
    },

    /**
     * desc 新增单元
     */
    async handleSubmit(formName) {

      try {
        await this.$refs[formName].validate()
        const res = await addObj(this.unitForm)
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
      Object.assign(this.unitForm, rows)
      this.formDialogVisible = true
    },

    /**
     * desc 更新单元
     */
    async handleUptForm(formName) {

      try {
        await this.$refs[formName].validate()
        const res = await updateObj(this.unitForm)
        await filterError(res, 'notify', 2)
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
        this.$notify({  title: '失败',  message: '请选择要删除的数据',  type: 'error'})
        return;
      }

      try {
        await this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {  confirmButtonText: '确定',  cancelButtonText: '取消', type: 'warning' })
        const delIds = {  ids: '' }
        multipleSelection.forEach(item => {
          delIds.ids += item.unitId + ','
        })
        delIds.ids = delIds.ids.substring(0, delIds.ids.length - 1)
        const res = await delObj(delIds)
        await filterError(res, 'notify', 4)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    resetTemp() {
      this.unitForm = {
        unitId: undefined,
        unitName: undefined,
        buildsId: undefined,
        callNo: undefined
      }
    },

    /**
     * desc 查看详情
     */
    async handleDetail(rows) {

      try {
        const res = ({ data: { data: this.unitForm } } = await getSingleObj(rows.unitId))
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
