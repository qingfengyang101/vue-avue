<template>
  <div>
    <h2 class="layout-pages-title">设备列表</h2>
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
        <el-col :span="4">
          <el-input placeholder="请输入设备名称"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.doorPhoneName"
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
    <div class="layout-pages-content">
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <el-button type="success"
                 size="mini"
                 class="btn-opearator"
                 v-if="add_drDoorphone"
                 @click="handleAdd">添加设备</el-button>
      <el-table :data="tableData"
                class="layout-pages-content-table"
                @selection-change="handleSelectionChange"
                style="width: 100%">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="名称">
          <template slot-scope="scope">
            <span>{{scope.row.doorphoneName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="小区">
          <template slot-scope="scope">
            <span>{{scope.row.quartersName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="楼栋">
          <template slot-scope="scope">
            <span>{{scope.row.buildName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="单元">
          <template slot-scope="scope">
            <span>{{scope.row.unitName}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center"
                         label="设备类型">
          <template slot-scope="scope">
            <span v-if="scope.row.doorType === '0'">
              <el-tag>WG26</el-tag>
            </span>
            <span v-if="scope.row.doorType === '1'">
              <el-tag>WG34门禁机</el-tag>
            </span>
            <span v-if="scope.row.doorType === '2'">
              <el-tag>电梯按层</el-tag>
            </span>
            <span v-if="scope.row.doorType === '3'">
              <el-tag>电梯直达</el-tag>
            </span>
          </template>
        </el-table-column> -->
        <el-table-column align="center"
                         label="门禁机类型">
          <template slot-scope="scope">
            <span v-if="scope.row.doorphoneType === '0'">
              <el-tag>门口机</el-tag>
            </span>
            <span v-if="scope.row.doorphoneType === '1'">
              <el-tag>物业机</el-tag>
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center"
                         label="云之讯">
          <template slot-scope="scope">
            <span>{{scope.row.token }}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center"
                         label="在线状态">
          <template slot-scope="scope">
            <span>{{scope.row.networkState }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '0'">
              <el-tag type="info">未激活</el-tag>
            </span>
            <span v-if="scope.row.status === '1'">
              <el-tag>已激活</el-tag>
            </span>
            <span v-if="scope.row.status === '2'">
              <el-tag type="warning">已冻结</el-tag>
            </span>
            <span v-if="scope.row.status === '3'">
              <el-tag type="danger">已删除</el-tag>
            </span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         width="300px"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="update_drDoorphone"
                  @click="handleUpdate(scope.row)"
                  effect="plain">
              编辑
            </span>
            <span class="tag-opearte"
                  @click="handleDel(scope.row)"
                  v-if="del_drDoorphone"
                  effect="plain">
              删除
            </span>
            <span class="tag-opearte"
                  @click="handleDetail(scope.row)"
                  effect="plain">
              详情
            </span>
            <span class="tag-opearte"
                  @click="handleBindUser(scope.row)"
                  v-if="jh_dj_device"
                  effect="plain">
              激活/冻结
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
    <!-- 编辑、详情、添加 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="formDialogVisible"
               width="60%">
      <el-form :model="drDoorphoneForm"
               :rules="rules"
               ref="drDoorphoneForm"
               label-width="100px">
        <el-row v-if="dialogStatus === 'detail'">
          <el-col :span="12">
            <el-form-item label="MAC地址"
                          prop="doorphoneMac">
              <el-input v-model="drDoorphoneForm.doorphoneMac"
                        size="small"
                        clearable
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <el-form-item label="小区"
                          prop="communityId">
              <el-select v-model="drDoorphoneForm.communityId"
                         :disabled="dialogStatus=== 'detail'"
                         size="small"
                         placeholder="请选择小区">
                <el-option v-for="item in villageArr"
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
            <el-form-item label="楼栋"
                          prop="buildingId">
              <el-select v-model="drDoorphoneForm.buildingId"
                         :disabled="dialogStatus=== 'detail'"
                         size="small"
                         clearable
                         placeholder="请选择楼栋">
                <el-option v-for="item in buildingArr"
                           :key="item.buildsId"
                           :label="item.buildsName"
                           :value="item.buildsId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <el-form-item label="单元"
                          prop="unitId">
              <el-select v-model="drDoorphoneForm.unitId"
                         :disabled="dialogStatus=== 'detail'"
                         clearable
                         size="small"
                         placeholder="请选择单元">
                <el-option v-for="item in unitArr"
                           :key="item.unitId"
                           :label="item.unitName"
                           :value="item.unitId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称"
                          prop="doorphoneName">
              <el-input v-model="drDoorphoneForm.doorphoneName"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备序列号"
                          prop="doorphoneSerialId">
              <el-input v-model="drDoorphoneForm.doorphoneSerialId"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备类型"
                          prop="doorType">
              <el-select v-model="drDoorphoneForm.doorType"
                         clearable
                         size="small"
                         :disabled="dialogStatus=== 'detail'"
                         placeholder="请选择">
                <el-option label="WG26"
                           value="0">
                </el-option>
                <el-option label="WG34门禁机"
                           value="1">
                </el-option>
                <el-option label="电梯按层"
                           value="2">
                </el-option>
                <el-option label="电梯直达"
                           value="3">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="场景类型"
                          prop="doorphoneType">
              <el-select v-model="drDoorphoneForm.doorphoneType"
                         clearable
                         size="small"
                         :disabled="dialogStatus=== 'detail'"
                         placeholder="请选择">
                <el-option label="门口机"
                           value="0">
                </el-option>
                <el-option label="物业机"
                           value="1">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="云之讯"
                          prop="accountId">
              <el-select v-model="drDoorphoneForm.accountId"
                         size="small"
                         :disabled="dialogStatus=== 'detail'">
                <el-option v-for="item in yunList"
                           size="small"
                           :key="item.token"
                           :label="item.accountId"
                           :value="item.accountId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="人脸识别"
                          prop="faceStatus">
              <el-radio-group v-model="drDoorphoneForm.faceStatus"
                              :disabled="dialogStatus=== 'detail'">
                <el-radio label="0">不启用</el-radio>
                <el-radio label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="人体感应"
                          prop="humanStatus">
              <el-radio-group v-model="drDoorphoneForm.humanStatus"
                              :disabled="dialogStatus=== 'detail'">
                <el-radio label="0">启用</el-radio>
                <el-radio label="1">不启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备密码"
                          prop="password">
              <el-input v-model="drDoorphoneForm.password"
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
                   @click="handleSubmit('drDoorphoneForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('drDoorphoneForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改设备状态"
               width="30%"
               :visible.sync="editDeviceStatus">
      <el-form :model="editDeviceForm"
               :rules="rules"
               ref="editDeviceForm"
               label-width="100px">
        <el-form-item label="选择状态"
                      prop="status">
          <el-switch v-model="editDeviceForm.status"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     
                     active-value="1"
                     inactive-value="2"
                     active-text="激活"
                     inactive-text="禁用">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleEditDevice('editDeviceForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="editDeviceStatus = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, addObj, putObj, delObj, getSingleObj, updateStatus, drYunzhixunList } from '@/api/doorDevice'
import { getQuarterByRole, getBuildsListByquartersId, getUnitListByBuildId } from '@/api/village'
export default {
  data() {
    return {
      add_drDoorphone: false,
      update_drDoorphone: false,
      jh_dj_device: false,
      del_drDoorphone: false,
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
      drDoorphoneForm: {
        communityId: undefined,
        buildingId: undefined,
        unitId: undefined,
        name: undefined,
        buildsName: undefined,
        unitName: undefined,
        doorphoneName: undefined,
        doorType: undefined,
        doorphoneType: undefined,
        token: undefined,
        faceStatus: '0',
        password: undefined,
        doorphoneMac: undefined,
        doorphoneSerialId: undefined,
        humanStatus: '1',
        accountId: undefined
      },
      rules: {
        doorphoneName: [
          { required: true, message: '请输入门禁卡', trigger: 'blur' }
        ],
        doorType: [
          { required: true, message: '请输入设备类型', trigger: 'blur' }
        ],
        // accountId: [
        //   { required: true, message: '请选择云之讯', trigger: 'change' }
        // ],
        communityId: [
          { required: true, message: '请选择小区', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        doorphoneSerialId: [
          { required: true, message: '请输入设备序列号', trigger: 'blur' }
        ]
      },
      villageArr: [],
      buildingArr: [],
      unitArr: [],
      quartersId: '',
      villageOptions: [],
      editDeviceStatus: false,
      editDeviceForm: {
        doorphoneId: undefined,
        status: undefined
      },
      yunList: [],
      mutiSelect: false
    }
  },
  created() {
    this.add_drDoorphone = this.permissions['add_drDoorphone']
    this.update_drDoorphone = this.permissions['update_drDoorphone']
    this.del_drDoorphone = this.permissions['del_drDoorphone']
    this.jh_dj_device = this.permissions['jh_dj_device']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    'drDoorphoneForm.communityId': function(val) {
      this.handleChangeVillage()
    },
    'drDoorphoneForm.buildingId': function(val) {
      this.handleChangeBuilding()
    },
    'drDoorphoneForm.accountId': function(val) {
      if (val) {
        this.handleChangeToken()
      }
    }
  },
  beforeMount() {
    var self = this
    this.intervalid = setInterval(() => {
      self.handleFilter()
    }, 60000)
  },
  mounted() {
    // this.getList()
    this.handleGetAllListObj()
    this.handleDrYunzhixunList()
  },
  // mounted() {
  //   this.handleGetAllListObj()
  // },
  methods: {
    handleDrYunzhixunList() {
      drYunzhixunList().then(res => {
        if (res.data.code === 0) {
          this.yunList = res.data.data
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    getList() {
      getListObj(this.listQuery).then(res => {
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
      this.resetForm()
      this.buildingArr = []
      this.unitArr = []
      this.formDialogVisible = true
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addObj(this.drDoorphoneForm).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success'
              })
              this.getList()
              this.handleDrYunzhixunList()
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
      this.dialogStatus = 'update'
      this.yunList.push({
        accountId: rows.accountId,
        doorphoneId: rows.doorphoneId,
        token: rows.token
      })
      this.resetForm()
      this.mutiSelect = true
      this.formDialogVisible = true
      Object.assign(this.drDoorphoneForm, rows)
    },
    handleUptForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          putObj(this.drDoorphoneForm).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false
              this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success'
              })
              this.getList()
              this.handleDrYunzhixunList()
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
        delObj(row.doorphoneId).then(res => {
          if (res.data.code === 0) {
            this.handleDrYunzhixunList()
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
      })
    },
    resetForm() {
      this.drDoorphoneForm = {
        communityId: undefined,
        buildingId: undefined,
        unitId: undefined,
        name: undefined,
        buildsName: undefined,
        unitName: undefined,
        doorphoneName: undefined,
        doorType: undefined,
        doorphoneType: undefined,
        token: undefined,
        faceStatus: '0',
        password: undefined,
        doorphoneMac: undefined,
        doorphoneSerialId: undefined,
        humanStatus: '1',
        accountId: undefined
      }
    },
    handleDetail(rows) {
      getSingleObj(rows.doorphoneId).then(res => {
        if (res.data.code === 0) {
          this.dialogStatus = 'detail'
          this.mutiSelect = true
          this.drDoorphoneForm = res.data.data
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
    handleGetAllListObj() {
      getQuarterByRole().then(res => {
        this.villageOptions = []
        const requireInfo = res.data.data
        this.allList = requireInfo
        if (requireInfo) {
          if (requireInfo.length) {
            requireInfo.forEach(item => {
              delete item.bulidList
              this.villageOptions.push(item)
              this.villageArr.push(item)
            })
          }
          if (this.villageOptions.length) {
            this.listQuery.quartersId = this.villageOptions[0].quartersId
            this.getList()
          }
        }
      })
    },
    handleChangeVillage() {
      if (this.dialogStatus === 'create') {
        this.drDoorphoneForm.buildingId = undefined
        this.drDoorphoneForm.unitId = undefined
      }
      if (this.dialogStatus === 'detail' || this.dialogStatus === 'update') {
        if (this.mutiSelect === false) {
          this.drDoorphoneForm.buildingId = undefined
          this.drDoorphoneForm.unitId = undefined
        }
        if (this.drDoorphoneForm.buildingId === '0') {
          this.drDoorphoneForm.buildingId = undefined
        }
        if (this.drDoorphoneForm.unitId === '0') {
          this.drDoorphoneForm.unitId = undefined
        }
      }
      this.buildingArr = []
      this.unitArr = []
      getBuildsListByquartersId({ quartersId: this.drDoorphoneForm.communityId }).then(res => {
        if (res.data.code === 0) {
          this.buildingArr = res.data.data
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    handleChangeBuilding() {
      if (this.dialogStatus === 'create') {
        this.drDoorphoneForm.unitId = undefined
      }
      if (this.dialogStatus === 'detail' || this.dialogStatus === 'update') {
        if (this.mutiSelect === false) {
          this.drDoorphoneForm.unitId = undefined
          this.mutiSelect = true
        }
        if (this.drDoorphoneForm.unitId === '0') {
          this.drDoorphoneForm.unitId = undefined
        }
      }
      this.unitArr = []
      getUnitListByBuildId({ buildsId: this.drDoorphoneForm.buildingId }).then(res => {
        if (res.data.code === 0) {
          this.unitArr = res.data.data
          this.mutiSelect = false
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    handleBindUser(row) {
      this.dialogStatus = 'detail'
      this.editDeviceForm.doorphoneId = row.doorphoneId
      this.editDeviceForm.status = row.status
      this.editDeviceStatus = true
    },
    handleEditDevice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateStatus(this.editDeviceForm).then(res => {
            if (res.data.code === 0) {
              this.editDeviceStatus = false
              this.$notify({
                title: '成功',
                message: '状态更新成功',
                type: 'success'
              })
              this.getList()
              this.handleDrYunzhixunList()
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
    handleChangeToken() {
      const tokenFindItem = this.yunList.find(item => {
        if (item.accountId === this.drDoorphoneForm.accountId) {
          return item
        }
      })
      this.drDoorphoneForm.token = undefined
      this.drDoorphoneForm.token = tokenFindItem.token
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalid)
  }
}
</script>


