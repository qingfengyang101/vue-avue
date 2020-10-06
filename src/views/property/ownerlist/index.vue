<template>
  <div>
    <h2 class="layout-pages-title">物业人员列表</h2>
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
        <el-col :span="1"
                :offset="1">
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
        <el-table-column align="center"
                         label="编号">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="小区">
          <template slot-scope="scope">
            <span>{{scope.row.quartersName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="固定ownerId">
          <template slot-scope="scope">
            <span>{{scope.row.appOwnerId}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="固定手机">
          <template slot-scope="scope">
            <span>{{scope.row.appMobile}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="备注">
          <template slot-scope="scope">
            <span>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
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
</template>

<script>
import { getListObj } from '@/api/ownerlist'
import { getQuarterByRole } from '@/api/village'
import { filterError } from '@/util/filterError.js'

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
        name: undefined
      },
      villageOptions: []
    }
  },
  
  mounted() {
    this.handleGetAllListObj()
  },
  methods: {
    async getList() {
      
      try {
        this.listLoading = true
        const res = ({ data: { data: { total: this.total, records: this.tableData } } } = await getListObj(this.listQuery))
        // const res = await getListObj(this.listQuery)
        console.log(this.tableData)
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
        const res = await getQuarterByRole()
        const { data: { data: requireInfo } } = res;

        if (Array.isArray(requireInfo) && requireInfo.length) {

          requireInfo.forEach(item => {
            delete item.bulidList
            this.villageOptions.push(item)
          })
          
          this.listQuery.quartersId = requireInfo[0].quartersId
          this.getList()
        }

      }catch(err) {
        console.log(err)
      }
      
    }
  }
}
</script>

<style lang="scss">
</style>

