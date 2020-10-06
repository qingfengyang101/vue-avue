<template>
  <div>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.quartersId"
                     size="small"
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
        <el-col :span="3">
          <el-input @keyup.enter.native="handleFilter"
                    size="small"
                    class="filter-item"
                    clearable
                    placeholder="用户"
                    v-model="listQuery.name">
          </el-input>
        </el-col>
        <el-col :span="1">
          <el-button size="small"
                     type="primary"
                     @click="handleFilter">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="layout-pages-content clear-bd">
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
                         label="用户">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center"
                         label="呼叫号">
          <template slot-scope="scope">
            <span>{{scope.row.callNo}}</span>
          </template> -->
        <!-- </el-table-column> -->
        <el-table-column align="center"
                         label="小区名">
          <template slot-scope="scope">
            <span v-if="scope.row.doorPhoneVoWithQuarterInfo">{{scope.row.doorPhoneVoWithQuarterInfo.quartersName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="楼栋">
          <template slot-scope="scope">
            <span v-if="scope.row.doorPhoneVoWithQuarterInfo">{{scope.row.doorPhoneVoWithQuarterInfo.buildName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="单元名称">
          <template slot-scope="scope">
            <span v-if="scope.row.doorPhoneVoWithQuarterInfo">{{scope.row.doorPhoneVoWithQuarterInfo.unitName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="门口机">
          <template slot-scope="scope">
            <span v-if="scope.row.doorPhoneVoWithQuarterInfo">{{scope.row.doorPhoneVoWithQuarterInfo.doorphoneName}}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column align="center"
                         label="卡类型">
          <template slot-scope="scope">
            <span v-if="scope.row.cardType == '10'">id卡</span>
            <span v-if="scope.row.cardType == '11'">ic卡</span>
            <span v-if="scope.row.cardType == '12'">身份证</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column align="center"
                         label="开门状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '0'">失败</span>
            <span v-if="scope.row.status == '1'">成功</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center"
                         label="开门时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.pictureUrl"
                 class="table-img"
                 alt=""
                 @click="handleImgShow(scope.row.pictureUrl)"
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
import { drDoorphoneFaceLog } from '@/api/logManger'
export default {
  props: {
    quartersId: String,
    villageOptions: Array
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        quartersId: undefined
      },
      multipleSelection: [],
      photoShowDialog: false,
      dialogPhoto: '',
      villageOptionsList: []
    }
  },
  watch: {
    quartersId(val) {
      if (val) {
        this.listQuery.quartersId = this.quartersId
        this.getList()
      }
    }
  },
  created() {
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
  },
  methods: {
    getList() {
      this.listLoading = true
      drDoorphoneFaceLog(this.listQuery).then(res => {
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
    }
  }
}
</script>
<style scoped>
.clear-bd {
  padding-top: 0;
}
</style>

