<template>
  <div>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.parkId"
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
        <el-col :span="1">
          <el-button size="small"
                     type="primary"
                     @click="handleFilter">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="layout-pages-content ">
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
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
                         label="停车场名称">
          <template slot-scope="scope">
            <span>{{scope.row.parkName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="车牌号">
          <template slot-scope="scope">
            <span>{{scope.row.plateNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="出场时间">
          <template slot-scope="scope">
            <span>{{scope.row.exitTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="卡号">
          <template slot-scope="scope">
            <span>{{scope.row.cardNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="计费类型">
          <template slot-scope="scope">
            <span v-if="scope.row.cardTypeId===1">贵宾车</span>
            <span v-if="scope.row.cardTypeId===2">月票车</span>
            <span v-if="scope.row.cardTypeId===3">储值车</span>
            <span v-if="scope.row.cardTypeId===4">临时车</span>
            <span v-if="scope.row.cardTypeId===5">免费车</span>
            <span v-if="scope.row.cardTypeId===6">车位池</span>
            <span v-if="scope.row.cardTypeId===7">时租车</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="车类型">
          <template slot-scope="scope">
            <span v-if="scope.row.carTypeId===1">摩托车</span>
            <span v-if="scope.row.carTypeId===2">小型车</span>
            <span v-if="scope.row.carTypeId===3">中型车</span>
            <span v-if="scope.row.carTypeId===4">大型车</span>
            <span v-if="scope.row.carTypeId===5">备用车型1</span>
            <span v-if="scope.row.carTypeId===6">备用车型2</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="用户支付金额">
          <template slot-scope="scope">
            <span>{{scope.row.payMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="设备名称">
          <template slot-scope="scope">
            <span>{{scope.row.deviceName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="值班员名称">
          <template slot-scope="scope">
            <span>{{scope.row.employName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="支付类型">
          <template slot-scope="scope">
            <span v-if="scope.row.carTypeId===0">微信</span>
            <span v-if="scope.row.carTypeId===1">支付宝</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="出场图片">
          <template slot-scope="scope">
            <img :src="scope.row.photo"
                 class="table-img"
                 alt=""
                 @click="handleImgShow(scope.row.photo)"
                 srcset="">
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  @click="handleDetail(scope.row)"
                  effect="plain">
              详情
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
            <el-col :span="24">
              <el-form-item label="所属停车场:"
                            prop="parkName">
                <el-input v-model="vehicleForm.parkName"
                          size="small"
                          clearable
                          :disabled="dialogStatus === 'detail'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="车牌号:"
                            prop="plateNo">
                <el-input v-model="vehicleForm.plateNo"
                          size="small"
                          clearable
                          :disabled="dialogStatus === 'detail'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="车主姓名:"
                            prop="carOwnerName">
                <el-input v-model="vehicleForm.carOwnerName"
                          size="small"
                          clearable
                          :disabled="dialogStatus === 'detail'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="卡号:"
                            prop="cardNo">
                <el-input v-model="vehicleForm.cardNo"
                          size="small"
                          clearable
                          :disabled="dialogStatus === 'detail'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
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
            <el-col :span="24">
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
            <el-col :span="24">
              <el-form-item label="用户支付金额:"
                            prop="carTypeId">
                <el-input v-model="vehicleForm.payMoney"
                          size="small"
                          clearable
                          :disabled="dialogStatus === 'detail'"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="12"
                  style="padding:24px">
            <img :src="vehicleForm.photo"
                 alt=""
                 style="max-width:100%"
                 srcset="">
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
import { getCarOut } from '@/api/parkingRecord'
import { selectParkingLotDropdownBox } from '@/api/parkingYarn'
import { isLicensePlate } from '@/api/validator'
export default {
  props: {
    vehicleFlag: Boolean
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20
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
          { required: true, message: '请输入code', trigger: 'blur' }
        ],
        plateNo: [
          { required: true, message: '请输入车牌号:', trigger: 'blur' },
          { validator: isLicensePlate, trigger: 'blur' }
        ]
      },
      parkingList: [],
      cardTypeIdList: [{
        label: '贵宾车',
        id: 1
      }, {
        label: '月票车',
        id: 2
      }, {
        label: '储值车',
        id: 3
      }, {
        label: '临时车',
        id: 4
      }, {
        label: '免费车',
        id: 5
      }, {
        label: '车位池',
        id: 6
      }, {
        label: '时租车',
        id: 7
      }],
      carTypeIdList: [{
        label: '摩托车',
        id: 1
      }, {
        label: '小型车',
        id: 2
      }, {
        label: '中型车',
        id: 3
      }, {
        label: '大型车',
        id: 4
      }, {
        label: '备用车型1',
        id: 5
      }, {
        label: '备用车型2',
        id: 6
      }]
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
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.handleInit()
  },
  methods: {
    handleInit() {
      selectParkingLotDropdownBox().then(res => {
        let ParkingLotList = []
        ParkingLotList = res.data.data
        if (ParkingLotList.length) {
          this.parkingList = ParkingLotList
          this.listQuery.parkId = this.parkingList[0].parkId
          this.getList()
        }
      })
    },
    getList() {
      this.listLoading = true
      getCarOut(this.listQuery).then(res => {
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
    handleImgShow(url) {
      this.dialogPhoto = url
      this.photoShowDialog = true
    },
    handleDetail(row) {
      this.dialogStatus = 'detail'
      this.vehicleForm = row
      this.formDialogVisible = true
    }
  }
}
</script>

<style lang="scss">
</style>

