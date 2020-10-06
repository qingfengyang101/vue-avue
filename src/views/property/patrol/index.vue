<template>
  <div>
    <h2 class="layout-pages-title">巡更记录</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.quartersId"
                     size="small"
                     @change="handleFilter"
                     placeholder="请选择小区名称">
            <el-option v-for="item in villageOptions"
                       size="small"
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
                          @change='handleFilter'
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          clearable
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-date-picker size="small"
                          class="search-btn"
                          v-model="listQuery.endTime"
                          @change='handleFilter'
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          clearable
                          type="date"
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
    <div class="layout-pages-content">
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <!-- <el-button type="success"
                 size="mini"
                 class="btn-opearator"
                 @click="handleExp">导出巡更记录</el-button> -->
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
            <span>{{scope.row.quartersName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="单元名">
          <template slot-scope="scope">
            <span>{{scope.row.unitName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="楼栋名">
          <template slot-scope="scope">
            <span>{{scope.row.buildName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="巡更人员">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="图片">
          <template slot-scope="scope">
            <span><img :src="scope.row.pictureUrl"
                   width="100px"
                   alt=""
                   @click="handleImgShow(scope.row.pictureUrl)"></span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="巡更时间">
          <template slot-scope="scope">
            <span>{{scope.row.openDoorTime}}</span>
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
               title="图片详情"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, excelExport } from '@/api/patrol'
import { getQuarterByRole } from '@/api/village'
import VDistpicker from 'v-distpicker'
import { filterError } from '@/util/filterError.js'

export default {
  data() {
    return {
      add_propertyPeo: false,
      del_propertyPeo: false,
      handleAdd: false,
      handleDel: false,
      listLoading: false,
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      multipleSelection: [],
      villageOptions: [],
      dialogPhoto: '',
      photoShowDialog: false
    }
  },
  created() {
    this.add_propertyPeo = this.permissions['add_propertyPeo']
    this.del_propertyPeo = this.permissions['del_propertyPeo']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.handleGetAllListObj()
  },
  components: { VDistpicker },
  methods: {
    
    async getList() {
      this.listLoading = true
      
      try {
        const res = ({ data: { data: { total: this.total, records: this.tableData } } } = await getListObj(this.listQuery))
        this.listLoading = false
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 获取小区
     */
    async handleGetAllListObj() {
      
      try {
        this.villageOptions = []
        const { data: { data: requireInfo } } = await getQuarterByRole()

        if (Array.isArray(requireInfo) && requireInfo.length) {
          requireInfo.forEach(item => {
            delete item.bulidList
            this.villageOptions.push(item)
          })
        }

        if (this.villageOptions.length) {
          this.listQuery.quartersId = this.villageOptions[0].quartersId
          this.getList()
        }

      }catch(err) {
        console.log(err)
      }
    
    },

    /**
     * desc 查看大图
     */
    handleImgShow(url) {
      this.dialogPhoto = url
      this.photoShowDialog = true
    },

    /**
     * desc 导出
     */
    async handleExp() {
      
      try {

        const { listQuery: { quartersId, startTime, endTime } } = this;
        if (!startTime || !endTime) {
          this.$notify({  title: '警告',  message: '请先选择巡更记录日期范围',  type: 'warning',  duration: 2000 })
          return;
        }

        const { data } = await excelExport({ quartersId, startTime, endTime })
        const blob = new Blob([data])
        const date = new Date()
        const year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        if (month < 10) { month = '0' + month }
        if (day < 10) { day = '0' + day }

        const nowDate = year + '-' + month + '-' + day
        const fileName = nowDate + '-巡更记录.xls'
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
        this.$notify({  title: '成功',  message: '导出成功',  type: 'success',  duration: 2000  })
      }catch(err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss">
</style>

