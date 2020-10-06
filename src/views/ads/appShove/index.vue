<template>
  <div>
    <h2 class="layout-pages-title">app推送管理</h2>

    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="4"
                :offset="1">
          <el-input placeholder="请输入推送内容"
                    size="small"
                    class="search-btn"
                    v-model="searchText"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="4"
                :offset="1">
          <el-input placeholder="请输入商品ID"
                    size="small"
                    class="search-btn"
                    v-model="productId"
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
                 @click="handleAdd">添加</el-button>
       <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 @click="batchAuditHandler">删除</el-button>
        <el-button size="mini"
                 type="primary"
                 @click="openFormal">开启正式推送</el-button>
      <el-table :data="tableData"
                class="layout-pages-content-table"
                @selection-change="handleSelectionChange"
                style="width: 100%">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="推送标题">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="推送内容">
          <template slot-scope="scope">
            <span>{{ scope.row.msg }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="推送类型">
          <template slot-scope="scope">
            <span>{{ scope.row.pushType === '01' ? '打开app' : '打开商品页面' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="商品id">
          <template slot-scope="scope">
            <span>{{ scope.row.productId }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="推送时间">
          <template slot-scope="scope">
            <span>{{ scope.row.pushTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
                         width="120"
                         align="center"
                         label="推送状态">
          <template slot-scope="scope">
            <span v-if="scope.row.pushFlag === 'N'">
              <el-tag type="info">未推送</el-tag>
            </span>
            <span v-if="scope.row.pushFlag === 'T'">
              <el-tag type='danger'>已测试推送</el-tag>
            </span>
            <span v-if="scope.row.pushFlag === 'Y'">
              <el-tag type='success'>已正式推送</el-tag>
            </span>
            <span v-if="scope.row.pushFlag === 'D'">
              <el-tag type="warning">推送中</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center"
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
            <span  class="tag-opearte"
                  @click="testPushMsg(scope.row)"
                  effect="plain">
              测试推送
            </span>
            <el-button
                  v-if="scope.row.pushFlag === 'T'"
                  class="tag-opearte tag-push"
                  @click="handlePushMsg(scope.row)"
                  effect="plain">
              正式推送
            </el-button>
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
               :visible.sync="formDialogVisible"
               width="60%">
      <el-form :model="drDoorphoneForm"
               :rules="rules"
               ref="drDoorphoneForm"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="推送标题"
                          prop="title">
              <el-input v-model="drDoorphoneForm.title"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="推送内容"
                          prop="msg">
              <el-input v-model="drDoorphoneForm.msg"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="推送类型">
            <!-- <el-select v-model="drDoorphoneForm.pushType"
                      size="small"
                      @change="handleFilter"
                      placeholder="请选择推送类型">
              <el-option size="small" label="打开app"  value="01"></el-option>
              <el-option size="small" label="打开商品指定页面"  value="02"></el-option>
            </el-select> -->
              <el-radio v-model="drDoorphoneForm.pushType" label="01">打开app</el-radio>
              <el-radio v-model="drDoorphoneForm.pushType" label="02">打开商品指定页面</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="drDoorphoneForm.pushType === '02'">
          <el-col :span="20">
            <el-form-item label="商品id">
              <el-input v-model="drDoorphoneForm.productId"
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
                   @click="handleSubmit('drDoorphoneForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('drDoorphoneForm')">更 新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getListObj, addObj, putObj, delObj, deleteList, updateStatus, pushTestMsg, getUpdateRealPush } from '@/api/appShove'
import { filterError } from '@/util/filterError'

const rules = {
    title: [
        { required: true, message: '请输入推送标题', trigger: 'blur' }
    ],
    msg: [
        { required: true, message: '请输入推送内容', trigger: 'blur' }
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
        msg: undefined,
        productId: undefined
      },
      formDialogVisible: false, // 编辑框隐藏状态
      dialogStatus: '', // 操作状态
      textMap: {// 提示对象
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      searchText: '',// 搜索数据
      productId: null, // 商品id
      drDoorphoneForm: {
        title: undefined,
        msg: undefined,
        pushType: '01'
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
     * desc 开启正式推送
     */
    async openFormal() {
      try {
        await this.$confirm('是否开启正式推送？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        const res = await getUpdateRealPush()
        await filterError(res, 'notify', 3)
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 批量删除
     */
    async batchAuditHandler() {

        try {
            const { selectionData } = this;
            if (!selectionData.length) {
              this.$alert('请选择要操作的数据', '提示', { confirmButtonText: '确定' })
              return;
            }

           let str = '';
           selectionData.forEach(item => {
              str += `,${item.id}`
           })

           this.handleDel({ id: str.slice(1), type: 'batch' })
        }catch(err) {
          console.log(err)
        }
    },
    handleFilter() {
      const { searchText, productId } = this;
      this.listQuery.page = 1
      this.listQuery.msg = searchText
      this.listQuery.productId = productId
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

    /**
     * desc 打开新增窗口
     */
    handleAdd() {
      this.dialogStatus = 'create'
      this.formDialogVisible = true
      this.drDoorphoneForm = {
        title: undefined,
        msg: undefined,
        pushType: '01'
      }
    },

    /**
     * desc 创建新消息
     */
    handleSubmit(formName) {

      this.$refs[formName].validate(async (valid) => {
        if (!valid) { return; }

        try {

            this.screenProductId();
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
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      this.formDialogVisible = true
      let { title, msg, id, pushType, productId } = rows;
      this.updateId = id;

      if (productId === 'msg') {
        productId = ''
      }

      this.drDoorphoneForm = { title, msg, pushType, productId }
    },

    /**
     * desc 筛选商品Id
     */
    screenProductId() {
      const { drDoorphoneForm: { pushType } } = this;

      if (pushType === '01') {
        this.drDoorphoneForm.productId = null
      }

    },

    /**
     * desc 更新数据
     */
    handleUptForm(formName) {
      this.$refs[formName].validate(async (valid) => {
          if (!valid) { return }

          try {
              this.screenProductId();
              const { updateId, drDoorphoneForm } = this;

              const res = await putObj({...drDoorphoneForm, id: updateId })
              const { data: { code, msg: message } } = res

              await filterError(res, 'notify', 3)
              this.formDialogVisible = false
              this.getList()
          }catch(err) {
              console.log(err)
          }

      })
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

    /**
     * desc 点击推送消息
     */
    async handlePushMsg({id}) {
      try {
        await this.$confirm('此操作将推送该消息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
        const res = await updateStatus({ id })

        await filterError(res, 'notify', 3)
        this.getList()

      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 测试推送
     */
    async testPushMsg({ id }) {
      try {
        await this.$confirm('此操作将推送该消息至测试手机, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
        const res = await pushTestMsg({ id })

        await filterError(res, 'notify', 3)
        this.getList()
      }catch(err) {
        console.log(err)
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
