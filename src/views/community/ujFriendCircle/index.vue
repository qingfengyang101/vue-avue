<template>
  <div>
    <h2 class="layout-pages-title">社区帖子管理</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.quartersId"
                     size="small"
                     @change="handleFilter"
                     clearable
                     placeholder="请选择小区">
            <el-option v-for="item in villageOptions"
                       size="small"
                       :key="item.quartersId"
                       :label="item.name"
                       :value="item.quartersId">
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
    <div class="layout-pages-content">
      <!-- <p class="total-number">(共<span>{{total}}</span>条数据)</p> -->
      <div class="flex-item">
        <div>
          <span class="tag-select-class tag-all"
                :class="allLabelActive?'tag-select-class-active':''"
                @click="handleLabelAllFilter">全部</span>
          <span v-for="(item,index) in labelList"
                :key="item.id"
                class="tag-select-class"
                :class="activeLabelIndex===index?'tag-select-class-active':''"
                @click="handleLabelFilter(item,index)">{{item.name}}</span>
        </div>
        <div>
          <el-button type="primary"
                     size="mini"
                     class="btn-opearator"
                     v-if="look_ujFriendCircleClassify"
                     @click="handleLabelManger">标签管理</el-button>
          <el-button type="warning"
                     size="mini"
                     class="btn-opearator"
                     v-if="look_blackWord"
                     @click="handleBlackWordManger">屏蔽词管理</el-button>
          <el-button type="danger"
                     size="mini"
                     class="btn-opearator del-btn"
                     v-if="del_ujFriendCircle"
                     @click="handleDel">删除</el-button>
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
                         label="内容">
          <template slot-scope="scope">
            <span>{{scope.row.content}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="上传图片">
          <template slot-scope="scope">
            <img :src="scope.row.imgOne"
                 @click="handleImgShow(scope.row.imgOne)"
                 class="table-img"
                 v-if="scope.row.imgOne"
                 alt=""
                 srcset="">
            <img :src="scope.row.imgTwo"
                 @click="handleImgShow(scope.row.imgOne)"
                 class="table-img"
                 v-if="scope.row.imgTwo"
                 alt=""
                 srcset="">
            <img :src="scope.row.imgThree"
                 class="table-img"
                 @click="handleImgShow(scope.row.imgOne)"
                 v-if="scope.row.imgThree"
                 alt=""
                 srcset="">
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="审核">
          <template slot-scope="scope">
            <span v-if="scope.row.audit==='0'">待审核</span>
            <span v-if="scope.row.audit==='1'">审核通过</span>
            <span v-if="scope.row.audit==='2'">审核不通过</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="btn-opearator btn-edit"
                  v-if="update_ujFriendCircle"
                  @click="handleUpdate(scope.row)">编辑&nbsp;/&nbsp;</span>
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="内容"
                          prop="content">
              <el-input v-model="ujFriendCircleForm.content"
                        size="small"
                        clearable
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <img :src="ujFriendCircleForm.imgOne"
             class="ujFriendCircleAvatar">
        <img :src="ujFriendCircleForm.imgTwo"
             class="ujFriendCircleAvatar">
        <img :src="ujFriendCircleForm.imgThree"
             v-if="ujFriendCircleForm.imgThree"
             class="ujFriendCircleAvatar">
        <el-row>
          <el-col :span="12">
            <el-form-item label="审核"
                          prop="audit">
              <el-select v-model="ujFriendCircleForm.audit"
                         size="small"
                         placeholder="请选择">
                <el-option label="待审核"
                           value="0">
                </el-option>
                <el-option label="审核成功"
                           value="1">
                </el-option>
                <el-option label="审核失败"
                           value="2">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="帖子状态"
                          prop="remove">
              <el-select v-model="ujFriendCircleForm.remove"
                         size="small"
                         placeholder="请选择">
                <el-option label="上架"
                           value="0">
                </el-option>
                <el-option label="下架"
                           value="1">
                </el-option>
              </el-select>
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
                   @click="handleSubmit('ujFriendCircleForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('ujFriendCircleForm')">更 新</el-button>
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
        <el-button type="primary"
                   @click="photoShowDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示"
               :visible.sync="dialogLabelVisible"
               width="30%">
      <el-tag :key="tag.id"
              v-for="tag in labelList"
              closable
              class="tags-list-class"
              :class="del_ujFriendCircleClassify?'':'tagsShow'"
              :disable-transitions="false"
              @close="handleClose(tag)">
        {{tag.name}}
      </el-tag>
      <el-input class="input-new-tag"
                v-if="inputLabelVisible"
                v-model="inputLabelValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm">
      </el-input>
      <el-button v-if="!inputLabelVisible && add_ujFriendCircleClassify"
                 class="button-new-tag"
                 size="small"
                 @click="showInput">添加标签</el-button>
    </el-dialog>
    <el-dialog title="U家社区帖子屏蔽词管理"
               class="blackWord"
               width="60%"
               :visible.sync="dialogBlackWord">
      <blackWord></blackWord>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, delObj, getSingleObj, putObj, getLabelListObj, delLabelListObj, addLabelListObj } from '@/api/ujFriendCircle'
