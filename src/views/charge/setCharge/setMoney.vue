<template>
  <div>
    <div class="layout-pages-content clear-bd">
      <el-button type="success"
                 size="mini"
                 v-if="add_setMoney"
                 class="btn-opearator top-btn"
                 @click="handleAdd">充值金额设置</el-button>
      <el-table :data="tableData"
                class="layout-pages-content-table"
                v-loading="listLoading"
                style="width: 100%">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="充值金额">
          <template slot-scope="scope">
            <span>{{scope.row.rechargeMoney}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="赠送金额">
          <template slot-scope="scope">
            <span>{{scope.row.giveMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="是否启用">
          <template slot-scope="scope">
            <span v-if="scope.row.state === '0'">
              <el-tag>启用</el-tag>
            </span>
            <span v-if="scope.row.state === '1'">
              <el-tag type="danger">禁用</el-tag>
            </span>
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
                         label="管理">
          <template slot-scope="scope">
            <span class="btn-opearator btn-edit"
                  v-if="update_setMoney"
                  @click="handleUpdate(scope.row)">编辑&nbsp;/&nbsp;</span>
            <span class="btn-opearator btn-edit"
                  style="color:red"
                  v-if="del_setMoney"
                  @click="handleDel(scope.row)">删除&nbsp;/&nbsp;</span>
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
      <el-form :model="setMoneyForm"
               :rules="rules"
               ref="setMoneyForm"
               label-width="140px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="充值金额"
                          prop="rechargeMoney">
              <el-input v-model="setMoneyForm.rechargeMoney"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="赠送金额"
                          prop="giveMoney">
              <el-input v-model="setMoneyForm.giveMoney"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否启用"
                          prop="state">
              <el-switch v-model="setMoneyForm.state"
                         active-value="0"
                         inactive-value="1"
                         :disabled="dialogStatus=== 'detail'"></el-switch>
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
                   @click="handleSubmit('setMoneyForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('setMoneyForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMoneyListObj, addMoneyObj, delMoneyObj, putMoneyObj } from '@/api/setCharge'
import { filterError } from '@/util/filterError'
export default {
  data() {
    return {
      update_setMoney: false,
      del_setMoney: false,
      add_setMoney: false,
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
      setMoneyForm: {
        id: undefined,
        rechargeMoney: undefined,
        giveMoney: undefined,
        state: '0'
      },
      rules: {
        rechargeMoney: [
          { required: true, message: '请输入充值金额', trigger: 'blur' }
        ],
        giveMoney: [
          { required: true, message: '请输入赠送金额', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '选择是否开启', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.add_setMoney = this.permissions['add_setMoney']
    this.update_setMoney = this.permissions['update_setMoney']
    this.del_setMoney = this.permissions['del_setMoney']
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
        const res = ({ data: { data: { total: this.total, records: this.tableData } } } = await getMoneyListObj(this.listQuery))
        this.listLoading = false
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 触发编辑
     */
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      Object.assign(this.setMoneyForm, rows)
      this.formDialogVisible = true
    },

    /**
     * desc 更新
     */
    async handleUptForm(formName) {

      try {
        await this.$refs[formName].validate()
        const res = await putMoneyObj(this.setMoneyForm)
        await filterError(res, 'notify', 2)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 添加充值金额设置
     */
    handleAdd() {
      this.dialogStatus = 'create'
      this.resetForm()
      this.formDialogVisible = true
    },

    /**
     * desc 新增充值金额
     */
    async handleSubmit(formName) {
      
      try {
        await this.$refs[formName].validate()
        const res = await addMoneyObj(this.setMoneyForm)
        await filterError(res, 'notify', 1)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 重置表单
     */
    resetForm() {
      this.setMoneyForm = {
        id: undefined,
        rechargeMoney: undefined,
        giveMoney: undefined,
        state: '1'
      }
    },

    /**
     * desc 详情
     */
    handleDetail(rows) {
      this.dialogStatus = 'detail'
      this.setMoneyForm = rows
      this.formDialogVisible = true
    },

    /**
     * desc 删除
     */
    async handleDel({ id }) {
      
      try {
        await this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await delMoneyObj(id)
        await filterError(res, 'notify', 4)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    
    }
  }
}
</script>
