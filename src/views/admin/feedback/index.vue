<template>
  <div>
    <h2 class="layout-pages-title">U家社区意见反馈</h2>
    <div class="layout-pages-search">
      <el-input placeholder="请输入意见"
                size="small"
                class="search-btn"
                v-model="listQuery.content"
                @keyup.native.enter='handleFilter'
                clearable>
      </el-input>
      <el-button size="small"
                 type="primary"
                 @click="handleFilter">搜索</el-button>
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
                         label="反馈内容">
          <template slot-scope="scope">
            <span>{{scope.row.content}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="反馈人员">
          <template slot-scope="scope">
            <span>{{scope.row.nickName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="反馈时间">
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
import { mapGetters } from 'vuex'
import { getListObj } from '@/api/feedback'
export default {
  data() {
    return {
      listLoading: false,
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20
      },
      multipleSelection: []
    }
  },
  created() {
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
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
    }
  }
}
</script>