import { getQuarterByRole } from '@/api/village'
import blackWord from './../blackWord/index'
export default {
  data() {
    return {
      add_ujFriendCircle: false,
      update_ujFriendCircle: false,
      del_ujFriendCircle: false,
      look_blackWord: false,
      del_ujFriendCircleClassify: false,
      look_ujFriendCircleClassify: false,
      add_ujFriendCircleClassify: false,
      listLoading: false,
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
      multipleSelection: [],
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      ujFriendCircleForm: {
        id: undefined,
        word: undefined,
        audit: '0',
        remove: '0'
      },
      rules: {
        word: [
          { required: true, message: '请输入屏蔽词', trigger: 'blur' }
        ]
      },
      villageOptions: [],
      villageName: '',
      photoShowDialog: false,
      dialogPhoto: '',
      labelList: [],
      activeLabelIndex: '',
      allLabelActive: true,
      dialogLabelVisible: false,
      inputLabelVisible: false,
      inputLabelValue: '',
      dialogBlackWord: false
    }
  },
  created() {
    this.add_ujFriendCircle = this.permissions['add_ujFriendCircle']
    this.update_ujFriendCircle = this.permissions['update_ujFriendCircle']
    this.del_ujFriendCircle = this.permissions['del_ujFriendCircle']
    this.look_blackWord = this.permissions['look_blackWord']
    this.look_ujFriendCircleClassify = this.permissions['look_ujFriendCircleClassify']
    this.del_ujFriendCircleClassify = this.permissions['del_ujFriendCircleClassify']
    this.add_ujFriendCircleClassify = this.permissions['add_ujFriendCircleClassify']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
    this.handleGetAllListObj()
    this.handleLabelList()
  },
  components: {
    blackWord
  },
  methods: {
    handleLabelList() {
      getLabelListObj().then(res => {
        this.labelList = res.data.data
      })
    },
    handleGetAllListObj() {
      getQuarterByRole().then(res => {
        this.villageOptions = []
        const requireInfo = res.data.data
        if (requireInfo) {
          if (requireInfo.length) {
            requireInfo.forEach(item => {
              delete item.bulidList
              this.villageOptions.push(item)
            })
          }
        }
      })
    },
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
    handleLabelFilter(row, index) {
      this.allLabelActive = false
      this.activeLabelIndex = index
      this.listQuery.classifyId = row.id
      this.handleFilter()
    },
    handleLabelAllFilter() {
      this.activeLabelIndex = undefined
      this.listQuery.classifyId = undefined
      this.allLabelActive = true
      this.handleFilter()
    },
    handleFilter() {
      if (this.listQuery.quartersId) {
        const obj = this.villageOptions.filter(item => {
          if (item.quartersId === this.listQuery.quartersId) {
            return item.name
          }
        })
        this.villageName = obj[0].name
      }
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
    handleDel() {
      if (this.multipleSelection.length) {
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const delIds = {
            ids: ''
          }
          this.multipleSelection.forEach(item => {
            delIds.ids += item.id + ','
          })
          delIds.ids = delIds.ids.substring(0, delIds.ids.length - 1)
          delObj(delIds).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        })
      } else {
        this.$notify({
          title: '失败',
          message: '请选择要删除的数据',
          type: 'error'
        })
      }
    },
    handleImgShow(url) {
      this.dialogPhoto = url
      this.photoShowDialog = true
    },
    handleDetail(rows) {
      getSingleObj(rows.id).then(res => {
        if (res.data.code === 0) {
          this.dialogStatus = 'detail'
          this.ujFriendCircleForm = res.data.data
          this.formDialogVisible = true
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      Object.assign(this.ujFriendCircleForm, rows)
      this.formDialogVisible = true
    },
    handleUptForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          putObj(this.ujFriendCircleForm).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false
              this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success'
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleLabelManger() {
      this.dialogLabelVisible = true
    },
    handleClose(tag) {
      this.$confirm('是否删除此标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delLabelListObj(tag.id).then(res => {
          if (res.data.code === 0) {
            this.handleLabelList()
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      })
    },
    showInput() {
      this.inputLabelVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const obj = {
        name: this.inputLabelValue
      }
      if (this.inputLabelValue) {
        this.$confirm('是否新增此标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          addLabelListObj(obj).then(res => {
            if (res.data.code === 0) {
              this.inputLabelValue = ''
              this.inputLabelVisible = false
              this.handleLabelList()
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        }).catch(() => {
          this.inputLabelValue = ''
          this.inputLabelVisible = false
        })
      }
    },
    handleBlackWordManger() {
      this.dialogBlackWord = true
    }
  }
}
</script>

<style lang="scss">
.ujFriendCircleAvatar {
  text-align: center;
  max-width: 200px;
  padding: 12px;
}
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

