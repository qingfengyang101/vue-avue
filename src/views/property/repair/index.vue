<template>
  <div>
    <h2 class="layout-pages-title">物业报修</h2>
    <div class="layout-pages-search">
      <el-input placeholder="请输入姓名"
                size="small"
                class="search-btn"
                v-model="listQuery.username"
                @keyup.native.enter='handleFilter'
                clearable>
      </el-input>
      <el-button size="small"
                 type="primary"
                 @click="handleFilter">搜索</el-button>
    </div>
    <div class="layout-pages-content">
      <!-- <p class="total-number">(共<span>{{total}}</span>条数据)</p> -->
      <div class="flex-item">
        <div style='margin-bottom:12px;'>
          <span class="tag-select-class tag-all"
                :class="allLabelActive?'tag-select-class-active':''"
                @click="handleLabelAllFilter">全部</span>
          <span v-for="(item,index) in labelList"
                :key="item.id"
                class="tag-select-class"
                :class="activeLabelIndex===index?'tag-select-class-active':''"
                @click="handleLabelFilter(item,index)"> {{ item.title }} </span>
        </div>
        <div>
          <el-button type="primary"
                     size="mini"
                     class="btn-opearator"
                     v-if="del_repair"
                     @click="handleLabelManger">分类管理</el-button>
        </div>
      </div>
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
                         label="小区">
          <template slot-scope="scope">
            <span>{{scope.row.deptName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="电话">
          <template slot-scope="scope">
            <span>{{scope.row.telephone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="报修时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="报修内容">
          <template slot-scope="scope">
            <span>{{scope.row.detail}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.state === '1' ? '已处理' : '待处理' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  @click='handleDetail(scope.row)'>详情</span>
            <span v-if="scope.row.state !== '1'" class="tag-opearte"
                  @click='handleFeedback(scope.row)'>处理反馈</span>
            <span v-else class="tag-opearte"
                  @click='getFeedback(scope.row)'>查看</span>
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
                     layout="total,sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
    <!-- 编辑、详情、添加 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="formDialogVisible">
      <el-form :model="ujFriendCircleForm"
               :rules="rules"
               ref="ujFriendCircleForm"
               label-width="100px">
        <el-form-item label="报修分类"
                      prop="buildsId">
          <el-select v-model="ujFriendCircleForm.typeId"
                     size="small"
                     clearable
                     :disabled="dialogStatus=== 'detail'"
                     placeholder="请选择报修分类">
            <el-option v-for="item in repairList"
                       size="small"
                       :key="item.id"
                       :label="item.title"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名"
                      prop="content">
          <el-input v-model="ujFriendCircleForm.username"
                    clearable
                    :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址"
                      prop="content">
          <el-input v-model="ujFriendCircleForm.address"
                    clearable
                    :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      prop="content">
          <el-input v-model="ujFriendCircleForm.telephone"
                    clearable
                    :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="照片"
                      prop="content">
          <el-row>
            <el-col :span="7"
                    :offset="1">
              <img :src="ujFriendCircleForm.photo1"
                   class="avatar">
            </el-col>
            <el-col :span="7"
                    :offset="1">
              <img :src="ujFriendCircleForm.photo2"
                   class="avatar">
            </el-col>
            <el-col :span="7"
                    :offset="1">
              <img :src="ujFriendCircleForm.photo3"
                   class="avatar">
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="报修内容"
                      prop="content">
          <el-input v-model="ujFriendCircleForm.detail"
                    clearable
                    :disabled="true"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="photoShowDialog"
               width="30%">
      <div style="text-align: center;">
        <img :src="dialogPhoto"
             style="max-width:100%">
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary" @click="photoShowDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示"
               :visible.sync="dialogLabelVisible"
               width="30%">
      <el-tag :key="tag.id"
              v-for="tag in labelList"
              closable
              class="tags-list-class"
              :disable-transitions="false"
              @close="handleClose(tag)">
        {{tag.title}}
      </el-tag>
      <el-input class="input-new-tag"
                v-if="inputLabelVisible"
                v-model="inputLabelValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm">
      </el-input>
      <el-button v-else
                 class="button-new-tag"
                 size="small"
                 @click="showInput">添加分类</el-button>
    </el-dialog>


   <!-- 编辑、详情、添加 -->
    <el-dialog title="物业反馈"
               :visible.sync="handleDialogVisible">
      <el-form :model="handleForm"
               :rules="handleRules"
               ref="handleForm"
               label-width="100px">
      <el-row>
          <el-col :span='18'>
            <el-form-item label="报修内容: ">
              <el-input v-model="detail"
                        clearable
                        disabled
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span='12'>
            <el-form-item label="处理状态"
                          prop="quartersId">
              <el-select v-model="userListForm.state"
                         placeholder="请选择处理状态"
                         size="small">
                <el-option  size="small" label="已完成"  :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span='13'>
            <el-form-item label="处理人员: "
                          prop="repairMan">
              <el-input v-model="handleForm.repairMan"
                        clearable
                        :disabled="handleDialogStatus === 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='13'>
            <el-form-item label="处理人电话: "
                          prop="repairPhone">
              <el-input v-model="handleForm.repairPhone"
                        clearable
                        :disabled="handleDialogStatus === 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='13'>
            <el-form-item label="备注: " prop="repairRemark">
              <el-input v-model="handleForm.repairRemark"
                        clearable
                        :disabled="handleDialogStatus === 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="handleDialogVisible = false">取 消</el-button>
        <el-button v-if="handleDialogStatus !== 'detail'" type="primary" @click="handleUptForm('handleForm')">更 新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, getSingleObj, getLabelListObj, delLabelListObj, addLabelListObj, repairover } from '@/api/repair'
import { getQuarterByRole } from '@/api/village'
import { filterError } from '@/util/filterError.js'
export default {
  data() {
    return {
      del_repair: false,
      listLoading: false,
      detail: '',
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        quartersId: undefined,
        classifyId: undefined
      },
      formDialogVisible: false,
      handleDialogVisible: false,
      handleForm: {
        repairMan: undefined,
        repairPhone: undefined,
        repairRemark: undefined,
        id: undefined
      },
      multipleSelection: [],
      dialogStatus: '',
      handleDialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      ujFriendCircleForm: {
        typeId: undefined,
        username: undefined,
        address: undefined,
        telephone: undefined,
        photo: undefined,
        propertyRepair: undefined,
        audit: '0',
        remove: '0'
      },
      handleRules: {
        repairMan: [
          { required: true, message: '请输入处理人员', trigger: 'blur' }
        ],
        repairPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
        ]
      },
      rules: {
        // word: [
        //   { required: true, message: '请输入屏蔽词', trigger: 'blur' }
        // ]
      },
      repairList: [],
      // editorOption: '',
      villageOptions: [],
      villageName: '',
      photoShowDialog: false,
      dialogPhoto: '',
      labelList: [],
      activeLabelIndex: '',
      allLabelActive: true,
      dialogLabelVisible: false,
      inputLabelVisible: false,
      inputLabelValue: ''
    }
  },
  created() {
    this.del_repair = this.permissions['del_repair']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
    this.getrepairListObj()
    this.handleGetAllListObj()
    this.handleLabelList()
  },
  methods: {
    /**
     * desc 获取标签列表
     */
    async handleLabelList() {
      
      try {
        ({ data: { data: this.labelList } } = await getLabelListObj())
      }catch(err) { 
        console.log(err)
      }

    },

    /**
     * desc 处理反馈
     */
    async handleUptForm(formName) {
      try {
        await this.$refs[formName].validate()
        const res = await repairover(this.handleForm)
        await filterError(res, 'notify', 2)
        this.handleDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 触发查看反馈
     */
    getFeedback({ id, repairMan, repairPhone, repairRemark, detail }) {
      this.resetHandler({ id, repairMan, repairPhone, repairRemark }, detail);
      this.handleDialogStatus = 'detail'
    },

    /**
     * desc 触发处理反馈
     */
    handleFeedback({ id, detail }) {
      this.handleDialogStatus = ''
      this.resetHandler({ id }, detail);
    },

    /**
     * desc 重置表单数据
     */
    resetHandler({ repairMan, repairPhone, repairRemark, id }, detail) {
      this.handleForm = { repairMan, repairPhone, repairRemark, id };
      this.handleDialogVisible = true;
      this.detail = detail
    },

    /**
     * desc 获取标签
     */
    async handleGetAllListObj() {

      try {
        const { data: { data: requireInfo } } = await getQuarterByRole();
        this.villageOptions = []
        if (Array.isArray(requireInfo)) {
          requireInfo.forEach(item => { delete item.bulidList; this.villageOptions.push(item) })
        }
      }catch(err) {
        console.log(err)
      }

    },

    /**
     * desc 
     */
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

    /**
     * desc 获取报修分类
     */
    async getrepairListObj() {
      
      try {
        const { data: { data: requireInfo } } = await getLabelListObj();
        this.repairList = [];
        if (Array.isArray(requireInfo)) {
          this.repairList = requireInfo;
        }
      }catch(err) {
        console.log(err)
      }
      
    },

    /**
     * desc 触发分类标签
     */
    handleLabelFilter(row, index) {
      this.resetLabelFrom({ allLabelActive: false, activeLabelIndex: index, typeId: row.id })
      this.handleFilter()
    },

    /**
     * desc 触发全部标签
     */
    handleLabelAllFilter() {
      this.resetLabelFrom({ allLabelActive: true })
      this.handleFilter()
    },

    /**
     * desc 重置标签表单
     */
    resetLabelFrom({ activeLabelIndex, typeId, allLabelActive }) {
      this.allLabelActive = allLabelActive
      this.activeLabelIndex = activeLabelIndex
      this.listQuery.typeId = typeId
    },

    /**
     * desc 根据标签选择
     */
    handleFilter() {
      const { listQuery: { quartersId } } = this;

      if (quartersId) {
        const obj = this.villageOptions.filter(item => {
          if (item.quartersId === quartersId) {
            return item.name
          }
        })
        this.villageName = obj[0].name
      }

      this.handleCurrentChange(1)
    },
  
    /**
     * desc 触发详情
     */
    async handleDetail({ id }) {

      try {
        const res = ({ data: { data: this.ujFriendCircleForm } } = await getSingleObj({ id }))
        this.dialogStatus = 'detail'
        await filterError(res, 'notify')
        this.formDialogVisible = true
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 触发分类管理
     */
    handleLabelManger() {
      this.dialogLabelVisible = true
    },

    /**
     * desc 删除分类管理
     */
    async handleClose({ id }) {
      
      try {
        await this.$confirm('是否删除此分类, 是否继续?', '提示', {  confirmButtonText: '确定',  cancelButtonText: '取消', type: 'warning' })
        const res = await delLabelListObj({ id })
        await filterError(res, 'notify')
        this.handleLabelList()
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },
    showInput() {
      this.inputLabelVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    
    /**
     * desc 添加标签
     */
    async handleInputConfirm() {
      const { inputLabelValue } = this;
      const obj = { title: this.inputLabelValue }

      try {
        if (!inputLabelValue) return;
        await this.$confirm('是否新增此标签, 是否继续?', '提示', {  confirmButtonText: '确定',  cancelButtonText: '取消', type: 'warning' })
        const res = await addLabelListObj({ title: inputLabelValue })
        await filterError(res, 'notify')
        this.inputLabelValue = ''
        this.inputLabelVisible = false
        this.handleLabelList()
      }catch(err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss">
.tag-select-class {
  cursor: pointer;
  display: inline-block;
  height: 32px;
  padding: 0 10px;
  line-height: 30px;
  font-size: 12px;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
  margin-right: 14px;
}
.tag-select-class-active {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}
.tagsShow .el-icon-close {
  display: none;
}
</style>