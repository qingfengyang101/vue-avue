<template>
  <div>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.code"
                     size="small"
                     @change="handleFilter">
            <el-option v-for="item in parkingList"
                       size="small"
                       :key="item.parkId"
                       :label="item.pname"
                       :value="item.parkId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.expire"
                     size="small"
                     @change="handleFilter">
            <el-option v-for="item in expireList"
                       size="small"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <el-input placeholder="请输入车牌号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.plateNo"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-input placeholder="请输入手机号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.userTel"
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
    <div class="layout-pages-content ">
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <el-button type="success"
                 size="mini"
                 v-if="add_carManger"
                 class="btn-opearator"
                 @click="handleAdd">手动增加入场车辆</el-button>
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
                         label="编码">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="车牌号">
          <template slot-scope="scope">
            <span>{{scope.row.plateNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="计费类型">
          <template slot-scope="scope">
            <span v-if="scope.row.cardTypeId==='1'">贵宾车</span>
            <span v-if="scope.row.cardTypeId==='2'">月票车</span>
            <span v-if="scope.row.cardTypeId==='3'">储值车</span>
            <span v-if="scope.row.cardTypeId==='4'">临时车</span>
            <span v-if="scope.row.cardTypeId==='5'">免费车</span>
            <span v-if="scope.row.cardTypeId==='6'">车位池</span>
            <span v-if="scope.row.cardTypeId==='7'">时租车</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="车类型">
          <template slot-scope="scope">
            <span v-if="scope.row.carTypeId==='1'">摩托车</span>
            <span v-if="scope.row.carTypeId==='2'">小型车</span>
            <span v-if="scope.row.carTypeId==='3'">中型车</span>
            <span v-if="scope.row.carTypeId==='4'">大型车</span>
            <span v-if="scope.row.carTypeId==='5'">备用车型1</span>
            <span v-if="scope.row.carTypeId==='6'">备用车型2</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="用户支付金额">
          <template slot-scope="scope">
            <span>{{scope.row.payMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if='del_carManger'
                  @click="handleDel(scope.row)"
                  effect="plain">
              删除
            </span>
            <span class="tag-opearte"
                  @click="handleDetail(scope.row)"
                  effect="plain">
              详情
            </span>
            <span class="tag-opearte"
                  @click="handleUpdate(scope.row)"
                  effect="plain">
              编辑
            </span>
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
    <el-dialog :visible.sync="photoShowDialog"
               width="30%">
      <div style="text-align: center;">
        <img :src="dialogPhoto"
             style="max-width:100%">
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="photoShowDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]"
               width="45%"
               :visible.sync="formDialogVisible">
      <el-row>
        <el-form :model="vehicleForm"
                 :rules="rules"
                 ref="vehicleForm"
                 label-width="140px">
          <el-col :span="12">
            <el-form-item label="所属停车场:"
                          prop="code">
              <el-select v-model="vehicleForm.code"
                         size="small"
                         clearable
                         @change="handleFilter">
                <el-option v-for="item in parkingList"
                           size="small"
                           :key="item.parkId"
                           :label="item.pname"
                           :value="item.parkId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号:"
                          prop="plateNo">
              <el-input v-model="vehicleForm.plateNo"
                        size="small"
                        clearable
                        :disabled="dialogStatus === 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名:"
                          prop="userName">
              <el-input v-model="vehicleForm.userName"
                        size="small"
                        clearable
                        :disabled="dialogStatus === 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计费类型:"
                          prop="cardTypeId">
              <el-select v-model="vehicleForm.cardTypeId"
                         size="small"
                         clearable
                         :disabled="dialogStatus=== 'detail'"
                         placeholder="请选择">
                <el-option v-for="item in cardTypeIdList"
                           size="small"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车类型:"
                          prop="carTypeId">
              <el-select v-model="vehicleForm.carTypeId"
                         size="small"
                         clearable
                         :disabled="dialogStatus=== 'detail'"
                         placeholder="请选择">
                <el-option v-for="item in carTypeIdList"
                           size="small"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号:"
                          prop="userTel">
              <el-input v-model="vehicleForm.userTel"
                        size="small"
                        clearable
                        :disabled="dialogStatus === 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址:"
                          prop="userAddr">
              <el-input v-model="vehicleForm.userAddr"
                        size="small"
                        clearable
                        :disabled="dialogStatus === 'detail'"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="有效期开始时间:"
                          prop="startTime">
              <el-date-picker v-model="vehicleForm.startTime"
                              size="small"
                              type="datetime"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="timestamp"
                              :disabled="dialogStatus === 'detail'"
                              placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="有效期结束时间:"
                          prop="endTime">
              <el-date-picker v-model="vehicleForm.endTime"
                              size="small"
                              type="datetime"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="timestamp"
                              :disabled="dialogStatus === 'detail'"
                              placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false"
                   v-if="dialogStatus=== 'create' || dialogStatus=== 'update'">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'create'"
                   @click="handleSubmit('vehicleForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('vehicleForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getVehicleList, addObj, delObj, updatecarinfo } from '@/api/carList'
import { selectParkingLotDropdownBox } from '@/api/parkingYarn'
import { isLicensePlate, validatePhone } from '@/api/validator'
import { filterError } from '@/util/filterError'
export default {
  props: {
    vehicleFlag: Boolean
  },
  data() {
    const startTimeValid = (rule, value, callback) => {
      const self = this
      if (!value) {
        return callback(new Error('生效时间不能为空'))
      }
      setTimeout(() => {
        if (self.vehicleForm.endTime) {
          const beginDate = self.vehicleForm.startTime
          const endDate = self.vehicleForm.endTime
          // const d1 = new Date(beginDate.replace(/\-/g, '\/'))
          // const d2 = new Date(endDate.replace(/\-/g, '\/'))
          if (beginDate !== '' && endDate !== '' && beginDate >= endDate) {
            callback(new Error('开始时间不能大于结束时间！'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    const endTimeValid = (rule, value, callback) => {
      const self = this
      if (!value) {
        return callback(new Error('失效时间不能为空'))
      }
      setTimeout(() => {
        if (self.vehicleForm.startTime) {
          const beginDate = self.vehicleForm.startTime
          const endDate = self.vehicleForm.endTime
          // const d1 = new Date(beginDate.replace(/\-/g, '\/'))
          // const d2 = new Date(endDate.replace(/\-/g, '\/'))
          if (beginDate !== '' && endDate !== '' && beginDate >= endDate) {
            callback(new Error('结束时间不能小于开始时间！'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    return {
      list: [],
      total: 0,
      listLoading: false,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        expire: '1'
      },
      multipleSelection: [],
      photoShowDialog: false,
      dialogPhoto: '',
      vehicleForm: {
        code: undefined,
        plateNo: undefined,
        deposit: undefined,
        cardNo: undefined,
        userName: undefined,
        cardTypeId: undefined,
        carTypeId: undefined,
        userTel: undefined,
        userAddr: undefined,
        userNo: undefined,
        startTime: undefined,
        endTime: undefined
      },
      formDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      rules: {
        code: [
          { required: true, message: '请选择所属停车场', trigger: 'blur' }
        ],
        cardNo: [
          { required: true, message: '请输入卡号', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择有效期开始时间:', trigger: 'change' },
          { validator: startTimeValid, trigger: 'change' }
        ],
        plateNo: [
          { required: true, message: '请输入车牌号:', trigger: 'blur' },
          { validator: isLicensePlate, trigger: 'blur' }
        ],
        cardTypeId: [
          { required: true, message: '请选择计费类型:', trigger: 'change' }
        ],
        deposit: [
          { required: true, message: '请输入押金', trigger: 'blur' }
        ],
        carTypeId: [
          { required: true, message: '请选择车类型:', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择有效期结束时间:', trigger: 'change' },
          { validator: endTimeValid, trigger: 'change' }
        ],
        userTel: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ]
      },
      parkingList: [],
      expireList: [
        { label: '不限', id: '1' },
        { label: '未过期', id: '2' },
        { label: '已过期', id: '3' }
      ],
      cardTypeIdList: [{
        label: '贵宾车',
        id: '1'
      }, {
        label: '月票车',
        id: '2'
      }, {
        label: '储值车',
        id: '3'
      }, {
        label: '临时车',
        id: '4'
      }, {
        label: '免费车',
        id: '5'
      }, {
        label: '车位池',
        id: '6'
      }, {
        label: '时租车',
        id: '7'
      }],
      carTypeIdList: [{
        label: '摩托车',
        id: '1'
      }, {
        label: '小型车',
        id: '2'
      }, {
        label: '中型车',
        id: '3'
      }, {
        label: '大型车',
        id: '4'
      }, {
        label: '备用车型1',
        id: '5'
      }, {
        label: '备用车型2',
        id: '6'
      }],
      add_carManger: true,
      del_carManger: true
    }
  },
  watch: {
    vehicleFlag: {
      handler: function(val) {
        if (val) {
          this.getList()
          val = false
        }
      },
      deep: true
    }
  },
  created() {
    this.add_carManger = this.permissions['add_carManger']
    this.del_carManger = this.permissions['del_carManger']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.handleInit()
  },
  methods: {

    /**
     * desc 获取停车场
     */
    async handleInit() {
      
      try {
        const { data: { data: parkingLotList } } = await selectParkingLotDropdownBox();
        if (Array.isArray(parkingLotList) && parkingLotList.length) {
          this.parkingList = parkingLotList
          this.listQuery.code = parkingLotList[0].parkId
          this.getList()
        }
      }catch(err) {
        console.log(err)
      }
    },

    
    async getList() {
      if (!this.listQuery.code) { return; }
      
      try {
        this.listLoading = true
        const res = ({ data: { data: { total: this.total, records: this.tableData } } } = await getVehicleList(this.listQuery))
        this.listLoading = false
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 重置表单
     */
    resetForm() {
      this.vehicleForm = {
        code: undefined,
        plateNo: undefined,
        deposit: undefined,
        cardNo: undefined,
        userName: undefined,
        cardTypeId: undefined,
        carTypeId: undefined,
        userTel: undefined,
        userAddr: undefined,
        userNo: undefined,
        startTime: undefined,
        endTime: undefined
      }
    },

    /**
     * desc 手动增加入场车辆
     */
    handleAdd() {
      this.dialogStatus = 'create'
      this.resetForm()
      this.formDialogVisible = true
    },

    /**
     * desc 新增车辆
     */
    async handleSubmit(formName) {
      
      try {
        await this.$refs[formName].validate()
        const res = await addObj(this.vehicleForm)
        await filterError(res, 'notify', 1)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 删除车辆
     */
    async handleDel({ code, plateNo }) {
      
      try {
        await this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {  confirmButtonText: '确定',  cancelButtonText: '取消', type: 'warning' })
        const res = await delObj({ code, plateNo })
        await filterError(res, 'notify', 4)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 查看详情
     */
    handleDetail(row) {
      this.dialogStatus = 'detail'
      this.vehicleForm = row
      this.formDialogVisible = true
    },

    /**
     * desc 编辑
     */
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.vehicleForm = row
      this.formDialogVisible = true
    },

    /**
     * desc 更新车辆
     */
    async handleUptForm() {
      try {
        const res = await updatecarinfo(this.vehicleForm)
        await filterError(res, 'notify', 3)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    }
  }
}
</script>


