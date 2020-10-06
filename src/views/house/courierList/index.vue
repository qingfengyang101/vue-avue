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
          <el-form-item label="快递员名称: ">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="快递员手机号: ">
            <el-input style="width: 203px" v-model="listQuery.phone" placeholder=""></el-input>
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
        <el-table-column label="公司代码" align="center">
          <template slot-scope="scope">{{ scope.row.dshipperCode }}</template>
        </el-table-column>
        <el-table-column label="公司名称" align="center">
          <template slot-scope="scope">{{ scope.row.dshipperName }}</template>
        </el-table-column>
        <el-table-column label="快递员姓名" align="center">
          <template slot-scope="scope">{{ scope.row.dname }}</template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">{{ scope.row.dphone }}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{ scope.row.create_time }}</template>
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
  </div>
</template>
<script>

  import { fetchList } from '@/api/house/courierList'
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
            console.log(this.list)
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


