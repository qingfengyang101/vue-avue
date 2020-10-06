<template>
  <div>
    <h2 class="layout-pages-title">访客记录</h2>
    <div class="layout-pages-search">
      <el-input placeholder="请输入访客"
                size="small"
                class="search-btn"
                v-model="listQuery.srealname"
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
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <!-- <el-table-column align="center"
                         label="访客ID">
          <template slot-scope="scope">
            <span>{{scope.row.openid}}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center"
                         label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.srealname}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="身份证号">
          <template slot-scope="scope">
            <span>{{scope.row.sIdNum}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center"
                         label="人脸识别设备id">
          <template slot-scope="scope">
            <span>{{scope.row.sIdNum}}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center"
                         label="事由">
          <template slot-scope="scope">
            <span>{{scope.row.vReason}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="申请时间">
          <template slot-scope="scope">
            <span>{{scope.row.vDateTime | moment('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="通过时间">
          <template slot-scope="scope">
            <span>{{scope.row.inDateTime | moment('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="业主姓名">
          <template slot-scope="scope">
            <span>{{scope.row.vRealName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="是否审核通过">
          <template slot-scope="scope">
            <span v-if="scope.row.vStatus === '0'">
              <el-tag type="info">未审核</el-tag>
            </span>
            <span v-if="scope.row.vStatus === '1'">
              <el-tag type="primary">审核通过</el-tag>
            </span>
            <span v-if="scope.row.vStatus === '2'">
              <el-tag type="danger">审核未通过</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="头像">
          <template slot-scope="scope">
            <img :src="scope.row.inPhoto"
                 class="table-img"
                 alt=""
                 @click="handleImgShow(scope.row.inPhoto)"
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
import { getListObj } from '@/api/vistorRecord'
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
      multipleSelection: [],
      photoShowDialog: false,
      dialogPhoto: ''
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
    },
    handleImgShow(url) {
      this.dialogPhoto = url
      this.photoShowDialog = true
    }
  }
}
</script>
