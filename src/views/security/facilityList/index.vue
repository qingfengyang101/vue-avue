<template>
  <div>
    <h2 class="layout-pages-title">设备列表</h2>
    <div class="layout-pages-search">
      <el-input placeholder="请输入设备名称"
                size="small"
                class="search-btn"
                v-model="listQuery.deviceName"
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
                 v-if="add_facility"
                 @click="handleAdd">添加设备</el-button>
      <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 v-if="del_facility"
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
            <span>{{scope.row.deviceName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="设备id">
          <template slot-scope="scope">
            <span>{{scope.row.deviceId}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="注册码">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="经度">
          <template slot-scope="scope">
            <span>{{scope.row.lot}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="纬度">
          <template slot-scope="scope">
            <span>{{scope.row.lat}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="设备所在区域">
          <template slot-scope="scope">
            <span v-if="scope.row.type === '1'">果园</span>
            <span v-if="scope.row.type === '2'">菜园</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="账号">
          <template slot-scope="scope">
            <span>{{scope.row.account}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="密码">
          <template slot-scope="scope">
            <span>{{scope.row.password}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         min-width="160px"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="update_facility"
                  @click="handleUpdate(scope.row)">
              编辑
            </span>
            <el-dropdown>
              <span class="el-dropdown-link tag-opearte">
                管理用户
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleAddSecondMenu(scope.row)">添加用户</el-dropdown-item>
                <el-dropdown-item divided
                                  @click.native="handleShowSecondMenu(scope.row)">查看用户</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
            <el-form-item label="设备名称"
                          prop="deviceName">
              <el-input v-model="goodscatsForm.deviceName"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备id"
                          prop="deviceId">
              <el-input v-model="goodscatsForm.deviceId"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'|| dialogStatus=== 'update'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="注册码"
                          prop="code">
              <el-input v-model="goodscatsForm.code"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备所在区域"
                          prop="type">
              <el-select v-model="goodscatsForm.type"
                         clearable
                         :disabled="dialogStatus=== 'detail'"
                         size="small">
                <el-option v-for="item in typeOptions"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号"
                          prop="account">
              <el-input v-model="goodscatsForm.account"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'|| dialogStatus=== 'update'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="密码"
                          prop="password">
              <el-input v-model="goodscatsForm.password"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'|| dialogStatus=== 'update'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="纬度"
                          prop="lat">
              <el-input v-model="goodscatsForm.lat"
                        @focus="handleOpenMapDialog"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经度"
                          prop="lot">
              <el-input v-model="goodscatsForm.lot"
                        @focus="handleOpenMapDialog"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 根据地图选点 -->
      <el-dialog title="选取经纬度"
                 :visible.sync="mapDialogVisible"
                 append-to-body>
        <el-amap vid="amapDemo"
                 :zoom="zoom"
                 :events="reqPosition"
                 :center="center"
                 style="height: 55vh;">
        </el-amap>
      </el-dialog>
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
    <!-- 绑定用户 -->
    <el-dialog :title="bingtextMap[bingdialogStatus]"
               :visible.sync="bingDialogVisible">
      <el-form :model="bingForm"
               :rules="chooserules"
               ref="bingForm"
               label-width="120px">
        <el-row v-if="bingdialogStatus === 'create'">
          <el-col :span="12">
            <el-form-item label="用户名称"
                          prop="userId">
              <el-select v-model="bingForm.userId"
                         :disabled="bingdialogStatus=== 'detail'"
                         clearable
                         @change="handleUserName"
                         size="small"
                         placeholder="请选择用户名称"
                         filterable>
                <el-option v-for="item in facilitylist"
                           :key="item.ownerId"
                           :label="item.fullName"
                           :value="item.ownerId">
                  <span style="float:left">{{item.fullName}}</span>
                  <span style="float:right;color:#8492a6;font-size:13px">{{item.mobile}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="bingdialogStatus === 'update'">
          <el-col :span="12">
            <el-form-item label="用户"
                          prop="userName">
              <el-input v-model="bingForm.userName"
                        clearable
                        size="small"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间"
                          prop="timePowerStart">
              <el-date-picker v-model="bingForm.timePowerStart"
                              type="datetime"
                              format='yyyy-MM-dd HH:mm:ss'
                              value-format='yyyy-MM-dd HH:mm:ss'
                              placeholder="选择日期时间"
                              size="small"
                              :disabled="dialogStatus=== 'detail'">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结束时间"
                          prop="timePower">
              <el-date-picker v-model="bingForm.timePower"
                              type="datetime"
                              format='yyyy-MM-dd HH:mm:ss'
                              value-format='yyyy-MM-dd HH:mm:ss'
                              size="small"
                              placeholder="选择日期时间"
                              :disabled="dialogStatus=== 'detail'">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="bingDialogVisible = false"
                   v-if="bingdialogStatus=== 'create' || bingdialogStatus=== 'update'">取 消</el-button>
        <el-button type="primary"
                   v-if="bingdialogStatus=== 'create'"
                   @click="handlebingSubmit('bingForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="bingdialogStatus=== 'update'"
                   @click="handlebingUptForm('bingForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="bingdialogStatus=== 'detail'"
                   @click="bingDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="绑定用户列表"
               :visible.sync="secondTableVisible">
      <el-table :data="secondGridData">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="用户名称">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="开始时间">
          <template slot-scope="scope">
            <span>{{scope.row.timePowerStart}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="结束时间">
          <template slot-scope="scope">
            <span>{{scope.row.timePower}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="update_facility"
                  @click="binghandleUpdate(scope.row)">
              编辑
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 选择厂商 -->
    <el-dialog title="选择厂商"
               :visible.sync="chooseDialogVisible">
      <el-form :model="chooseForm"
               :rules="chooserules"
               ref="chooseForm"
               label-width="120px">
        <el-button type="primary"
                   v-for="item in labelList"
                   :label="item"
                   :key="item"
                   @click="handleAddForm">{{item}}</el-button>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="chooseDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, addObj, putObj, putbingObj, delObj, bingObj, getfacilityList, getChildCats, getLabelListObj } from '@/api/facilityList'
import { filterError } from '@/util/filterError'
import VDistpicker from 'v-distpicker'
export default {
  data() {
    const self = this
    const startTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('生效时间不能为空'))
      }
      setTimeout(() => {
        if (self.bingForm.timePower) {
          const beginDate = self.bingForm.timePowerStart
          const endDate = self.bingForm.timePower
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
      if (!value) {
        return callback(new Error('失效时间不能为空'))
      }
      setTimeout(() => {
        if (self.bingForm.timePowerStart) {
          const beginDate = self.bingForm.timePowerStart
          const endDate = self.bingForm.timePower
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
      add_facility: false,
      update_facility: false,
      del_facility: false,
      listLoading: false,
      list: [],
      total: 0,
      radio: '',
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      formDialogVisible: false,
      bingDialogVisible: false,
      chooseDialogVisible: false,
      multipleSelection: [],
      dialogStatus: '',
      bingdialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      bingtextMap: {
        update: '用户绑定更新',
        create: '用户绑定',
        detail: '详情'
      },
      bingForm: {
        deviceId: undefined,
        fullName: undefined,
        timePower: undefined,
        timePowerStart: undefined,
        userName: undefined,
        userId: undefined,
        account: undefined
      },
      chooseForm: {},
      goodscatsForm: {
        deviceName: undefined,
        deviceId: undefined,
        account: undefined,
        password: undefined,
        code: undefined,
        shopName: undefined,
        lat: undefined,
        lot: undefined,
        type: undefined
      },
      rules: {
        deviceName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        deviceId: [
          { required: true, message: '请输入设备id', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入注册码', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择设备所在区域', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      chooserules: {
        userId: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ],
        timePowerStart: [
          { required: true, message: '请选择开始时间', trigger: 'blur' },
          { validator: startTime, trigger: 'change' }
        ],
        timePower: [
          { required: true, message: '请选择结束时间', trigger: 'blur' },
          { validator: endTime, trigger: 'change' }
        ]
      },
      typeOptions: [{
        id: '1',
        label: '果园'
      }, {
        id: '2',
        label: '菜园'
      }],
      secondTableVisible: false,
      secondGridData: [],
      facilitylist: [],
      firstRow: {},
      labelList: [],
      mapDialogVisible: false,
      zoom: 16,
      center: [114.01669, 33.580473],
      reqPosition: {
        click(e) {
          const { lng, lat } = e.lnglat
          self.goodscatsForm.lot = lng
          self.goodscatsForm.lat = lat
          self.mapDialogVisible = false
        }
      }
    }
  },
  created() {
    this.add_facility = this.permissions['add_facility']
    this.update_facility = this.permissions['update_facility']
    this.del_facility = this.permissions['del_facility']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
    this.handleLabelList()
  },
  components: { VDistpicker },
  methods: {
    /**
     * desc 获取列表
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

    /**
     * desc 选择厂商
     */
    handleAddForm() {
      this.dialogStatus = 'create'
      this.resetFirstForm()
      this.formDialogVisible = true
      this.chooseDialogVisible = false
    },

    /**
     * desc 选择用户名称
     */
    handleUserName() {
      const findArr = this.facilitylist.find(item => {
        return item.ownerId === this.bingForm.userId
      })
      this.bingForm.userName = findArr.fullName
    },

    /**
     * desc 触发添加按钮
     */
    handleAdd() {
      this.chooseDialogVisible = true
    },

    /**
     * desc 获取厂商列表
     */
    async handleLabelList() {

      try {
        ({ data: { data: this.labelList } } = await getLabelListObj());
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 添加设备
     */
    async handleSubmit(formName) {

      try {
        await this.$refs[formName].validate()
        const res = await addObj(this.goodscatsForm)
        await filterError(res, 'notify', 1)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 添加用户
     */
    async handlebingSubmit(formName) {

      try {
        await this.$refs[formName].validate()
        const res = await bingObj(this.bingForm)
        await filterError(res, 'notify', 1)
        this.bingDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 触发编辑设备按钮
     */
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      Object.assign(this.goodscatsForm, rows)
      this.formDialogVisible = true
    },

    /**
     * desc 更新设备
     */
    async handleUptForm(formName) {

      try {
        await this.$refs[formName].validate()
        const res = await putObj(this.goodscatsForm)
        await filterError(res, 'notify', 2)
        this.formDialogVisible = false
        this.getList()
        if (this.firstRow.id) {
          this.handleShowSecondMenu(this.firstRow)
        }
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 触发绑定用户列表中的编辑按钮
     */
    async binghandleUpdate(rows) {
      this.bingdialogStatus = 'update'
      this.bingresetForm()
      Object.assign(this.bingForm, rows)
      try {
        const res = ({ data: { data: this.facilitylist } } = await getfacilityList({ deviceId: rows.deviceId }))
        await filterError(res, 'notify')
        this.bingDialogVisible = true
        this.bingForm.userId = rows.userId
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 重置表单
     */
    bingresetForm() {
      this.bingForm = {
        deviceId: undefined,
        fullName: undefined,
        ownerId: undefined,
        timePower: undefined,
        timePowerStart: undefined,
        userName: undefined,
        userId: undefined,
        account: undefined
      }
    },

    /**
     * desc 更新用户信息
     */
    async handlebingUptForm(formName) {
      
      try {
        await this.$refs[formName].validate()
        const res = await putbingObj(this.bingForm)
        await filterError(res, 'notify', 2)
        this.bingDialogVisible = false
        this.getList()

        if (this.firstRow.id) {
          this.handleShowSecondMenu(this.firstRow)
        }
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 删除设备
     */
    async handleDel() {
      const { multipleSelection } = this;
      
      try {

        if (!multipleSelection.length) {
          this.$notify({  title: '失败',  message: '请选择要删除的数据',  type: 'error' })
          return;
        }

        await this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {  confirmButtonText: '确定',  cancelButtonText: '取消', type: 'warning' })

        await delObj({ ids: multipleSelection.map(item => item.id).join(',') })
        await filterError(res, 'notify', 4)
        this.formDialogVisible = false
        this.getList()

      }catch(err) {
        console.log(err)
      }

    },

    /**
     * desc 重置表单
     */
    resetFirstForm() {
      this.goodscatsForm = {
        deviceName: undefined,
        deviceId: undefined,
        account: undefined,
        password: undefined,
        code: undefined,
        shopName: undefined,
        lat: undefined,
        lot: undefined,
        type: undefined
      }
    },
    
    /**
     * desc 添加用户
     */
    async handleAddSecondMenu({ account, deviceId }) {

      try {
        this.bingdialogStatus = 'create'
        this.bingresetForm()
        this.bingForm = { ...this.bingForm, account, deviceId };
        this.bingDialogVisible = true;
        ({ data: { data: this.facilitylist } } = await getfacilityList({ deviceId }))
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 查看用户
     */
    async handleShowSecondMenu(row) {
      this.firstRow = row
      const { account, deviceId } = row;

      try {
        const res = await getChildCats({ account, deviceId })
        const { data: { data: secondGridData } } = res;

        await filterError(res, 'notify')
        if (!secondGridData.length) {
          this.$message({ message: '该设备暂无绑定用户',  type: 'warning' })
          return;
        }

        this.secondGridData = secondGridData
        this.secondTableVisible = true

      }catch(err) {
        console.log(err)
      }
      
    },
    handleOpenMapDialog() {
      this.mapDialogVisible = true
    }
  }
}
</script>

<style lang="scss">
</style>

