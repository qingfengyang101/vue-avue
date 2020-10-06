<template>
  <div>
    <div class="layout-pages-content clear-bd">
      <el-button type="success"
                 size="mini"
                 class="btn-opearator"
                 v-if="add_setRate"
                 @click="handleAdd">添加充电模板</el-button>
      <el-table :data="tableData"
                class="layout-pages-content-table"
                v-loading="listLoading"
                style="width: 100%">
        <el-table-column align="center"
                         label="模板编号">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="模板名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="充电时长">
          <template slot-scope="scope">
            <span>{{scope.row.time}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="第一功率">
          <template slot-scope="scope">
            <span>{{scope.row.viewPower[0]}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="第二功率">
          <template slot-scope="scope">
            <span>{{scope.row.viewPower[1]}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="第三功率">
          <template slot-scope="scope">
            <span>{{scope.row.viewPower[2]}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理"
                         min-width="160px">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="update_setRate"
                  @click="handleUpdate(scope.row)">编辑</span>
            <span class="tag-opearte"
                  v-if="del_setRate"
                  @click="handleDel(scope.row)">删除</span>
            <span class="tag-opearte"
                  @click='handleDetail(scope.row)'>更多费率</span>
            <span class="tag-opearte"
                  @click='copyRateObj(scope.row)'>复制模板</span>
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
      <el-form :model="setRateForm"
               :rules="rules"
               ref="setRateForm"
               label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="模板名称"
                          prop="name">
              <el-input v-model="setRateForm.name"
                        placeholder="请输入模板名称"
                        size="small"
                        :disabled="dialogStatus === 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板编号"
                          prop="code">
              <el-input v-model="setRateForm.code"
                        placeholder="请输入模板编号"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="刷卡时长"
                          prop="time">
              <el-input v-model="setRateForm.time"
                        placeholder="请输入刷卡时长"
                        clearable
                        type="number"
                        size="small"
                        max="15"
                        min="1"
                        :disabled="dialogStatus=== 'detail'">
                          <span slot="suffix">单位小时</span>
                        </el-input>
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
                   @click="handleSubmit('setRateForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('setRateForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="detailsTitle"
      width="50%"
      :visible.sync="detailDialogVisible">
      <el-form :model="setRateForm"
               :rules="detailsRules"
               ref="setRateForm1">
      <el-button type="primary" size='mini' @click="addChangeDetails" style="margin-bottom: 20px;" round>添加</el-button>
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="功率" align="center">
          <template slot-scope="scope">
              <el-input v-if="scope.row.status" prop="power" size="small" v-model="scope.row.power"></el-input>
              <span v-else>{{ scope.row.power }}</span>
          </template>
        </el-table-column>
        <el-table-column label="功率率费" align="center">
          <!-- <template slot-scope="scope">{{scope.row.id}}</template> -->
          <template slot-scope="scope">
            <!-- <el-form-item>
              <el-input v-if="scope.row.status" size="small" v-model="scope.row.fee"></el-input>
              <span v-else>{{ scope.row.fee }}</span>
            </el-form-item> -->

            <el-input v-if="scope.row.status" size="small" v-model="scope.row.fee"></el-input>
              <span v-else>{{ scope.row.fee }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <!-- <template slot-scope="scope">{{scope.row.id}}</template> -->
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="管理" align="center">
          <template slot-scope="scope">
            <el-button @click="editDetails(scope.$index)" v-if="!scope.row.status" type="info" size='mini' round>编辑</el-button>
            <el-button @click="changeDetails(scope.$index)" v-if="scope.row.status" type="primary" size='mini' round>确定</el-button>
            <el-button @click="cancelDetails(scope.$index)" v-if="scope.row.status" type="warning" size='mini' round>取消</el-button>
            <el-button v-if="!scope.row.status" type="danger" @click="delRateDetailObj(scope.$index)" size='mini' round>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { 
  getRateListObj, 
  putRateObj, 
  getRateSingleObj, 
  addRateObj, 
  delRateObj, 
  getEquipPage, 
  getRateDetailObj, 
  putRateDetailObj, 
  addRateDetailObj, 
  delRateDetailObj,
  copyRateObj 
} from '@/api/setCharge'

import { filterError } from '@/util/filterError.js'

export default {
  data() {
    return {
      update_setRate: false,
      del_setRate: false,
      add_setRate: false,
      listLoading: false,
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      rid: '', 
      formDialogVisible: false,
      detailDialogVisible: false,
      detailDialogFrom: {},
      multipleSelection: [],
      dialogStatus: '',
      detailsTitle: '', // 明细名称
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      setRateForm: {
        id: undefined,
        code: undefined,
        time: undefined,
        name: undefined
      },
      detailsRules: {
        fee: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        power: [
          { required: true, message: '请输入功率', trigger: 'blur' }
        ],
      },
      rules: {
        code: [
          { required: true, message: '请输入模板编号', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请输入刷卡时长', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.update_setRate = this.permissions['update_setRate']
    this.add_setRate = this.permissions['add_setRate']
    this.del_setRate = this.permissions['del_setRate']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
  },
  methods: {

    /**
     * desc 复制模板
     */
    async copyRateObj({ id }) {
      try {
        const res = await copyRateObj({ id })
        this.getList();
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 编辑
     */
    editDetails(index) {
      const { list } = this;
      this.list.splice(index, 1, Object.assign({}, list[index], { status: true }))
    },

    /**
     * desc 取消
     */
    cancelDetails(index) {
      const { rid } = this;
      this.handleDetail({ id: rid })
    },

    /**
     * desc 添加模板
     */
    addChangeDetails() {
      const { rid } = this;
      this.list.push({ status: true, rid, power: undefined, fee: undefined })
    },

    /**
     * desc 删除模板
     */
    async delRateDetailObj(index) {
      const { list } = this;
      try {
        const res = await delRateDetailObj(list[index].id)
        await filterError(res, 'notify', 3)
        this.handleDetail({ id: list[index].rid })
      
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 创建/更新明细
     */
    async changeDetails(index) {
      const { list } = this;

      delete list[index].status;

      try {

        let res;
        let { id, power, fee } = list[index]

        if (!power || !fee) {
          this.$alert('请输入功率或者金额', '提示', { confirmButtonText: '确定' })
          return;
        }

        if (id) {
          res = await putRateDetailObj(list[index])
        } else {
          res = await addRateDetailObj(list[index])
        }
        await filterError(res, 'notify', 3)
        
        this.handleDetail({ id: list[index].rid })
      }catch(err) {
        console.log(err)
      }

    },

    async getList() {
      try {
        const res = ({ data: { data: { total: this.total, records: this.tableData } } } = await getRateListObj(this.listQuery))
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 重置表单
     */
    resetForm() {
      this.setRateForm = {
        id: undefined,
        code: undefined,
        time: undefined,
        name: undefined
      }
    },

    /**
     * desc 添加充电模板
     */
    handleAdd() {
      this.dialogStatus = 'create'
      this.resetForm()
      this.formDialogVisible = true
    },

    /***
     * desc 新增充电模板
     */
    async handleSubmit(formName) {

      try {
        await this.$refs[formName].validate()
        const res = await addRateObj(this.setRateForm)
        await filterError(res, 'notify', 1)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 编辑充电模板
     */
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      Object.assign(this.setRateForm, rows)
      this.formDialogVisible = true
    },

    /**
     * desc 更新充电模板
     */
    async handleUptForm(formName) {
      
      try {
        await this.$refs[formName].validate()
        let setRateForm = JSON.parse(JSON.stringify(this.setRateForm))
        delete setRateForm.viewPower
        const res = await putRateObj(setRateForm)
        await filterError(res, 'notify', 2)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 删除充电模板
     */
    async handleDel({ id }) {
      
      try {
        await this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {  confirmButtonText: '确定',  cancelButtonText: '取消', type: 'warning' })
        const res = await delRateObj(id)
        await filterError(res, 'notify', 4)
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 更多费率
     */
    async handleDetail({ id, name, code }) {
      this.detailDialogVisible = true;
      this.rid = id;
      if (code) {
        this.detailsTitle = `${name}-${code}`
      }else if(name) {
        this.detailsTitle = `${name}`
      }
      try {
        ({ data: { data: this.list } } = await getRateDetailObj({ rid: id }))
      }catch(err) {
        console.log(err)
      }
    }
  }
}
</script>
