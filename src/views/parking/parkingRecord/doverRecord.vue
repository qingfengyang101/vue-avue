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
          <el-input placeholder="请输入值班人员名称"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.employName"
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
                         label="值班员名称">
          <template slot-scope="scope">
            <span>{{scope.row.employName}}</span>
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
                          prop="parkName">
              <el-input v-model="vehicleForm.parkName"
                        size="small"
                        clearable
                        :disabled="dialogStatus === 'detail'"></el-input>
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
import { doverRecordListObj } from '@/api/doverRecord'
import { selectParkingLotDropdownBox } from '@/api/parkingYarn'
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
        ]
      },
      parkingList: []
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
          this.listQuery.code = this.parkingList[0].parkId
          this.getList()
        }
      })
    },
    getList() {
      this.listLoading = true
      doverRecordListObj(this.listQuery).then(res => {
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

