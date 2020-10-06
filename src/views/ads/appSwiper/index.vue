<template>
  <div>
    <h2 class="layout-pages-title">app首页轮播图</h2>
    <!-- <div class="layout-pages-search">
      <el-input placeholder="请输入轮播图名称"
                size="small"
                class="search-btn"
                v-model="listQuery.content"
                @keyup.native.enter='handleFilter'
                clearable>
      </el-input>
      <el-button size="small"
                 type="primary"
                 @click="handleFilter">搜索</el-button>
    </div> -->
    <div class="layout-pages-content">
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <el-button type="success"
                 size="mini"
                 class="btn-opearator"
                 v-if="add_appSwiper"
                 @click="handleAdd">添加轮播图</el-button>
      <!--<el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 v-if="del_appSwiper"
                 @click="handleDel">删除</el-button>-->
      <el-table :data="tableData"
                class="layout-pages-content-table"
                v-loading="listLoading"
                @selection-change="handleSelectionChange"
                style="width: 100%">
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="名称">
          <template slot-scope="scope">
            <span>{{scope.row.positionName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="位置">
          <template slot-scope="scope">
            <span>{{scope.row.positionNum}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="投放人">
          <template slot-scope="scope">
            <span>{{scope.row.putPerson}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="投放电话">
          <template slot-scope="scope">
            <span>{{scope.row.perPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="投放开始时间">
          <template slot-scope="scope">
            <span>{{scope.row.putStartdate}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="投放结束时间">
          <template slot-scope="scope">
            <span>{{scope.row.putOverdate}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="轮播图">
          <template slot-scope="scope">
            <img :src="scope.row.url"
                 class="table-img"
                 alt=""
                 @click="handleImgShow(scope.row.url)"
                 srcset="">
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="是否可用">
          <template slot-scope="scope">
            <span v-if="scope.row.isvilable==='1'">启用</span>
            <span v-if="scope.row.isvilable==='0'">禁用</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="del_appSwiper"
                  @click="handleDel(scope.row)">删除</span>
            <span class="tag-opearte"
                  v-if="edit_appSwiper"
                  @click="handleUpdate(scope.row)">编辑</span>
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
      <el-form :model="appSwiperForm"
               :rules="rules"
               ref="appSwiperForm"
               label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="轮播图名称"
                          prop="positionName">
              <el-input v-model="appSwiperForm.positionName"
                        placeholder="轮播图名称"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="投放人"
                          prop="putPerson">
              <el-input v-model="appSwiperForm.putPerson"
                        clearable
                        placeholder="投放人"
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="投放人电话"
                          prop="perPhone">
              <el-input v-model="appSwiperForm.perPhone"
                        placeholder="投放人电话"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="投放开始时间"
                          prop="putStartdate">
              <el-date-picker v-model="appSwiperForm.putStartdate"
                              size="small"
                              type="datetime"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              :disabled="dialogStatus === 'detail'"
                              placeholder="投放开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="投放结束时间"
                          prop="putOverdate">
              <el-date-picker v-model="appSwiperForm.putOverdate"
                              size="small"
                              type="datetime"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              :disabled="dialogStatus === 'detail'"
                              placeholder="投放结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="费用"
                          prop="putCost">
              <el-input v-model.number="appSwiperForm.putCost"
                        placeholder="费用"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="dialogStatus !== 'create'">
          <el-col :span="12">
            <el-form-item label="是否可用"
                          prop="putCost">
              <el-radio-group v-model="appSwiperForm.isvilable"
                              :disabled="dialogStatus=== 'detail'">
                <el-radio label="0">不启用</el-radio>
                <el-radio label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="轮播图位置"
                          prop="positionNum">
              <el-input v-model="appSwiperForm.positionNum"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="轮播图片"
                      prop="url">
          <el-upload class="avatar-uploader"
                     action="/api/admin/ujPicture/pictureUpload"
                     :on-success="handleAvatarSuccess"
                     :show-file-list="false">
            <img v-if="appSwiperForm.url"
                 :src="appSwiperForm.url"
                 class="avatar">
            <i v-else
               class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false"
                   v-if="dialogStatus=== 'create' || dialogStatus=== 'update'">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'create'"
                   @click="handleSubmit('appSwiperForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('appSwiperForm')">更 新</el-button>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj, delObj, addObj, editObj } from '@/api/appSwiper'
import { isNumberFee } from '@/api/validator'
export default {
  data() {
    const startTimeValid = (rule, value, callback) => {
      const self = this
      if (!value) {
        return callback(new Error('生效时间不能为空'))
      }
      setTimeout(() => {
        if (self.appSwiperForm.putOverdate) {
          const beginDate = self.appSwiperForm.putStartdate
          const endDate = self.appSwiperForm.putOverdate
          const d1 = new Date(beginDate.replace(/\-/g, '\/'))
          const d2 = new Date(endDate.replace(/\-/g, '\/'))
          if (beginDate !== '' && endDate !== '' && d1 >= d2) {
            callback(new Error('开始时间不能大于结束时间！'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    const endTimeValid = (rule, value, callback) => {
      const self = this
      if (!value) {
        return callback(new Error('失效时间不能为空'))
      }
      setTimeout(() => {
        if (self.appSwiperForm.putStartdate) {
          const beginDate = self.appSwiperForm.putStartdate
          const endDate = self.appSwiperForm.putOverdate
          const d1 = new Date(beginDate.replace(/\-/g, '\/'))
          const d2 = new Date(endDate.replace(/\-/g, '\/'))
          if (beginDate !== '' && endDate !== '' && d1 >= d2) {
            callback(new Error('结束时间不能小于开始时间！'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    return {
      add_appSwiper: false,
      edit_appSwiper: false,
      del_appSwiper: false,
      listLoading: false,
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 20
      },
      multipleSelection: [],
      photoShowDialog: false,
      dialogPhoto: '',
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      appSwiperForm: {
        id: undefined,
        positionName: undefined,
        url: undefined,
        positionNum: undefined,
        putPerson: undefined,
        perPhone: undefined,
        putStartdate: undefined,
        putOverdate: undefined,
        putCost: undefined,
        isvilable: '1'
      },
      formDialogVisible: false,
      rules: {
        positionName: [
          { required: true, message: '请输入轮播图名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请选择轮播图', trigger: 'change' }
        ],
        putStartdate: [
          { required: true, message: '请选择有效期开始时间:', trigger: 'change' },
          { validator: startTimeValid, trigger: 'change' }
        ],
        putOverdate: [
          { required: true, message: '请选择有效期结束时间:', trigger: 'change' },
          { validator: endTimeValid, trigger: 'change' }
        ],
        putCost: [
          { validator: isNumberFee, trigger: 'blur' }
        ]
      },
      dialogImageUrl: '',
      imgDialogVisible: false,
      // fileList: [],
      fileList: []
    }
  },
  created() {
    this.add_appSwiper = this.permissions['add_appSwiper']
    this.edit_appSwiper = this.permissions['edit_appSwiper']
    this.del_appSwiper = this.permissions['del_appSwiper']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    
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
    handleImgShow(url) {
      this.dialogPhoto = url
      this.photoShowDialog = true
    },
    handleAdd() {
      this.dialogStatus = 'create'
      this.resetForm()
      this.formDialogVisible = true
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addObj(this.appSwiperForm).then(res => {
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
    handleDel(row) {
      this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(row.id).then(res => {
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
      this.appSwiperForm = {
        id: undefined,
        positionName: undefined,
        url: undefined,
        positionNum: undefined,
        putPerson: undefined,
        perPhone: undefined,
        putStartdate: undefined,
        putOverdate: undefined,
        putCost: undefined,
        isvilable: '1'
      }
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success'
        })
        this.appSwiperForm.url = res.data
      } else {
        this.$notify({
          title: '失败',
          message: res.data.msg,
          type: 'error'
        })
      }
    },
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      Object.assign(this.appSwiperForm, rows)
      this.formDialogVisible = true
    },
    handleUptForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editObj(this.appSwiperForm).then(res => {
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
    }
  }
}
</script>
