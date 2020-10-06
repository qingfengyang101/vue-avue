<template>
  <div>
    <div class="layout-pages-content clear-bd">
      <el-table :data="tableData"
                class="layout-pages-content-table"
                v-loading="listLoading"
                style="width: 100%">
        <el-table-column align="center"
                         label="设备编号">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="卡类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type===0">识别所有卡</span>
            <span v-if="scope.row.type===1">只识别加密卡</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="总金额">
          <template slot-scope="scope">
            <span>{{scope.row.total}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="设备安装地址">
          <template slot-scope="scope">
            <span>{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="设备绑定">
          <template slot-scope="scope">
            <span v-if='scope.row.isBind===1'>是</span>
            <span v-if='scope.row.isBind===0'>否</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="是否可用">
          <template slot-scope="scope">
            <span v-if='scope.row.isEnabled===1'>是</span>
            <span v-if='scope.row.isEnabled===0'>否</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="是否转移">
          <template slot-scope="scope">
            <span v-if='scope.row.isTransfer===1'>是</span>
            <span v-if='scope.row.isTransfer===0'>否</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="费率">
          <template slot-scope="scope">
            <span>{{scope.row.pulse}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="总金额">
          <template slot-scope="scope">
            <span>{{scope.row.total}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         width="350px"
                         label="操作">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="edit_equipment"
                  @click="handleUpdate(scope.row)"
                  effect="plain">
              编辑
            </span>
            <span class="tag-opearte"
                  @click="handleDetEquirment(scope.row)"
                  v-if="del_setEquipment"
                  effect="plain">
              删除
            </span>
            <span class="tag-opearte"
                  @click="handleDetail(scope.row)"
                  effect="plain">
              详情
            </span>
            <el-dropdown>
              <span class="el-dropdown-link tag-opearte"
                    effect="plain">
                更多
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="send_setEquipment"
                                  @click.native="handleSendDevice(scope.row)">更新设备参数</el-dropdown-item>
                <el-dropdown-item divided
                                  v-if="update_equipment"
                                  @click.native="handleGetUpdateDeviceInfo(scope.row)">设置设备参数</el-dropdown-item>
                <el-dropdown-item divided
                                  v-if="temp_setEquipment"
                                  @click.native="handleSetTemp(scope.row)">设置过温保护</el-dropdown-item>
                <el-dropdown-item divided
                                  v-if="ip_setEquipment"
                                  @click.native="handleGetUpdateIpInfo(scope.row)">设置设备ip</el-dropdown-item>
                <el-dropdown-item divided
                                  @click.native="handleUpdateLines(scope.row)"
                                  v-if="updata_circuit">更新回路信息</el-dropdown-item>
                <el-dropdown-item divided
                                  v-if="look_circle"
                                  @click.native="handleGetCircuitListObj(scope.row)">查看回路信息</el-dropdown-item>
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
      <el-form :model="setEquipment"
               :rules="ruleSetEquipment"
               ref="setEquipment"
               label-width="140px">
        <el-row>
          <el-col :span="7">
            <el-form-item label="设备编号"
                          prop="code">
              <el-input v-model="setEquipment.code"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update' ||  dialogStatus=== 'updateDevice' "></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="温度保护值"
                          prop="temperature">
              <el-input v-model="setEquipment.temperature"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update' ||  dialogStatus=== 'updateDevice'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="设备信号强度"
                          prop="level">
              <el-input v-model="setEquipment.level"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update' ||  dialogStatus=== 'updateDevice'"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="7">
            <el-form-item label="经度坐标"
                          prop="lng">
              <el-input v-model="setEquipment.lng"
                        @focus="handleOpenMapDialog"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' ||  dialogStatus=== 'updateDevice'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="纬度坐标"
                          prop="lat">
              <el-input v-model="setEquipment.lat"
                        @focus="handleOpenMapDialog"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' ||  dialogStatus=== 'updateDevice'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="设备安装地址"
                          prop="address">
              <el-input v-model="setEquipment.address"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' ||  dialogStatus=== 'updateDevice'"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="7">
            <el-form-item label="充电方式"
                          prop="chargeMethod">
              <el-select v-model="setEquipment.chargeMethod"
                         :disabled="dialogStatus=== 'detail' ||  dialogStatus=== 'update'||  dialogStatus=== 'updateDevice'"
                         size="small">
                <el-option v-for="item in chargeDList"
                           size="small"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="设备类型"
                          prop="typeid">
              <el-select v-model="setEquipment.typeid"
                         :disabled="dialogStatus=== 'detail' ||  dialogStatus=== 'update'||  dialogStatus=== 'updateDevice'"
                         size="small">
                <el-option v-for="item in typeList"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="卡类型"
                          prop="type">
              <el-select v-model="setEquipment.typeid"
                         :disabled="dialogStatus=== 'detail' ||  dialogStatus=== 'update'||  dialogStatus=== 'updateDevice'"
                         size="small">
                <el-option v-for="item in cardTypeList"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="最大功率"
                          prop="maxPower">
              <el-input v-model="setEquipment.maxPower"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'|| dialogStatus=== 'update'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="充满自停功率"
                          prop="autoStopPower">
              <el-input v-model="setEquipment.autoStopPower"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="充满自停延长时间"
                          prop="minuts">
              <el-input v-model="setEquipment.minuts"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="创建时间"
                          prop="createTime">
              <el-input v-model="setEquipment.createTime"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update' ||  dialogStatus=== 'updateDevice'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="上次通讯时间"
                          prop="lastTime">
              <el-input v-model="setEquipment.lastTime"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update' ||  dialogStatus=== 'updateDevice'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
                   v-if="dialogStatus=== 'create' || dialogStatus=== 'update' ||  dialogStatus=== 'updateDevice'">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'create'"
                   @click="handleSubmit('setEquipment')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('setEquipment')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'updateDevice'"
                   @click="handleDeviceUptForm('setEquipment')">更 新</el-button>
      </span>
    </el-dialog>

    <!-- 过温保护 -->
    <el-dialog title="温度过温保护"
               width="30%"
               :visible.sync="setTempformDialogVisible">
      <el-form :model="setTempForm"
               :rules="rules"
               ref="setTempForm"
               label-width="80px">
        <el-form-item label="过温温度"
                      prop="temperature">
          <el-input v-model="setTempForm.temperature"
                    size="small"
                    clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleSetTempSubmit('setTempForm')">确 定</el-button>
        <el-button type="primary"
                   @click="setTempformDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 设置设备ip -->
    <el-dialog title="设置设备IP"
               width="50%"
               :visible.sync="ipInfoDialogVisible">
      <el-form :model="ipInfoForm"
               :rules="rules"
               ref="ipInfoForm"
               label-width="80px">
        <el-form-item label="ip地址"
                      prop="ip">
          <el-input v-model="ipInfoForm.ip"
                    size="small"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="端口号"
                      prop="port">
          <el-input v-model="ipInfoForm.port"
                    size="small"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="设备类型"
                      prop="type">
          <el-select v-model="ipInfoForm.type"
                     size="small">
            <el-option v-for="item in typeList"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleIpInfoSubmit('ipInfoForm')">确 定</el-button>
        <el-button type="primary"
                   @click="ipInfoDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!--  -->
    <el-dialog title="回路信息"
               :visible.sync="dialogTableVisible">
      <el-table :data="circuittableData">
        <el-table-column align="center"
                         label="设备id">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="回路编号">
          <template slot-scope="scope">
            <span>{{scope.row.lineId}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="回路状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state === 1">空闲</span>
            <span v-if="scope.row.state === 2">占用</span>
            <span v-if="scope.row.state === 3">故障</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center"
                         label="功率">
          <template slot-scope="scope">
            <span>{{scope.row.power}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="充电时间">
          <template slot-scope="scope">
            <span>{{scope.row.time}}</span>
          </template>
        </el-table-column> -->
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getEquipPage, getEquiInfo, editEquipment, singleEquipment, setTemp, getUpdateIpInfo, delEquipment } from '@/api/setCharge'
import { updateLines, getListObj } from '@/api/circuit'
export default {
  data() {
    const self = this
    return {
      update_setRate: false,
      del_setEquipment: false,
      send_setEquipment: false,
      ip_setEquipment: false,
      temp_setEquipment: false,
      edit_equipment: false,
      update_equipment: false,
      updata_circuit: false,
      listLoading: false,
      look_circle: false,
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      circuittotal: 0,
      circuittableData: [],
      circuitListQuery: {
        page: 1,
        limit: 20,
        code: undefined
      },
      dialogTableVisible: false,
      formDialogVisible: false,
      multipleSelection: [],
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情',
        updateDevice: '设置设备参数'
      },
      setEquipment: {
        id: undefined,
        code: undefined,
        typeid: undefined,
        type: undefined,
        lng: undefined,
        lat: undefined,
        address: undefined,
        createTime: undefined,
        chargeMethod: undefined,
        lastTime: undefined,
        temperature: undefined,
        maxPower: undefined,
        autoStopPower: undefined,
        minuts: undefined,
        temperlevelature: undefined
      },
      setTempformDialogVisible: false,
      setTempForm: {
        temperature: '',
        code: ''
      },
      ipInfoDialogVisible: false,
      ipInfoForm: {
        ip: '',
        code: '',
        port: '',
        type: 1
      },
      typeList: [{
        label: '安卓',
        id: 1
      }],
      cardTypeList: [{
        label: '只识别加密卡',
        id: 0
      }, {
        label: '识别所有卡',
        id: 1
      }],
      chargeDList: [{
        label: '按时间',
        id: 0
      }],
      rules: {
        temperature: [
          { required: true, message: '请输入过温温度', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '请输入ip', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '请输入端口号', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入类型', trigger: 'blur' }
        ]
      },
      ruleSetEquipment: {
        maxPower: [
          { required: true, message: '请输入最大功率', trigger: 'blur' }
        ],
        autoStopPower: [
          { required: true, message: '请输入充满自停功率', trigger: 'blur' }
        ],
        minuts: [
          { required: true, message: '请输入充满自停延长时间', trigger: 'blur' }
        ]
      },
      mapDialogVisible: false,
      zoom: 16,
      center: [114.01669, 33.580473],
      reqPosition: {
        click(e) {
          const { lng, lat } = e.lnglat
          self.setEquipment.lng = lng
          self.setEquipment.lat = lat
          self.mapDialogVisible = false
        }
      }
    }
  },
  created() {
    this.update_setRate = this.permissions['update_setRate']
    this.del_setEquipment = this.permissions['del_setEquipment']
    this.send_setEquipment = this.permissions['send_setEquipment']
    this.ip_setEquipment = this.permissions['ip_setEquipment']
    this.temp_setEquipment = this.permissions['temp_setEquipment']
    this.edit_equipment = this.permissions['edit_equipment']
    this.update_equipment = this.permissions['update_equipment']
    this.updata_circuit = this.permissions['updata_circuit']
    this.look_circle = this.permissions['look_circle']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleOpenMapDialog() {
      this.mapDialogVisible = true
    },
    getList() {
      this.listLoading = true
      getEquipPage(this.listQuery).then(res => {
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
    handleGetUpdateDeviceInfo(rows) {
      this.dialogStatus = 'updateDevice'
      Object.assign(this.setEquipment, rows)
      this.formDialogVisible = true
    },
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      Object.assign(this.setEquipment, rows)
      this.formDialogVisible = true
    },
    handleDeviceUptForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editEquipment(this.setEquipment).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false
              this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success'
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleUptForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editEquipment(this.setEquipment).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false
              this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success'
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleDetail(rows) {
      singleEquipment(rows.id).then(res => {
        if (res.data.code === 0) {
          this.dialogStatus = 'detail'
          this.setEquipment = res.data.data
          this.formDialogVisible = true
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    handleSendDevice(row) {
      const obj = {
        code: row.code
      }
      getEquiInfo(obj).then(res => {
        if (res.data.code === 0) {
          this.getList()
          this.$notify({
            title: '成功',
            message: '发送查询设备参数成功',
            type: 'success'
          })
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    handleSetTemp(row) {
      this.setTempForm.temperature = undefined
      this.setTempForm.code = row.code
      this.setTempformDialogVisible = true
    },
    handleSetTempSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getList()
          setTemp(this.setTempForm).then(res => {
            if (res.data.code === 0) {
              this.setTempformDialogVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '发送过温保护参数成功',
                type: 'success'
              })
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleGetUpdateIpInfo(row) {
      this.ipInfoForm.code = row.code
      this.ipInfoDialogVisible = true
    },
    handleIpInfoSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getUpdateIpInfo(this.ipInfoForm).then(res => {
            if (res.data.code === 0) {
              this.getList()
              this.$notify({
                title: '成功',
                message: '设置设备IP成功',
                type: 'success'
              })
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleDetEquirment(row) {
      delEquipment(row.code).then(res => {
        if (res.data.code === 0) {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    handleUpdateLines(row) {
      const obj = {
        code: row.code
      }
      updateLines(obj).then(res => {
        if (res.data.code === 0) {
          this.getList()
          this.$notify({
            title: '成功',
            message: '获取成功',
            type: 'success'
          })
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    handleGetCircuitListObj(row) {
      this.circuitListQuery.code = row.code
      getListObj(this.circuitListQuery).then(res => {
        if (res.data.code === 0) {
          this.circuittotal = res.data.data.total
          this.circuittableData = res.data.data.records
          this.dialogTableVisible = true
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

