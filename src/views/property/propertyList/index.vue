<template>
  <div>
    <h2 class="layout-pages-title">物业人员列表</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.quartersId"
                     size="small"
                     clearable
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
        <el-col :span="3"
                :offset="1">
          <el-input placeholder="请输入人员名称"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.name"
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
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <el-button type="success"
                 size="mini"
                 class="btn-opearator"
                 v-if="add_propertyPeo"
                 @click="handleAdd">添加物业人员</el-button>
      <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 v-if="del_propertyPeo"
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
                         label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="电话">
          <template slot-scope="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="排序">
          <template slot-scope="scope">
            <span>{{scope.row.createUser}}</span>
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
                  v-if="update_propertyPeo"
                  @click="handleUpdate(scope.row)">编辑</span>
            <span class="tag-opearte"
                  @click='handleDetail(scope.row)'>详情</span>
            <span class="tag-opearte"
                  @click='handleDoorDevice(scope.row)'>人脸录入</span>
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
      <el-form :model="propertyForm"
               :rules="rules"
               ref="propertyForm"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="小区"
                          prop="quartersId">
              <el-select v-model="propertyForm.quartersId"
                         size="small"
                         clearable
                         :disabled="dialogStatus=== 'detail'"
                         placeholder="请选择小区">
                <el-option v-for="item in villageOptions"
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
            <el-form-item label="姓名"
                          prop="name">
              <el-input v-model="propertyForm.name"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电话"
                          prop="phone">
              <el-input v-model="propertyForm.phone"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序"
                          prop="phone">
              <el-input v-model="propertyForm.createUser"
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
                   @click="handleSubmit('propertyForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('propertyForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 人脸录入 -->
    <el-dialog :title="textMap[dialogStatus]"
               :before-close="handleDoorDeviceDialogClose"
               :visible.sync="doorDeviceDialog">
      <el-form :model="doorDeviceForm"
               :rules="disRules"
               ref="doorDeviceForm"
               label-width="100px">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="生效时间"
                          prop="validDate">
              <el-date-picker v-model="doorDeviceForm.validDate"
                              clearable
                              value-format='yyyy-MM-dd HH:mm:ss'
                              format='yyyy-MM-dd HH:mm:ss'
                              type="datetime"
                              placeholder="选择日期时间"
                              size="small">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <el-form-item label="失效时间"
                          prop="expireDate">
              <el-date-picker v-model="doorDeviceForm.expireDate"
                              clearable
                              value-format='yyyy-MM-dd HH:mm:ss'
                              format='yyyy-MM-dd HH:mm:ss'
                              type="datetime"
                              placeholder="选择日期时间"
                              size="small">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <el-form-item label="小区名称"
                          prop="quartersId">
              <el-select v-model="doorDeviceForm.quartersId"
                         placeholder="请选择小区名称"
                         size="small"
                         @change="handleChangeVillageDoor">
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
          <el-col :span='12'>
            <el-form-item label="门禁机"
                          prop="doorPhoneId">
              <el-select v-model="doorDeviceForm.doorPhoneId"
                         placeholder="请选择门禁机"
                         size="small">
                <el-option v-for="item in doorDeviceList"
                           :key="item.doorphoneId"
                           :label="item.doorphoneName"
                           :value="item.doorphoneId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2"
                  :offset="1">
            <el-button @click="handleInsertFace">人脸录入</el-button>
          </el-col>
        </el-row>
      </el-form>
      <p v-if="count"
         style="color:red;text-align: center;">正在录入....{{count}}s</p>
      <p v-if="reqCode === 0"
         style="color:red;text-align: center;">录入成功!!!</p>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleAddDoorDevice('doorDeviceForm')">确 定</el-button>
        <el-button size="small"
                   @click="handleDoorDeviceDialogClose">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, addObj, putObj, delObj, getSIngleObj, getDoorPhoneListByQuartersId, insertFace, getNewFace } from '@/api/propertyList'
