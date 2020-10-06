<template>
  <div>
    <h2 class="layout-pages-title">小区管理</h2>
    <div class="layout-pages-search">
      <el-input placeholder="请输入小区名"
                size="small"
                class="search-btn"
                v-model="listQuery.name"
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
                 v-if="add_village"
                 @click="handleAdd">添加新小区</el-button>
      <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 v-if="del_village"
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
                         label="小区名">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="省份">
          <template slot-scope="scope">
            <span>{{scope.row.province}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="城市">
          <template slot-scope="scope">
            <span>{{scope.row.city}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="区县">
          <template slot-scope="scope">
            <span>{{scope.row.area}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="具体地址">
          <template slot-scope="scope">
            <span>{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="警务区">
          <template slot-scope="scope">
            <span>{{scope.row.police}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="警务电话">
          <template slot-scope="scope">
            <span>{{scope.row.policePhone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="btn-opearator btn-edit"
                  v-if="update_village"
                  @click="handleUpdate(scope.row)">编辑&nbsp;/&nbsp;</span>
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
      <el-form :model="villageForm"
               :rules="rules"
               ref="villageForm"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="小区名称"
                          prop="name">
              <el-input v-model="villageForm.name"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="具体地址"
                          prop="address">
              <el-input v-model="villageForm.address"
                        size="small"
                        clearable
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="省市区"
                          prop="area">
              <v-distpicker :province="villageForm.province"
                            :disabled="dialogStatus=== 'detail'"
                            :city="villageForm.city"
                            :area="villageForm.area"
                            @province="onChangeProvince"
                            @city="onChangeCity"
                            @area='onChangeArea'></v-distpicker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="警务区"
                          prop="police">
              <el-input v-model="villageForm.police"
                        size="small"
                        clearable
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="警务电话"
                          prop="policePhone">
              <el-input v-model="villageForm.policePhone"
                        size="small"
                        clearable
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="小区经度"
                          prop="longitude">
              <el-input v-model="villageForm.longitude"
                        size="small"
                        clearable
                        @focus="handleOpenMapDialog"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小区纬度"
                          prop="latitude">
              <el-input v-model="villageForm.latitude"
                        @focus="handleOpenMapDialog"
                        size="small"
                        clearable
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="呼叫规则"
                          prop="callrule">
            <el-select v-model="villageForm.callrule"
                      size="small"
                      @change="handleFilter"
                      placeholder="请选择呼叫规则">
              <el-option size="small" label="楼号*单元*房间号" value="Q*B*R"></el-option>
              <el-option size="small" label="楼号单元房间号" value="QBR"></el-option>
            </el-select>
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
                   @click="handleSubmit('villageForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('villageForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, addObj, putObj, delObj, getSIngleObj } from '@/api/village'
import { validateSignature } from '@/api/validator'
import VDistpicker from 'v-distpicker'
export default {
  data() {
    const areaReg = (rules, value, callback) => {
      if (value.indexOf('区') === 0) {
        callback(new Error('请输入省市区'))
      } else {
        callback()
      }
    }
    const self = this
    return {
      add_village: false,
      update_village: false,
      del_village: false,
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
      villageForm: {
        quartersId: undefined,
        name: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        address: undefined,
        police: undefined,
        policePhone: undefined,
        longitude: undefined,
        latitude: undefined,
        callrule: undefined
      },
      rules: {
        name: [
          { required: true, message: '请输入小区名称', trigger: 'blur' },
          {
            validator: validateSignature,
            trigger: 'blur'
          }
        ],
        address: [
          { required: true, message: '请输入小区详细地址', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请选择小区所在的省市区', trigger: 'change' },
          { validator: areaReg, trigger: 'blur' }
        ],
        callrule: [
          { required: true, message: '请选择呼叫规则', trigger: 'change' },
        ]
      },
      mapDialogVisible: false,
      zoom: 16,
      center: [114.01669, 33.580473],
      reqPosition: {
        click(e) {
          const { lng, lat } = e.lnglat
          self.villageForm.longitude = lng
          self.villageForm.latitude = lat
          self.mapDialogVisible = false
        }
      }
    }
  },
  created() {
    this.add_village = this.permissions['add_village']
    this.update_village = this.permissions['update_village']
    this.del_village = this.permissions['del_village']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
  },
  components: { VDistpicker },
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
      this.resetForm()
      this.formDialogVisible = true
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addObj(this.villageForm).then(res => {
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
      this.dialogStatus = 'update'
      Object.assign(this.villageForm, rows)
      this.formDialogVisible = true
    },
    handleUptForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          putObj(this.villageForm).then(res => {
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
    handleDel() {
      if (this.multipleSelection.length) {
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const delIds = {
            ids: ''
          }
          this.multipleSelection.forEach(item => {
            delIds.ids += item.quartersId + ','
          })
          delIds.ids = delIds.ids.substring(0, delIds.ids.length - 1)
          delObj(delIds).then(res => {
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
      } else {
        this.$notify({
          title: '失败',
          message: '请选择要删除的数据',
          type: 'error'
        })
      }
    },
    onChangeProvince(data) {
      this.villageForm.province = data.value
    },
    onChangeCity(data) {
      this.villageForm.city = data.value
    },
    onChangeArea(data) {
      this.villageForm.area = data.value
    },
    resetForm() {
      this.villageForm = {
        quartersId: undefined,
        name: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        address: undefined,
        police: undefined,
        policePhone: undefined,
        longitude: undefined,
        latitude: undefined
      }
    },
    handleDetail(rows) {
      getSIngleObj(rows.quartersId).then(res => {
        if (res.data.code === 0) {
          this.dialogStatus = 'detail'
          this.villageForm = res.data.data
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
    handleOpenMapDialog() {
      this.mapDialogVisible = true
    }
  }
}
</script>

