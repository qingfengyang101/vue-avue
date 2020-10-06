<template>
  <div>
    <h2 class="layout-pages-title">提现列表</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.applyStatus"
                     size="small"
                     clearable
                     @change="handleFilter"
                     placeholder="请选择状态">
            <el-option v-for="item in villageOptions"
                       size="small"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input placeholder="请输入要查询的账户号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.merAccount"
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-input placeholder="请输入要查询的手机号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.mobile"
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="1"
                :offset="2">
          <el-button size="small"
                     type="primary"
                     @click="handleReset"
                     plain>重置</el-button>
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
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="账户号">
          <template slot-scope="scope">
            <span>{{scope.row.merAccount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="商家手机号">
          <template slot-scope="scope">
            <span>{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="验证码">
          <template slot-scope="scope">
            <span>{{scope.row.yzm}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="提现金额">
          <template slot-scope="scope">
            <span>{{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.applyStatus === 'N'">申请中</span>
            <span v-else-if="scope.row.applyStatus === 'A'">申请通过</span>
            <span v-else-if="scope.row.applyStatus === 'R'">申请拒绝</span>
            <span v-else>提现完成</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="申请时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="提现说明">
          <template slot-scope="scope">
            <span>{{ scope.row.applyMsg }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         width="280px"
                         label="管理">
          <template slot-scope="scope">

            <template v-if = "scope.row.applyStatus === 'N'">
                <span class="tag-opearte"
                    @click='handleExamine(1, scope.row)'
                    effect="plain">
                审核通过
                </span>
                <span class="tag-opearte"
                    @click='handleExamine(2, scope.row)'
                    effect="plain">
                审核不通过
                </span>
            </template>
            <span v-if = "scope.row.applyStatus === 'A'" class="tag-opearte"
                    @click='handleExamine(3, scope.row)'
                    effect="plain">
                提现完成
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, checkbes } from '@/api/business/carry'
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
        mobile: undefined,
        merAccount: undefined,
        applyStatus: undefined
      },
      villageOptions: [
        {
          name: '申请中',
          value: 'N'
        },
        {
          name: '已通过',
          value: 'A'
        },
        {
          name: '已拒绝',
          value: 'R'
        },
        {
          name: '已完成',
          value: 'E'
        }
      ]
    }
  },
  created() {
    
  },
  
  mounted() {
    this.getList()
  },
  methods: {

    async getList() {
      this.listLoading = true

      // let { searchTypeKey, keyWord } = this;

      // delete this.listQuery.fullName
      // delete this.listQuery.mobile
      // this.listQuery[searchTypeKey] = keyWord

      try {
          let res = ( { data: { data: { total: this.total, records: this.tableData } } } = await getListObj(this.listQuery))
          await filterError(res, 'notify')
          this.listLoading = false
          console.log(this.tableData)
      } catch(err) {
          console.log(err)
      }
    },
    /**
     * 审核
     */
    async handleExamine(index, { id }) {
        try {
            if (index == 2) {
                let remark;
                ({ value: remark } = await this.$prompt( '请输入拒绝原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }))

                const res = await checkbes({ id, applyStatus: 'R', applyMsg: remark })
                await filterError(res, 'notify', 3)
                this.getList();

            }else if(index == 3) {
                const res = await checkbes({ id, applyStatus: 'E' });
                await filterError(res, 'notify', 3)
                this.getList();
            } else {
                const res = await checkbes({ id, applyStatus: 'A' });
                await filterError(res, 'notify', 3)
                this.getList();
            }

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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        mobile: undefined,
        merAccount: undefined,
        applyStatus: undefined
      }

      this.getList();
    }
  }
}
</script>


