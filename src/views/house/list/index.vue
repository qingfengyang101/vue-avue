<template> 
  <div class="app-container">
    <!-- <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
    </el-card> -->
    <el-card style="margin-top:0;" class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加驿站</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">{{ scope.row.stageCode }}</template>
        </el-table-column>
        <el-table-column label="驿站名" align="center">
          <template slot-scope="scope">{{ scope.row.stageName }}</template>
        </el-table-column>
        <el-table-column label="店长" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.stageMan }}</template>
        </el-table-column>
        <el-table-column label="联系方式" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.stagePhone }}</template>
        </el-table-column>
        <el-table-column label="经纬度" align="center">
          <template slot-scope="scope">{{ scope.row.lat }},{{ scope.row.lon }}</template>
        </el-table-column>
        <el-table-column label="详细地址" align="center">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">{{ scope.row.remark }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="freightList(scope.row)">查看快递员
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.page"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog
      title="快递员列表"
      :visible.sync="dialogVisible"
      width="50%">
      <el-table style="width: 100%;margin-top: 20px"
                :data="freightData"
                border>
        <el-table-column label="快递员姓名" align="center">
          <template slot-scope="scope">{{ scope.row.dName }}</template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">{{ scope.row.dPhone }}</template>
        </el-table-column>
        <el-table-column label="公司代码" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.dShipperCode }}</template>
        </el-table-column>
        <el-table-column label="公司名称" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.dShipperName }}</template>
        </el-table-column>
        <el-table-column label="每单价格" align="center">
          <template slot-scope="scope">{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>

  import { fetchList, delObj, freightList } from '@/api/house/list'
  const defaultListQuery = {
    page: 1,
    limit: 10,
    name: null,
    endTime:null
  };
  
  export default {
    name: 'homeAdvertiseList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
        dialogVisible: false,
        freightData: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.page = 1;
        this.getList();
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.listQuery.page = 1;
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      /**
       * desc 删除
       */
      async handleDelete(index, { id }){
        
        try {
            await this.$confirm('是否要删除该驿站?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
            await delObj({ id })
            this.$message({ type: 'success', message: '删除成功!' });
            this.getList();
        }catch(err) {
            console.log(err)
        }
      },

      handleAdd(){
        this.$router.push({path: '/house/add'})
      },

      handleUpdate(index,{ id }){
        this.$router.push({path: '/house/add', query: { id }})
      },

      /**
       * desc 
       */
      async getList() {
        this.listLoading = true;

        try {
            ({ data: { data: { records: this.list, total: this.total } } } = await fetchList(this.listQuery))
            this.listLoading = false;
        }catch(err) {
            console.log(err)
        }
      },

      /**
       * desc 获取驿站快递员
       */
      async freightList({ id: stageId }) {
        
        try {
            ({ data: { data: this.freightData } } = await freightList({ stageId }))
            console.log(111, this.freightData)
            this.dialogVisible = true;
        }catch(err) {
            console.log(err)
        }
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


