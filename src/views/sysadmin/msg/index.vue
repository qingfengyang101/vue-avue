<template>
  <div>
    <h2 class="layout-pages-title">消息管理</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="4"
                :offset="1">
          <el-input placeholder="请输入手机号"
                    size="small"
                    class="search-btn"
                    v-model="searchText"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
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
      <p class="total-number">(共<span>{{ total }}</span>条数据)</p>
      <el-button type="success"
                 size="mini"
                 class="btn-opearator"
                 @click="handleAdd">添加推送信息</el-button>
      <el-table :data="tableData"
                class="layout-pages-content-table"
                @selection-change="handleSelectionChange"
                style="width: 100%">
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="手机号">
          <template slot-scope="scope">
            <span>{{ scope.row.recMobile }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="内容">
          <template slot-scope="scope">
            <span>{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center"
                         width="320"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  @click="handleUpdate(scope.row)"
                  effect="plain">
              编辑
            </span>
            <span class="tag-opearte"
                  @click="handleDel(scope.row)"
                  effect="plain">
              删除
            </span>
          </template>
        </el-table-column> -->
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
               :visible.sync="formDialogVisible"
               width="65%">
      <el-form :model="drDoorphoneForm"
               :rules="rules"
               ref="drDoorphoneForm"
               label-width="120px">
        <el-row>
          <el-col :span="7">
            <el-form-item label="手机号"
                          prop="phone">
              <el-input v-model="drDoorphoneForm.phone"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="推送内容"
                          prop="content">
              <el-input v-model="drDoorphoneForm.content"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false"
                   v-if="dialogStatus=== 'create' || dialogStatus=== 'update'">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'create'"
                   @click="handleSubmit('drDoorphoneForm')">推送</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getListObj, addObj } from '@/api/msg.js'
import { filterError } from '@/util/filterError'

const rules = {
    content: [
        { required: true, message: '请输入内容', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' }
    ]
}

export default {
  data() {
    return {
      listLoading: false,
      total: 0, // 数据数量
      tableData: [], // 列表数据
      listQuery: { // 获取列表参数
        page: 1,
        limit: 20,
        power: undefined
      },
      formDialogVisible: false, // 编辑框隐藏状态
      dialogStatus: '', // 操作状态
      textMap: {// 提示对象
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      searchText: '',// 搜索数据
      drDoorphoneForm: {
        phone: undefined, 
        content: undefined,
        type: 3
      },
      selectionData: [], // 全选数据
      updateId: '', // 更新数据id
      rules // 输入规则
    }
  },
  created() {
      this.getList();
  },
  
  methods: {
    /**
     * desc 列表
     */
    async getList() {

        try {
            const res = ({data: { data: { total: this.total, records: this.tableData } }} = await getListObj(this.listQuery))
            await filterError(res, 'notify')
        }catch(err) {
            console.log(err)
        }
    },

    /**
     * desc 搜索
     */
    handleFilter() {
      const { searchText } = this;
      this.listQuery.page = 1
      this.listQuery.power = searchText
      this.getList()
    },

    /**
     * desc 打开新增窗口
     */
    handleAdd() {
      this.dialogStatus = 'create'
      this.drDoorphoneForm = {
        content: undefined, 
        phone: undefined,
        type: 3
      }
      this.formDialogVisible = true
    },

    /**
     * desc 创建新消息
     */
    handleSubmit(formName) {

      this.$refs[formName].validate(async (valid) => {
        if (!valid) { return; }
 
        try {
            const res = await addObj(this.drDoorphoneForm)
            await filterError(res, 'notify', 1)
            this.formDialogVisible = false
            this.getList()
        } catch(err) {
            console.log(err)
        }
      })
    },
    /**
     * desc 打开编辑窗口
     */
    handleUpdate({ max_power, balance, id }) {
      this.dialogStatus = 'update'
      this.formDialogVisible = true
      this.updateId = id;
      this.drDoorphoneForm = { max_power, balance }
    },

    /**
     * desc 删除按钮被单击
     */
    async handleDel({ id, type }) {
        try {
            await this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })

            let res;

            if (type === 'batch') {
              res = await deleteList({ ids: id })
            } else {
              res = await delObj(id)
            }

            await filterError(res, 'notify', 4)
            this.getList()

        }catch(err) {
            console.log(111, err)
        }
    },

    handleSelectionChange(ev) {
        this.selectionData = ev;
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-push {
  font-weight: bold;
}
</style>


