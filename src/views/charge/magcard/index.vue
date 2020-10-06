<template>
  <div>
    <h2 class="layout-pages-title">用户余额管理</h2>
    <div class="layout-pages-search"
         style="width:100%;">
      <el-row>
        <el-col :span='4'>
          <el-select v-model="listQuery.orderBy"
                     size="small"
                     placeholder="请选择排序方式"
                     @change="handleSearchLabel"
                     class="searchSelect">
            <el-option v-for="item in searchList"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <el-input placeholder="请输入电卡编号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.cardNum"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-input placeholder="请输入用户手机号"
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
      <p class="total-number">(共<span>{{total}}</span>条数据)<span style="padding-left: 24px;"> 总余额: {{ allBalance }}元</span></p>
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
                         label="手机号">
          <template slot-scope="scope">
            <span>{{scope.row.uid}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="电卡编号">
          <template slot-scope="scope">
            <span>{{scope.row.cardNum}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="用户名称">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="余额">
          <template slot-scope="scope">
            <span>{{scope.row.cardBalance}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="更新时间">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="btn-opearator"
                  @click='handleDetail(scope.row)'>详情</span>
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
    <!-- 编辑、详情、添加 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="formDialogVisible">
      <el-form :model="magcardForm"
               :rules="rules"
               ref="magcardForm"
               label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称"
                          prop="userName">
              <el-input v-model="magcardForm.userName"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="卡号"
                          prop="cardNum">
              <el-input v-model="magcardForm.cardNum"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="余额"
                          prop="cardBalance">
              <el-input v-model="magcardForm.cardBalance"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getListObj, getAllUserBalance } from '@/api/magcard'
import { filterError } from '@/util/filterError'
export default {
  data() {
    return {
      listLoading: false,
      allBalance: 0,
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      formDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      magcardForm: {
        id: undefined,
        rechargeMoney: undefined,
        giveMoney: undefined,
        state: '0'
      },
      rules: {
        rechargeMoney: [
          { required: true, message: '请输入充值金额', trigger: 'blur' }
        ],
        giveMoney: [
          { required: true, message: '请输入赠送金额', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '选择是否开启', trigger: 'blur' }
        ]
      },
      searchLabel: 0,
      searchList: [{
        id: '01',
        label: '默认排序'
      }, {
        id: '02',
        label: '金额排序'
      }]
    }
  },

  mounted() {
    this.getAllUserBalance()
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

    async getAllUserBalance() {
      try {
        ({ data: { data: { allBalance: this.allBalance } } } = await getAllUserBalance())
       
      }catch(err) {
        console.log(err)
      }
    },
    
    /**
     * desc 查看详情
     */
    handleDetail(rows) {
      this.dialogStatus = 'detail'
      this.magcardForm = rows
      this.formDialogVisible = true
    },
    
    /**
     * desc 排序方式
     */
    handleSearchLabel() {
      if (this.searchLabel === 0) {
        this.listQuery.nickName = undefined
      } else if (this.searchLabel === 1) {
        this.listQuery.cardNum = undefined
      }
      this.getList()
    }
  }
}
</script>