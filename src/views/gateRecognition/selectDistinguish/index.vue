<template>
  <div>
    <h2 class="layout-pages-title">识别记录</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.quartersId"
                     size="small"
                     class="search-btn"
                     @change='handleFilter'
                     placeholder="请选择小区">
            <el-option v-for="item in UjQuartersList"
                       :key="item.quartersId"
                       :label="item.name"
                       :value="item.quartersId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-date-picker size="small"
                          class="search-btn"
                          v-model="listQuery.startTime"
                          @keyup.native.enter='handleFilter'
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd"
                          clearable
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-date-picker size="small"
                          class="search-btn"
                          v-model="listQuery.endTime"
                          @keyup.native.enter='handleFilter'
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd"
                          clearable
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-input placeholder="请输入人员姓名"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.name"
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
      <el-table :data="tableData"
                class="layout-pages-content-table"
                v-loading="listLoading"
                @selection-change="handleSelectionChange"
                style="width: 100%">
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="人员姓名">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="人员guid">
          <template slot-scope="scope">
            <span>{{scope.row.personGuid}}</span>
          </template>
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
            <span>{{scope.row.appId}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="设备名称">
          <template slot-scope="scope">
            <span>{{scope.row.deviceName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="识别模式">
          <template slot-scope="scope">
            <span v-if="scope.row.recMode=== '1'">刷脸</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="识别时间">
          <template slot-scope="scope">
            <span>{{scope.row.showTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="人脸抓拍">
          <template slot-scope="scope">
            <img :src="scope.row.photoUrl"
                 @click="handleImg(scope.row.photoUrl)"
                 class="table-img"
                 alt=""
                 srcset="">
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
      <img :src="dialogPhoto"
           style="max-width:100%">
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="photoShowDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getListObj } from '@/api/selectDistinguish'
import { selectUjQuarters } from '@/api/gateDevice'
export default {
  data() {
    return {
      listLoading: false,
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        startTime: undefined,
        endTime: undefined,
        quartersId: undefined
      },
      UjQuartersList: [],
      photoShowDialog: false,
      dialogPhoto: ''
    }
  },
  created() {

  },
  computed: {
  },
  mounted() {
    this.handleUjQuarters()
  },
  methods: {
    handleImg(img) {
      this.dialogPhoto = img
      this.photoShowDialog = true
    },
    handleUjQuarters() {
      selectUjQuarters(this.UjLisQueryName).then(res => {
        if (res.data.code === 0) {
          this.UjQuartersList = res.data.data
          if (this.UjQuartersList.length) {
            this.listQuery.quartersId = this.UjQuartersList[0].quartersId
            this.getList()
          }
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
      this.listLoading = true
      getListObj(this.listQuery).then(res => {
        this.listLoading = false
        if (res.data.code === 0) {
          if (res.data.data != null) {
            this.total = res.data.data.total
            this.tableData = res.data.data.records
          } else {
            this.total = 0
            this.tableData = []
          }
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
    }
  }
}
</script>
