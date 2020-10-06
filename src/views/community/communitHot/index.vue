<template>
  <div>
    <h2 class="layout-pages-title">社区热点</h2>
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
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <el-button type="success"
                 size="mini"
                 class="btn-opearator"
                 v-if="add_hot"
                 @click="handleAdd">添加新热点</el-button>
      <el-button type="primary"
                 size="mini"
                 class="btn-opearator"
                 v-if="public_hot"
                 @click="handlePictureAdd">添加公共热点</el-button>
      <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 v-if="del_hot"
                 @click="handleDel">删除</el-button>
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
                         label="标题">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="社区">
          <template slot-scope="scope">
            <span>{{scope.row.deptName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="阅读数量">
          <template slot-scope="scope">
            <span>{{scope.row.readnum}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="文章类型">
          <template slot-scope="scope">
            <span v-if="scope.row.publicMessage === '0'">
              <el-tag>公共</el-tag>
            </span>
            <span v-if="scope.row.publicMessage === '1'">
              <el-tag type="success">非公共</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="logo">
          <template slot-scope="scope">
            <img :src="scope.row.logo"
                 alt=""
                 srcset=""
                 @click="handleImgShow(scope.row.logo)"
                 style="width:100px">
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="btn-opearator btn-edit"
                  v-if="update_hot"
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
                     layout="sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
    <!-- 编辑、详情、添加 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="formDialogVisible">
      <el-form :model="communitForm"
               :rules="rules"
               ref="communitForm"
               label-width="100px">
        <el-row v-if="dialogStatus === 'update' || dialogStatus === 'detail'|| dialogStatus === 'create'">
          <el-col :span="12">
            <el-form-item label="社区"
                          prop="deptId">
              <el-select v-model="communitForm.deptId"
                         size="small"
                         :disabled="dialogStatus=== 'detail' || dialogStatus=== 'update'"
                         placeholder="请选择小区">
                <el-option v-for="item in villageOptions"
                           size="small"
                           :key="item.quartersId"
                           :label="item.name"
                           :value="item.quartersId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题"
                          prop="title">
              <el-input v-model="communitForm.title"
                        size="small"
                        clearable
                        :disabled="dialogStatus === 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="简介"
                          prop="briefIntroduction">
              <el-input v-model="communitForm.briefIntroduction"
                        type="textarea"
                        clearable
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="logo"
                      prop="logo">
          <el-upload class="avatar-uploader"
                     action="/api/admin/ujPicture/pictureUpload"
                     :on-success="handleAvatarSuccess"
                     :show-file-list="false">
            <img v-if="communitForm.logo"
                 :src="communitForm.logo"
                 class="avatar">
            <i v-else
               class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容"
                      prop="detail">
          <!--<quillEditor v-model="communitForm.detail"
                       ref="myQuillEditor"
                       :options="editorOption"
                       :disabled="dialogStatus=== 'detail'">
          </quillEditor>-->

          <Quill 
            :dialogStatus="dialogStatus" 
            :parentDesc="communitForm.detail" 
            @changeDesc="changeDesc"
          >
          </Quill>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false"
                   v-if="dialogStatus=== 'create' || dialogStatus=== 'update' || dialogStatus=== 'createPublic'">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'create'"
                   @click="handleSubmit('communitForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'createPublic'"
                   @click="handleSubmit('communitForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('communitForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'updatePublic'"
                   @click="handleUptForm('communitForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="photoShowDialog"
               title="图片详情"
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
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import Quill from '@/components/quill'
import { mapGetters, mapState } from 'vuex'
import { getQuarterByRole } from '@/api/village'
import { getListObj, addObj, putObj, delObj, getSingleObj } from '@/api/communitHot'
export default {
  data() {
    return {
      add_hot: false,
      update_hot: false,
      del_hot: false,
      public_hot: false,
      listLoading: false,
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      formDialogVisible: false,
      multipleSelection: [],
      dialogStatus: '',
      textMap: {
        update: '更新热点',
        create: '创建热点',
        detail: '热点详情',
        createPublic: '创建公共热点',
        updatePublic: '更新公共热点'
      },
      communitForm: {
        id: undefined,
        deptId: undefined,
        title: undefined,
        logo: undefined,
        detail: undefined,
        publicMessage: undefined,
        userName: undefined
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择小区', trigger: 'change' }
        ],
        detail: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        briefIntroduction: [
          { required: true, message: '请输入简介', trigger: 'blur' }
        ]
      },
      editorOption: {},
      photoShowDialog: false,
      dialogPhoto: '',
      villageOptions: []
    }
  },
  created() {
    console.log(1111, this.permissions)
    this.add_hot = this.permissions['add_hot']
    this.update_hot = this.permissions['update_hot']
    this.del_hot = this.permissions['del_hot']
    this.public_hot = this.permissions['public_hot']
  },
  computed: {
    ...mapGetters(['permissions', 'userInfo']),
    ...mapState({
      userInfo: state => state.user.userInfo
    })

  },
  components: {
    quillEditor,
    Quill
  },
  mounted() {
    this.handleGetAllListObj()
  },
  methods: {
    /*
      @desc  自定义事件   获取描述详情

      @param  [String] desc 详情描述
    */

    changeDesc({ desc }) {
      this.communitForm = Object.assign({}, this.communitForm, { detail: desc })
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
            if (this.villageOptions.length) {
              this.listQuery.quartersId = this.villageOptions[0].quartersId
              this.getList()
            }
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleAdd() {
      this.dialogStatus = 'create'
      this.resetForm()
      this.communitForm.publicMessage = '1'
      this.formDialogVisible = true
    },
    handlePictureAdd() {
      this.dialogStatus = 'createPublic'
      this.resetForm()
      this.communitForm.publicMessage = '0'
      this.formDialogVisible = true
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addObj(this.communitForm).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false
              this.$notify({
                title: '成功',
                message: '新增成功',
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
    handleUpdate(rows) {
      console.log(rows)
      if (rows.publicMessage === '0') {
        this.dialogStatus = 'updatePublic'
        this.formDialogVisible = true
        Object.assign(this.communitForm, rows)
      } else if (rows.publicMessage === '1') {
        this.dialogStatus = 'update'
        this.formDialogVisible = true
        Object.assign(this.communitForm, rows)
      }
    },
    handleUptForm(formName) {
      this.communitForm.userName = this.userInfo.nickname
      this.$refs[formName].validate((valid) => {
        if (valid) {
          putObj(this.communitForm).then(res => {
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
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        this.communitForm.logo = res.data
      } else {
        this.$notify({
          title: '失败',
          message: res.msg,
          type: 'error'
        })
      }
    },
    resetForm() {
      this.communitForm = {
        id: undefined,
        title: undefined,
        logo: undefined,
        detail: undefined,
        userName: this.userInfo.nickname
      }
    },
    handleDetail(rows) {
      const obj = {
        id: rows.id
      }
      getSingleObj(obj).then(res => {
        if (res.data.code === 0) {
          this.dialogStatus = 'detail'
          this.communitForm = res.data.data
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
    handleImgShow(url) {
      this.dialogPhoto = url
      this.photoShowDialog = true
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>