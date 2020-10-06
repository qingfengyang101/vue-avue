<template>
  <div>
    <h2 class="layout-pages-title">设备管理</h2>
    <div>
      <div class="layout-pages-search"
           style="width: 100%;">
        <el-row>
          <el-col :span='3'>
            <el-select v-model="searchLabel"
                       size="small"
                       @change="handleSearchLabel"
                       class="searchSelect">
              <el-option v-for="item in searchList"
                         :key="item.id"
                         :label="item.label"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span='3'
                  v-if="searchLabel === 0">
            <el-input placeholder="请输入设备序列号"
                      size="small"
                      class="search-btn"
                      v-model="listQuery.deviceKey"
                      @keyup.native.enter='handleFilter'
                      clearable>
            </el-input>
          </el-col>
          <el-col :span='3'
                  v-if="searchLabel === 1">
            <el-input placeholder="请输入设备名称"
                      size="small"
                      class="search-btn"
                      v-model="listQuery.deviceName"
                      @keyup.native.enter='handleFilter'
                      clearable>
            </el-input>
          </el-col>
          <el-col :span='1'
                  :offset="1">
            <el-button size="small"
                       type="primary"
                       @click="handleFilter">搜索</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="layout-pages-content content-device">
        <p class="total-number">(共<span>{{total}}</span>条数据)</p>
        <el-button type="success"
                   size="mini"
                   class="btn-opearator"
                   v-if="add_gateDevice"
                   @click="handleAdd">添加设备</el-button>
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
                           label="设备序列号">
            <template slot-scope="scope">
              <span>{{scope.row.deviceKey}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           label="应用名称">
            <template slot-scope="scope">
              <span v-if="false">{{scope.row.name}}</span>
              <span>{{quartersName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           label="设备名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           label="版本号">
            <template slot-scope="scope">
              <span>{{scope.row.versionNo}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           width="350px"
                           label="操作">
            <template slot-scope="scope">
              <span class="tag-opearte"
                    @click="handleDeviceState(scope)"
                    v-if="look_deviceState"
                    effect="plain">
                状态查询
              </span>
              <!-- <span class="tag-opearte"
                    effect="plain"
                    v-if="set_authPeople"
                    @click="handleAuth(scope)">
                人员授权
              </span> -->
              <span class="tag-opearte"
                    v-if="del_gateDevice"
                    @click="handleDel(scope)">
                删除
              </span>
              <el-dropdown>
                <span class="el-dropdown-link tag-opearte"
                      effect="plain">
                  更多
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleUpgrade(scope)"
                                    v-if="upgrade_device">设备升级</el-dropdown-item>
                  <el-dropdown-item divided
                                    @click.native="handleResetDevice(scope)"
                                    v-if="reset_device">设备重置</el-dropdown-item>
                  <el-dropdown-item divided
                                    @click.native='handleDataProofreading(scope)'
                                    v-if="jiaodui_device">数据校对</el-dropdown-item>

                  <el-dropdown-item divided
                                    @click.native="handleEquipmentSync(scope)"
                                    v-if="sync_device">设备同步</el-dropdown-item>
                  <el-dropdown-item divided
                                    @click.native="handleUpdate(scope)"
                                    v-if="update_gateDevice">修改信息</el-dropdown-item>
                  <!-- <el-dropdown-item divided
                                    @click.native="handleTokenPhoto(scope)"
                                    v-if="register_photo">设备拍照注册</el-dropdown-item> -->
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
    </div>
    <!-- 编辑、详情、添加 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="formDialogVisible">
      <el-form :model="gateDeviceForm"
               :rules="rules"
               ref="gateDeviceForm"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="小区名称">
              <el-input v-model="quartersName"
                        clearable
                        size="small"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备序列号"
                          prop="deviceKey">
              <el-input v-model="gateDeviceForm.deviceKey"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail' || editFlag"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备名称"
                          prop="name">
              <el-input v-model="gateDeviceForm.name"
                        clearable
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
                   @click="handleSubmit('gateDeviceForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('gateDeviceForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 设备状态 -->
    <el-dialog title="状态查询"
               width="40%"
               :visible.sync="deviceDialogVisible">
      <el-form :model="deviceStatus"
               label-width="100px">
        <el-form-item label="设备状态：">
          <el-row>
            <el-col :span="8">
              <!-- 设备状态，1：未绑定，2：绑定中，3：未同步，4：同步中，5：已同步，6：已禁用，7：禁用中，8：启用中，100+：升级中 -->
              <el-input v-if="deviceStatus.state === 1"
                        size="small"
                        value="未绑定"
                        :disabled="true"></el-input>
              <el-input v-if="deviceStatus.state === 2"
                        size="small"
                        value="绑定中"
                        :disabled="true"></el-input>
              <el-input v-if="deviceStatus.state === 3"
                        size="small"
                        value="解绑中"
                        :disabled="true"></el-input>
              <el-input v-if="deviceStatus.state === 4"
                        size="small"
                        value="未同步"
                        :disabled="true"></el-input>
              <el-input v-if="deviceStatus.state === 5"
                        size="small"
                        value="同步中"
                        :disabled="true"></el-input>
              <el-input v-if="deviceStatus.state === 6"
                        size="small"
                        value="已同步"
                        :disabled="true"></el-input>
              <el-input v-if="deviceStatus.state === 7"
                        size="small"
                        value="已禁用"
                        :disabled="true"></el-input>
              <el-input v-if="deviceStatus.state === 8"
                        size="small"
                        value="禁用中"
                        :disabled="true"></el-input>
              <el-input v-if="deviceStatus.state === 9"
                        size="small"
                        value="启用中"
                        :disabled="true"></el-input>
            </el-col>
            <el-col :span="4"
                    v-if="showBtnFlage"
                    :offset="1">
              <el-button type="primary"
                         size="small"
                         v-if="!stateFlag"
                         @click="handleStateAble">启用</el-button>
              <el-button type="danger"
                         size="small"
                         v-if="stateFlag"
                         @click="handleStateDisabled">禁用
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="网络状态："
                      prop="deviceKey">
          <el-row>
            <el-col :span="11">
              <el-input v-if="deviceStatus.status === 1"
                        size="small"
                        value="在线"
                        :disabled="true"></el-input>
              <el-input v-if="deviceStatus.status === 2"
                        size="small"
                        value="离线"
                        :disabled="true"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="版本号："
                      prop="name">
          <el-row>
            <el-col :span="11">
              <el-input v-model="deviceStatus.versionNo"
                        size="small"
                        :disabled="true"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="deviceDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, addObj, putObj, delObj, deviceState, deviceDisable, deviceAble, upgrade, dataProofreading, equipmentSynchronization, resetDevice } from '@/api/gateDevice'
export default {
  props: {
    query: Object,
    quartersName: String
  },
  data() {
    return {
      add_gateDevice: false,
      update_gateDevice: false,
      del_gateDevice: false,
      upgrade_device: false,
      listLoading: false,
      register_photo: false,
      look_deviceState: false,
      set_authPeople: false,
      sync_device: false,
      jiaodui_device: false,
      reset_device: false,
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 10,
        deviceKey: undefined
        // appId: undefined,
        // appKey: undefined,
        // appSecret: undefined
      },
      formDialogVisible: false,
      multipleSelection: [],
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      gateDeviceForm: {
        deviceKey: undefined,
        name: undefined,
        quartersId: undefined
      },
      rules: {
        deviceKey: [
          { required: true, message: '请输入设备序列号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ]
      },
      searchList: [{
        id: 0,
        label: '设备序列号'
      }, {
        id: 1,
        label: '设备名称'
      }],
      searchLabel: 0,
      deviceDialogVisible: false,
      deviceStatus: {
        versionNo: undefined,
        state: undefined,
        status: undefined
      },
      stateFlag: true,
      showBtnFlage: true,
      editFlag: false,
      quartersId: undefined
    }
  },
  watch: {
    query: {
      handler: function(val) {
        if (val) {
          this.listQuery.quartersId = val.quartersId
          this.quartersId = val.quartersId
          console.log(this.quartersId)
          this.getList()
        }
      },
      deep: true
    },
    deviceStatus(val) {
      if (val.state === 5 || val.state === 6) {
        this.showBtnFlage = true
        this.stateFlag = true
      } else if (val.state === 7) {
        this.showBtnFlage = true
        this.stateFlag = false
      } else {
        this.showBtnFlage = false
      }
    }
  },
  created() {
    this.add_gateDevice = this.permissions['add_gateDevice']
    this.update_gateDevice = this.permissions['update_gateDevice']
    this.del_gateDevice = this.permissions['del_gateDevice']
    this.look_deviceState = this.permissions['look_deviceState']
    this.set_authPeople = this.permissions['set_authPeople']
    this.sync_device = this.permissions['sync_device']
    this.jiaodui_device = this.permissions['jiaodui_device']
    this.reset_device = this.permissions['reset_device']
    this.upgrade_device = this.permissions['upgrade_device']
    this.register_photo = this.permissions['register_photo']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    // this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getListObj(this.listQuery).then(res => {
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
    handleAdd() {
      this.dialogStatus = 'create'
      this.editFlag = false
      this.resetForm()

      this.formDialogVisible = true
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addObj(this.gateDeviceForm).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false
              this.$notify({
                title: '成功',
                message: '新增成功',
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
    handleUpdate(rows) {
      this.resetForm()
      this.editFlag = true
      this.dialogStatus = 'update'
      this.gateDeviceForm.name = rows.row.name
      this.gateDeviceForm.deviceKey = rows.row.deviceKey
      this.gateDeviceForm.quartersId = rows.row.quartersId
      this.formDialogVisible = true
    },
    handleUptForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          putObj(this.gateDeviceForm).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false
              this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success'
              })
              this.editFlag = true
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
    handleDel(row) {
      this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const obj = {
          deviceKey: row.row.deviceKey
        }
        delObj(obj).then(res => {
          if (res.data.code === 0) {
            this.formDialogVisible = false
            this.$notify({
              title: '成功',
              message: '删除成功',
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
      })
    },
    resetForm() {
      this.gateDeviceForm = {
        deviceKey: undefined,
        name: undefined,
        quartersId: this.quartersId
      }
    },
    handleSearchLabel() {
      if (this.searchLabel === 0) {
        this.listQuery.deviceName = undefined
      } else if (this.searchLabel === 1) {
        this.listQuery.deviceKey = undefined
      }
    },
    deviceStateFun(obj) {
      deviceState(obj).then(res => {
        if (res.data.code === 0) {
          this.deviceStatus = res.data.data.data
          this.deviceDialogVisible = true
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    handleDeviceState(row) {
      const obj = {
        deviceKey: row.row.deviceKey
      }
      this.deviceStateFun(obj)
    },
    handleStateAble() {
      const obj = {
        deviceKey: this.deviceStatus.deviceKey
      }
      deviceAble(obj).then(res => {
        if (res.data.code === 0) {
          this.stateFlag = true
          this.deviceStateFun(obj)
          this.$notify({
            title: '成功',
            message: res.data.msg,
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
    handleStateDisabled() {
      const obj = {
        deviceKey: this.deviceStatus.deviceKey
      }
      deviceDisable(obj).then(res => {
        if (res.data.code === 0) {
          this.stateFlag = false
          this.deviceStateFun(obj)
          this.$notify({
            title: '成功',
            message: res.data.msg,
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
    handleUpgrade(row) {
      this.$confirm('是否升级此设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const obj = {
          deviceKey: row.row.deviceKey
        }
        upgrade(obj).then(res => {
          if (res.data.code === 0) {
            this.formDialogVisible = false
            this.$notify({
              title: '成功',
              message: res.data.msg,
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
      })
    },
    handleDataProofreading(row) {
      this.$confirm('是否数据校对此设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const obj = {
          deviceKey: row.row.deviceKey,
          appId: row.row.appId,
          appKey: this.listQuery.appKey,
          appSecret: this.listQuery.appSecret
        }
        dataProofreading(obj).then(res => {
          if (res.data.code === 0) {
            this.formDialogVisible = false
            this.$notify({
              title: '成功',
              message: res.data.msg,
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
      })
    },
    handleEquipmentSync(row) {
      this.$confirm('是否同步此设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const obj = {
          deviceKey: row.row.deviceKey
        }
        equipmentSynchronization(obj).then(res => {
          if (res.data.code === 0) {
            this.formDialogVisible = false
            this.$notify({
              title: '成功',
              message: res.data.msg,
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
      })
    },
    handleResetDevice(row) {
      this.$confirm('是否重置此设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const obj = {
          deviceKey: row.row.deviceKey
        }
        resetDevice(obj).then(res => {
          if (res.data.code === 0) {
            this.formDialogVisible = false
            this.$notify({
              title: '成功',
              message: res.data.msg,
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
      })
    },
    handleTokenPhoto(row) {
      this.$emit('handleTokenPhoto', row)
    }
    // handleAuth(row) {
    //   this.$emit('handleAuth', row)
    // }
  }
}
</script>

<style lang="scss">
</style>

