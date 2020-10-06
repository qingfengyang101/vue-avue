<template>
  <div>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="4">
          <el-input placeholder="请输入车场名称"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.parkName"
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
                 v-if="add_parkingYarn"
                 class="btn-opearator"
                 @click="handleAdd">添加停车场</el-button>
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
                         label="车场名称">
          <template slot-scope="scope">
            <span>{{scope.row.pname}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="编码">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="停车场地址">
          <template slot-scope="scope">
            <span>{{scope.row.addr}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="总车位">
          <template slot-scope="scope">
            <span>{{scope.row.tlot}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="空车位">
          <template slot-scope="scope">
            <span>{{scope.row.elot}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="停车场电话">
          <template slot-scope="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         width="346"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="del_parkingYarn"
                  @click="handleDel(scope.row)"
                  effect="plain">
              删除
            </span>
            <span class="tag-opearte"
                  v-if="del_parkingYarn"
                  @click="handleFetch(scope.row)"
                  effect="plain">
              查看设备
            </span>
            <span class="tag-opearte"
                  v-if="del_parkingYarn"
                  @click="mapFetch(scope.row)"
                  effect="plain">
              查看地图
            </span>
            <span class="tag-opearte"
                  v-if="del_parkingYarn"
                  @click="getUpdateDeviceByParkId(scope.row)"
                  effect="plain">
              更新设备
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
               width="40%"
               :visible.sync="formDialogVisible">
      <el-row>
        <el-col :span="12">
          <el-form :model="parkingYarnForm"
                   :rules="rules"
                   ref="parkingYarnForm"
                   label-width="100px">
            <el-form-item label="code"
                          prop="code">
              <el-input v-model="parkingYarnForm.code"
                        size="small"
                        clearable
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
            <el-form-item label="小区"
                          prop="deptId">
              <el-select v-model="parkingYarnForm.deptId"
                        size="small">
                <el-option v-for="item in parkingList"
                          size="small"
                          :key="item.quartersId"
                          :label="item.name"
                          :value="item.quartersId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="0元放行"
                          prop="zeroflag">
              <el-select v-model="parkingYarnForm.zeroflag"
                        size="small">
                <el-option size="small" label="N-关闭" value="N"></el-option>
                <el-option size="small" label="Y-开启" value="Y"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false"
                   v-if="dialogStatus=== 'create' || dialogStatus=== 'update'">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'create'"
                   @click="handleSubmit('parkingYarnForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('parkingYarnForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="停车场设备"
      :visible.sync="centerDialogVisible"
      width="40%"
      center>
      
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, addObj, delObj, getUpdateDeviceByParkId } from '@/api/parkingYarn'
//import { selectParkingLotDropdownBox } from '@/api/parkingYarn'

import { getQuarterByRole } from '@/api/village'
export default {
  props: {
    parkingListFlag: Boolean
  },
  data() {
    return {
      del_parkingYarn: false,
      add_parkingYarn: false,
      list: [],
      total: 0,
      listLoading: false,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20
      },
      release: 'N' ,
      multipleSelection: [],
      photoShowDialog: false,
      dialogPhoto: '',
      parkingList: [],
      parkingYarnForm: {
        code: '',
        deptId: '',
        zeroflag: 'N'
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
        deptId: [
          { required: true, message: '请选择小区', trigger: 'change' }
        ]
      },
      timer: 0,
      centerDialogVisible: false,
      activeName: '', // 绑定值，选中选项卡的 name
    }
  },
  watch: {
    parkingListFlag: {
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
    this.del_parkingYarn = this.permissions['del_parkingYarn']
    this.add_parkingYarn = this.permissions['add_parkingYarn']
    this.handleInit()
  },
  beforeDestroy() {
    const { timer } = this;

    window.clearTimeout(timer)
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    /** 
     * 查看停车场设备
    */
    handleFetch(row) {
      this.$emit('changeActive', { name: 'device', row })
    },

    handleInit() {
      getQuarterByRole().then(res => {
        let ParkingLotList = []
        console.log(res)
        ParkingLotList = res.data.data
        if (ParkingLotList.length) {
          this.parkingList = ParkingLotList
        }
      })
    },

    /**
     * 查看地图
     */
    mapFetch(row) {
      this.$emit('changeMap', { name: 'card', row })
    },

    getList() {

      const { timer } = this;

      window.clearTimeout(timer)

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

      this.loopGetList()
    },
    // 获取循环数据
    loopGetList() {

      this.timer = window.setTimeout(() => {
        this.getList()
      }, 120000)

    },

    async getUpdateDeviceByParkId({ id }) {
      
      try {
        await this.$confirm('此操作将更新设备信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        await getUpdateDeviceByParkId({ parkId: id })
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success'
        })
      }catch(err) {
        console.log(err)
      }
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
    resetForm() {
      this.parkingYarnForm = {
        code: undefined,
        deptId: '',
        zeroflag: 'N'
      }
    },
    handleAdd() {
      this.dialogStatus = 'create'
      this.resetForm()
      this.formDialogVisible = true
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addObj(this.parkingYarnForm).then(res => {
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
    handleDel(row) {
      this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj({ id: row.code }).then(res => {
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
    }
  }
}
</script>

<style lang="scss">
</style>

