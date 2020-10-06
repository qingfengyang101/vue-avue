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
        <el-col :span="5">
          <el-date-picker size="small"
                          class="search-btn"
                          v-model="listQuery.startTime"
                          @change='handleFilter'
                          value-format="yyyy-MM-dd HH:mm:ss"
                          clearable
                          type="datetime"
                          placeholder="选择日期">
          </el-date-picker>
        </el-col>
        <el-col :span="5">
          <el-date-picker size="small"
                          class="search-btn"
                          v-model="listQuery.endTime"
                          @change='handleFilter'
                          value-format="yyyy-MM-dd HH:mm:ss"
                          clearable
                          type="datetime"
                          placeholder="选择日期">
          </el-date-picker>
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
                 v-if="exp_jiaofei"
                 class="btn-opearator"
                 @click="handleExp">导出缴费记录</el-button>
      <el-table :data="tableData"
                class="layout-pages-content-table"
                @selection-change="handleSelectionChange"
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
                         label="确认支付时间">
          <template slot-scope="scope">
            <span>{{scope.row.payTime}}</span>
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
            <span>{{scope.row.cardTypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="车类型">
          <template slot-scope="scope">
            <span>{{scope.row.carTypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="用户支付类型">
          <template slot-scope="scope">
            <span>{{scope.row.openTypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="设备名称">
          <template slot-scope="scope">
            <span>{{scope.row.deviceName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="应收金额">
          <template slot-scope="scope">
            <span>{{scope.row.nmon}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="实收金额">
          <template slot-scope="scope">
            <span>{{scope.row.rmon}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="入场图片">
          <template slot-scope="scope">
            <img :src="scope.row.entrancePhoto"
                 class="table-img"
                 alt=""
                 @click="handleImgShow(scope.row.entrancePhoto)"
                 srcset="">
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
                            prop="employName">
                <el-input v-model="vehicleForm.employName"
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
                            prop="cardTypeName">
                <el-input v-model="vehicleForm.cardTypeName"
                          size="small"
                          clearable
                          :disabled="dialogStatus === 'detail'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="车类型:"
                            prop="carTypeName">
                <el-input v-model="vehicleForm.carTypeName"
                          size="small"
                          clearable
                          :disabled="dialogStatus === 'detail'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="用户支付类型:"
                            prop="carTypeName">
                <el-input v-model="vehicleForm.openTypeName"
                          size="small"
                          clearable
                          :disabled="dialogStatus === 'detail'"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="设备名称:"
                            prop="deviceName">
                <el-input v-model="vehicleForm.deviceName"
                          size="small"
                          clearable
                          :disabled="dialogStatus === 'detail'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="应收金额:"
                            prop="nmon">
                <el-input v-model="vehicleForm.nmon"
                          size="small"
                          clearable
                          :disabled="dialogStatus === 'detail'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="实收金额:"
                            prop="rmon">
                <el-input v-model="vehicleForm.rmon"
                          size="small"
                          clearable
                          :disabled="dialogStatus === 'detail'"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="12"
                  style="padding:24px">
            <div>
              <img :src="vehicleForm.photo"
                   alt=""
                   style="max-width:100%"
                   srcset="">
            </div>
            <div>
              <img :src="vehicleForm.entrancePhoto"
                   alt=""
                   style="max-width:100%"
                   srcset="">
            </div>
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
import { chargeLogList, excelExport } from '@/api/parkingRecord'
import { selectParkingLotDropdownBox } from '@/api/parkingYarn'
import { isLicensePlate } from '@/api/validator'
export default {
  props: {
    vehicleFlag: Boolean
  },
  data() {
    return {
      exp_jiaofei: false,
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
    this.exp_jiaofei = this.permissions['exp_jiaofei']
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
          this.listQuery.code = this.parkingList[0].parkId
          this.getList()
        }
      })
    },
    getList() {
      this.listLoading = true
      chargeLogList(this.listQuery).then(res => {
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleImgShow(url) {
      this.dialogPhoto = url
      this.photoShowDialog = true
    },
    handleDetail(row) {
      this.dialogStatus = 'detail'
      this.vehicleForm = row
      this.formDialogVisible = true
    },
    handleExp() {
      const obj = {
        parkId: this.listQuery.code,
        startTime: this.listQuery.startTime,
        endTime: this.listQuery.endTime
      }
      if (this.listQuery.startTime && this.listQuery.endTime) {
        excelExport(obj).then(response => {
          const blob = new Blob([response.data])
          var date = new Date()
          var year = date.getFullYear()
          var month = date.getMonth() + 1
          var day = date.getDate()
          if (month < 10) {
            month = '0' + month
          }
          if (day < 10) {
            day = '0' + day
          }
          var nowDate = year + '-' + month + '-' + day
          const fileName = nowDate + '-停车场缴费记录.xls'
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href)
          document.body.removeChild(elink)
          this.$notify({
            title: '成功',
            message: '导出成功',
            type: 'success',
            duration: 2000
          })
        })
      } else {
        this.$notify({
          title: '警告',
          message: '请先选择缴费日期范围',
          type: 'warning',
          duration: 2000
        })
      }
    }
  }
}
</script>

<style lang="scss">
</style>

