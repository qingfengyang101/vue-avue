<template>
  <div>
    <h2 class="layout-pages-title">用户卡列表</h2>
    <div class="layout-pages-search"
         style="width:100%;">
      <el-row>
        <el-col :span="4">
          <el-select v-model="listQuery.sendFlag"
                     size="small"
                     clearable
                     @change="handleFilter"
                     placeholder="请选择发卡标识">
            <el-option size="small" label="已发卡" value="Y"></el-option>
            <el-option size="small" label="未发卡" value="N"></el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <el-input placeholder="请输入用户卡号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.userCardNo"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-input placeholder="请输入手机号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.mobile"
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
    <div class="layout-pages-content">
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
                         label="用户卡号">
          <template slot-scope="scope">
            <span>{{ scope.row.userCardNo }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="门禁IC">
          <template slot-scope="scope">
            <span>{{ scope.row.doorIc }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="电卡IC">
          <template slot-scope="scope">
            <span>{{ scope.row.chargeIc }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="发卡标识">
          <template slot-scope="scope">
            <span>{{ scope.row.sendFlag === 'N' ? '未发卡': '已发卡' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="手机号">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="创建人">
          <template slot-scope="scope">
            <span>{{ scope.row.createUser }}</span>
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
import { getListObj } from '@/api/cardList'
import { filterError } from '@/util/filterError'

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
      }
    }
  },
  mounted() {
    this.getList()
  },
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
    }
  }
}
</script>