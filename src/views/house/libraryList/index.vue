<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
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
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="提交人手机号: ">
            <el-input style="width: 203px" v-model="listQuery.commitMobile" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="快递员手机号: ">
            <el-input style="width: 203px" v-model="listQuery.dPhone" placeholder=""></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column label="驿站名称" align="center">
          <template slot-scope="scope">{{ scope.row.stageName }}</template>
        </el-table-column>
        <el-table-column label="驿站联系人" align="center">
          <template slot-scope="scope">{{ scope.row.stageMan }}</template>
        </el-table-column>
        <el-table-column label="驿站手机号" align="center">
          <template slot-scope="scope">{{ scope.row.stagePhone }}</template>
        </el-table-column>
        <el-table-column label="快递员手机号" align="center">
          <template slot-scope="scope">{{ scope.row.dPhone }}</template>
        </el-table-column>
        <el-table-column label="快递员姓名" align="center">
          <template slot-scope="scope">{{ scope.row.dName }}</template>
        </el-table-column>
        <el-table-column label="快件个数" align="center">
          <template slot-scope="scope">{{ scope.row.qunatity }}</template>
        </el-table-column>
        <el-table-column label="单价" align="center">
          <template slot-scope="scope">{{ scope.row.siglePrice }}</template>
        </el-table-column>
        <el-table-column label="付款金额" align="center">
          <template slot-scope="scope">{{ scope.row.payAmount }}</template>
        </el-table-column>
        <el-table-column label="付款状态" align="center">
          <template slot-scope="scope">
              <span v-if="scope.row.state === '0'">待支付</span>
              <span v-if="scope.row.state === '1'">已支付</span>
              <span v-if="scope.row.state === '2'">已取消</span>
          </template>
        </el-table-column>
        <el-table-column label="公司代码" align="center">
          <template slot-scope="scope">{{ scope.row.dShipperCode }}</template>
        </el-table-column>
        <el-table-column label="公司名称" align="center">
          <template slot-scope="scope">{{ scope.row.dShipperName }}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
          </template>
        </el-table-column> -->
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
  </div>
</template>
<script>

  import { fetchList } from '@/api/house/libraryList'
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
        multipleSelection: []
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
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


