<template>
  <div>
    <h2 class="layout-pages-title">停车场设备管理</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.parkId"
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

        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="停车场名称">
          <template slot-scope="scope">
            <span>{{scope.row.pname}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="停车场地址">
          <template slot-scope="scope">
            <span>{{scope.row.deviceName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="设备编码">
          <template slot-scope="scope">
            <span>{{scope.row.deviceCode}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center"
                         label="设备状态">
          <template slot-scope="scope">
            <span>{{scope.row.deviceStatus}}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center"
                         label="客户端状态">
          <template slot-scope="scope">
            <span v-if="scope.row.online===false">离线</span>
            <span v-if="scope.row.online===true">在线</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="出入口属性">
          <template slot-scope="scope">
            <span v-if="scope.row.ioType==='0'">入口</span>
            <span v-if="scope.row.ioType==='1'">出口</span>
            <span v-if="scope.row.ioType==='2'">出口</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="设备类型">
          <template slot-scope="scope">
            <span>{{scope.row.deviceType}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="每天最大流量">
          <template slot-scope="scope">
            <span>{{scope.row.dayMaxFlow}}</span>
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
import { selectParkingLotDropdownBox } from '@/api/parkingYarn'
import { selectCarDevice } from '@/api/parkingDevice'
export default {
  props: {
    parkId: {
      type: String,
      default: ''
    }
  },
  watch: {
    parkId(to) {
      if (to) {
        //this.listQuery.parkId = to
        this.listQuery = Object.assign({}, this.listQuery, { parkId: to })
        this.getList();
        // this.handleInit()
      }
    }
  },
  data() {
    return {
      parkingList: [],
      listQuery: { // 列表查询数据
        page: 1,
        limit: 20,
        parkId: undefined
      },
      listLoading: false,
      total: 0,
      tableData: []
    }
  },

  mounted() {
    this.handleInit()
  },
  methods: {
    /** 
     * 初始化
    */
    async handleInit() {
      let { parkId } = this;

      try {
        let {
          data: { data: ParkingLotList }
        } = await selectParkingLotDropdownBox();

        if (ParkingLotList.length) {
          this.parkingList = ParkingLotList
          if (parkId) {
            this.listQuery.parkId = parkId
            this.getList()
          } else {
            this.listQuery.parkId = this.parkingList[0].parkId;
            this.$emit('changeParkId', { parkId })
          }
          //this.listQuery.parkId = parkId ? parkId: this.parkingList[0].parkId;
          //this.getList()
        }

      }catch(err) {
        console.log(222, err)
      }
    },
    getList() {
      this.listLoading = true

      selectCarDevice(this.listQuery).then(res => {
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
    handleFilter(e) {
      this.listQuery.page = 1
      //console.log(e)
      //changeParkId
      if (typeof e === 'string') {
        this.$emit('changeParkId', { parkId: e })
      }
      //this.$emit('changeActive', { name: 'device', { id: this.listQuery. } })
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


<style lang="scss">
</style>

