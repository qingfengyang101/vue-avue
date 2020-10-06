<template>
  <div>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.type"
                     size="small"
                     clearable
                     @change="handleFilter"
                     placeholder="请选择广告类型">
            <el-option label="图片"
                       value="0">
            </el-option>
            <el-option label="视频"
                       value="1">
            </el-option>
          </el-select>
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
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <el-button type="success"
                 size="mini"
                 class="btn-opearator"
                 v-if="add_advDoor"
                 @click="handleAdd">添加门禁广告素材</el-button>
      <!-- <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 v-if="del_advDoor"
                 @click="handleDel">删除</el-button> -->
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
                         label="广告类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type === '0'">图片</span>
            <span v-if="scope.row.type === '1'">视频</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="广告名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="广告描述">
          <template slot-scope="scope">
            <span>{{scope.row.describe}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="update_advDoor"
                  @click="handleUpdate(scope.row)">编辑</span>
            <span class="tag-opearte"
                  v-if="del_advDoor"
                  @click="handleDel(scope.row)">删除</span>
            <span class="tag-opearte"
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
      <el-form :model="advDoorForm"
               :rules="rules"
               ref="advDoorForm"
               label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="广告类型"
                          prop="type">
              <el-select v-model="advDoorForm.type"
                         @change="handleTypeChange"
                         :disabled="dialogStatus=== 'detail'"
                         placeholder="请选择"
                         size="small">
                <el-option label="图片"
                           value="0">
                </el-option>
                <el-option label="视频"
                           value="1">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="广告文件名称"
                          prop="name">
              <el-input v-model="advDoorForm.name"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>

            <el-form-item label="广告文件描述"
                          prop="describe">
              <el-input v-model="advDoorForm.describe"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item label="广告条目状态"
                          prop="status">
              <el-radio-group v-model="advDoorForm.status"
                              :disabled="dialogStatus=== 'detail'"
                              size="small">
                <el-radio label="0">正常</el-radio>
                <el-radio label="1">删除</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="广告显示方向"
                          prop="direction">
              <el-radio-group v-model="advDoorForm.direction"
                              :disabled="dialogStatus=== 'detail'"
                              size="small">
                <el-radio label="0">竖屏</el-radio>
                <el-radio label="1">横屏</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="广告显示时间"
                          prop="showTime">
              <el-input v-model="advDoorForm.showTime"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small">
                <template slot="append">秒</template>
              </el-input>
            </el-form-item>
            <el-form-item label="轮播图片"
                          v-if="typeFlag === 0"
                          prop="path">
              <el-upload class="avatar-uploader"
                         action="/api/admin/ujPicture/pictureUpload"
                         :on-success="handleAvatarSuccess"
                         :show-file-list="false">
                <img v-if="advDoorForm.path"
                     :src="advDoorForm.path"
                     class="avatar">
                <i v-else
                   class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="视频上传"
                          v-if="typeFlag === 1"
                          prop="path">
              <el-upload class="avatar-uploader el-upload--text"
                         action="/api/admin/ujPicture/pictureUpload"
                         :show-file-list="false"
                         :on-progress="uploadVideoProcess"
                         :on-success="handleVideoSuccess"
                         :before-upload="beforeUploadVideo">
                <video v-if="advDoorForm.path !='' && videoFlag == false"
                       width="320"
                       height="240"
                       :src="advDoorForm.path"
                       class="avatar"
                       controls="controls">您的浏览器不支持视频播放</video>
                <i v-else-if="advDoorForm.path =='' && videoFlag == false"
                   class="el-icon-plus avatar-uploader-icon"></i>
                <el-progress v-if="videoFlag == true"
                             type="circle"
                             :percentage="videoUploadPercent"
                             style="margin-top:30px;"></el-progress>
              </el-upload>
              <P class="text">请保证视频格式正确，且不超过50M</P>
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
                   @click="handleSubmit('advDoorForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('advDoorForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, addObj, putObj, delObj, getSingleObj } from '@/api/advDoor'
import { isNumber } from '@/api/validator'
export default {
  data() {
    return {
      add_advDoor: false,
      update_advDoor: false,
      del_advDoor: false,
      listLoading: false,
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20
      },
      formDialogVisible: false,
      multipleSelection: [],
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      advDoorForm: {
        id: undefined,
        type: undefined,
        name: undefined,
        describe: undefined,
        path: undefined,
        status: undefined,
        direction: undefined,
        showTime: undefined
      },
      rules: {
        name: [
          { required: true, message: '请输入门禁广告名称', trigger: 'blur' }
        ],
        showTime: [
          { required: true, message: '请输入门禁广告显示时间', trigger: 'blur' },
          {
            validator: isNumber,
            trigger: 'blur'
          }
        ]
      },
      videoFlag: false,
      typeFlag: 0,
      videoUploadPercent: 0
    }
  },
  created() {
    this.add_advDoor = this.permissions['add_advDoor']
    this.update_advDoor = this.permissions['update_advDoor']
    this.del_advDoor = this.permissions['del_advDoor']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true

      try {
        const { data: { code, msg: message, data: { total, records } } } = await getListObj(this.listQuery)
        
        if (code === 0) {
          this.total = total;
          this.tableData = records
        } else {
          this.$notify({ title: '失败', message, type: 'error' })
        }
        
        this.listLoading = false
      }catch(err) {
        console.log(err)
        this.listLoading = false
      }
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
      this.typeFlag = 0
      this.formDialogVisible = true
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {

        if (!valid) {
          return;
        }

        try {
          const { data: { code, msg: message } } =  await addObj(this.advDoorForm)

          if (code === 0) {
            this.formDialogVisible = false
            this.$notify({ title: '成功', message: '新增成功', type: 'success' })
            this.getList()
          } else {
            this.$notify({ title: '失败', message, type: 'error' })
          }
        }catch(err) {
          console.log(err)
        }
      })
    },
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      Object.assign(this.advDoorForm, rows)
      if (rows.type === '1') {
        this.typeFlag = 1
      }
      this.formDialogVisible = true
    },
    handleUptForm(formName) {
      this.$refs[formName].validate(async (valid) => {

        if (!valid) {
          return;
        }

        try {
          const { data: { code, msg: message } } = await putObj(this.advDoorForm)

          if (code === 0) {
            this.formDialogVisible = false
            this.$notify({ title: '成功', message: '编辑成功', type: 'success' })
            this.getList()
          } else {
            this.$notify({ title: '失败', message, type: 'error' })
          }
        }catch(err) {
          console.log(err)
        }
      })
    },
    handleDel(rows) {
      this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(rows.id).then(res => {
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
    },
    resetForm() {
      this.advDoorForm = {
        id: undefined,
        type: '0',
        name: undefined,
        describe: undefined,
        path: undefined,
        status: undefined,
        direction: undefined,
        showTime: undefined
      }
    },
    handleDetail(rows) {
      getSingleObj(rows.id).then(res => {
        if (res.data.code === 0) {
          this.dialogStatus = 'detail'
          this.advDoorForm = res.data.data
          if (rows.type === '1') {
            this.typeFlag = 1
          }
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
    handleTypeChange() {
      this.advDoorForm.path = ''
      if (this.advDoorForm.type === '0') {
        this.typeFlag = 0
      } else if (this.advDoorForm.type === '1') {
        this.typeFlag = 1
      }
    },
    beforeUploadVideo(file) {
      const isLt50M = file.size / 1024 / 1024 < 50
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      if (!isLt50M) {
        this.$message.error('上传视频大小不能超过50MB哦!')
        return false
      }
    },
    handleVideoSuccess(res, file) {
      this.videoFlag = false
      this.videoUploadPercent = 0
      if (res.code === 0) {
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success'
        })
        this.advDoorForm.path = res.data
      } else {
        this.$notify({
          title: '失败',
          message: res.data.msg,
          type: 'error'
        })
      }
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true
      this.videoUploadPercent = file.percentage.toFixed(0)
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success'
        })
        this.advDoorForm.path = res.data
      } else {
        this.$notify({
          title: '失败',
          message: res.data.msg,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss">
</style>