import { drFaceInfoUpdate } from '@/api/userlist'
import { getQuarterByRole } from '@/api/village'
import { validatePhone } from '@/api/validator'
import { filterError } from '@/util/filterError.js'

// getManDeptListObj
export default {
  data() {
    const startTime = (rule, value, callback) => {
      const self = this
      if (!value) {
        return callback(new Error('生效时间不能为空'))
      }
      setTimeout(() => {
        if (self.doorDeviceForm.expireDate) {
          const beginDate = self.doorDeviceForm.validDate
          const endDate = self.doorDeviceForm.expireDate
          const d1 = new Date(beginDate.replace(/\-/g, '\/'))
          const d2 = new Date(endDate.replace(/\-/g, '\/'))
          if (beginDate !== '' && endDate !== '' && d1 >= d2) {
            callback(new Error('开始时间不能大于结束时间！'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    const endTime = (rule, value, callback) => {
      const self = this
      if (!value) {
        return callback(new Error('失效时间不能为空'))
      }
      setTimeout(() => {
        if (self.doorDeviceForm.validDate) {
          const beginDate = self.doorDeviceForm.validDate
          const endDate = self.doorDeviceForm.expireDate
          const d1 = new Date(beginDate.replace(/\-/g, '\/'))
          const d2 = new Date(endDate.replace(/\-/g, '\/'))
          if (beginDate !== '' && endDate !== '' && d1 >= d2) {
            callback(new Error('结束时间不能小于开始时间！'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    return {
      add_propertyPeo: false,
      update_propertyPeo: false,
      del_propertyPeo: false,
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
      doorDeviceForm: {
        quartersId: undefined,
        doorphoneName: undefined,
        doorPhoneId: undefined,
        validDate: undefined,
        expireDate: undefined
      },
      propertyForm: {
        name: undefined,
        phone: undefined,
        quartersId: undefined,
        createUser: undefined
      },
      rules: {
        quartersId: [
          { required: true, message: '请选择小区名称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          {
            validator: validatePhone,
            trigger: 'blur'
          }
        ]
      },
      disRules: {
        validDate: [
          { required: true, message: '请选择生效时间', trigger: 'blur' },
          { validator: startTime, trigger: 'change' }
        ],
        expireDate: [
          { required: true, message: '请选择失效时间', trigger: 'blur' },
          { validator: endTime, trigger: 'change' }
        ]
      },
      villageArr: [],
      villageOptions: [],
      doorDeviceList: [],
      count: '',
      reqCode: '',
      rowsTemp: {},
      doorDeviceDialog: false
    }
  },
  created() {
    this.add_propertyPeo = this.permissions['add_propertyPeo']
    this.update_propertyPeo = this.permissions['update_propertyPeo']
    this.del_propertyPeo = this.permissions['del_propertyPeo']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.handleGetAllListObj()
  },
  methods: {
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

    /**
     * desc 添加物业人员
     */
    handleAdd() {
      this.dialogStatus = 'create'
      this.resetForm()
      this.formDialogVisible = true
    },

    /**
     * desc 获取小区
     */
    async handleGetAllListObj() {
      
      try {
        this.villageOptions = []
        const res = await getQuarterByRole()
        const { data: { data: requireInfo } } = res;

        if (Array.isArray(requireInfo) && requireInfo.length) {

          requireInfo.forEach(item => {
            delete item.bulidList
            this.villageOptions.push(item)
          })
          
          this.listQuery.quartersId = requireInfo[0].quartersId
          this.getList()
        }

      }catch(err) {
        console.log(err)
      }
      
    },

    /**
     * desc 添加物业人员
     */
    async handleSubmit(formName) {
      
      try {
        await this.$refs[formName].validate()
        const res = await addObj(this.propertyForm)
        await filterError(res, 'notify', 1)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 编辑
     */
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      Object.assign(this.propertyForm, rows)
      this.formDialogVisible = true
    },

    /**
     * desc 编辑物业人员
     */
    async handleUptForm(formName) {
      
      try {
        await this.$refs[formName].validate()
        const res = await putObj(this.propertyForm)
        await filterError(res, 'notify', 2)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }

    },

    /**
     * desc 删除物业人员
     */
    async handleDel() {
      
      try {
        const { multipleSelection } = this;
        if (!multipleSelection.length) {
          this.$notify({  title: '失败',  message: '请选择要删除的数据',  type: 'error' })
          return;
        }

        await this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {  confirmButtonText: '确定',  cancelButtonText: '取消', type: 'warning' })

        const res = await delObj({ ids: multipleSelection.map(item => item.id).join(',') })
        await filterError(res, 'notify', 4)
        this.getList()
      }catch(err) {
        console.log(err)
      }
      
    },

    /**
     * desc 重置表单
     */
    resetForm() {
      this.propertyForm = {
        name: undefined,
        phone: undefined,
        quartersId: undefined,
        doorphoneName: undefined,
        doorPhoneId: undefined,
        createUser: undefined
      }
    },

    /**
     * desc 查看详情
     */
    async handleDetail({ id }) {
      
      try {
        const res = ({ data: { data: this.propertyForm } } = await getSIngleObj(id))
        await filterError(res, 'notify')
        this.dialogStatus = 'detail'
        this.formDialogVisible = true
      }catch(err) {
        console.log(err)
      }
    },
    /**
     * 人脸录入
     */
    handleDoorDevice(rows) {
      this.reqCode = ''
      this.rowsTemp = rows
      const { id: ownerId, validDate, expireDate } = rows;

      this.doorDeviceForm = { ownerId,  validDate,  expireDate, doorPhoneId: undefined }

      this.doorDeviceDialog = true
    },

    /**
     * desc 获取门禁机
     */
    async handleChangeVillageDoor() {
      
      try {
        this.doorDeviceForm.doorPhoneId = ''
        this.doorDeviceList = [];

        ({ data: { data: this.doorDeviceList } } = await getDoorPhoneListByQuartersId({ quartersId: this.doorDeviceForm.quartersId }))

      }catch(err) {
        console.log(err)
      }
    
    },

    /**
     * desc 点击人脸录入
     */
    async handleInsertFace() {

      try {

        const { doorDeviceForm: { doorPhoneId, ownerId } } = this;

        if (!doorPhoneId) {
          this.$message.error('请先选择门禁机')
          return;
        }

        const res = await insertFace({ doorPhoneId, ownerId })
        await filterError(res, 'notify')
        this.handleCycleDevice()

      }catch(err) {
        console.log(err)
      }
    },
    handleCycleDevice() {
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        const today = new Date()
        const y = today.getFullYear()
        const M = today.getMonth() + 1
        const d = today.getDate()
        const h = today.getHours()
        const m = today.getMinutes()
        const s = today.getSeconds()
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
            if (this.count % 6 === 0) {
              const obj = {
                userId: this.doorDeviceForm.ownerId,
                time: y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s
              }
              getNewFace(obj).then(res => {
                if (res.data.code === 0) {
                  this.reqCode = res.data.code
                  this.rowsTemp.info = res.data.data
                  clearInterval(this.timer)
                  this.count = undefined
                  this.timer = null
                }
              })
            }
          } else {
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },

    /**
     * desc 人脸录入
     */
    async handleAddDoorDevice(formName) {
      
      try {
        await this.$refs[formName].validate()
        if (this.reqCode !== 0) {
          this.$notify({  title: '失败',  message: '请先进行人脸录入',  type: 'error' })
          return;
        }

        const { doorDeviceForm: { validDate, expireDate } } = this;
        this.rowsTemp.info = { ...this.rowsTemp.info, validDate, expireDate }
        const res = await drFaceInfoUpdate(this.rowsTemp.info)
        await filterError(res, 'notify', 2)
        this.doorDeviceDialog = false
      }catch(err) {
        console.log(err)
      }
      
    },
    
    handleDoorDeviceDialogClose() {
      clearInterval(this.timer)
      this.count = undefined
      this.timer = null
      this.doorDeviceDialog = false
    }
  }
}
</script>

<style lang="scss">
</style>

