<template>
  <div>
    <h2 class="layout-pages-title">家政列表</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.homeficationId"
                     size="small"
                     @change="handleFilter"
                     placeholder="请选择服务">
            <el-option v-for="item in villageOptions"
                       size="small"
                       :key="item.homeficationId"
                       :label="item.title"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3"
                :offset="1">
          <el-input placeholder="请输入服务名称"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.title"
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
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <el-button type="success"
        size="mini"
        class="btn-opearator"
        v-if="add_house"
        @click="handleAdd">添加家政服务</el-button>
      <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 v-if="del_house"
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
                         label="服务名称">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="服务时间">
          <template slot-scope="scope">
            <span>{{scope.row.serviceTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="电话">
          <template slot-scope="scope">
            <span>{{scope.row.tele}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="地址">
          <template slot-scope="scope">
            <span>{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="发布时间">
          <template slot-scope="scope">
            <span>{{scope.row.releaseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="操作"
                         min-width="120px">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="update_house"
                  @click="handleUpdate(scope.row)">编辑</span>
            <span class="tag-opearte"
                  @click="handleDetail(scope.row)">详情</span>
            <!-- <span class="tag-opearte"
                  v-if="del_house"
                  @click="handleDel(scope.row)">删除</span> -->
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
      <el-form :model="houseForm"
               :rules="rules"
               ref="houseForm"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务分类"
                          prop="homeficationId">
              <el-select v-model="houseForm.homeficationId"
                         :disabled="dialogStatus=== 'detail'"
                         size="small"
                         placeholder="请选择服务分类">
                <el-option v-for="item in villageOptions"
                           size="small"
                           :key="item.homeficationId"
                           :label="item.title"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务名称"
                          prop="title">
              <el-input v-model="houseForm.title"
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="姓名"
                          prop="name">
              <el-input v-model="houseForm.name"
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话"
                          prop="tele">
              <el-input v-model="houseForm.tele"
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址"
                          prop="address">
              <el-input v-model="houseForm.address"
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务时间"
                          prop="serviceTime">
              <el-date-picker v-model="houseForm.serviceTime"
                              type="datetime"
                              format='yyyy-MM-dd HH:mm:ss'
                              value-format='yyyy-MM-dd HH:mm:ss'
                              placeholder="选择日期时间"
                              :disabled="dialogStatus=== 'detail'"
                              size="small">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="服务简介"
                          prop="briefIntroduction">
              <el-input v-model="houseForm.briefIntroduction"
                        type="textarea"
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="logo"
                      prop="photo">
          <el-upload class="avatar-uploader"
                     action="/api/admin/ujPicture/pictureUpload"
                     :on-success="handleAvatarSuccess"
                     :show-file-list="false">
            <img v-if="houseForm.photo"
                 :src="houseForm.photo"
                 class="avatar">
            <i v-else
               class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="详情"
                      prop="describe">
          <!-- <quillEditor v-model="houseForm.describe"
                       ref="myQuillEditor"
                       :options="editorOption"
                       :disabled="dialogStatus=== 'detail'">
          </quillEditor> -->

          <Quill 
            :dialogStatus="dialogStatus" 
            :parentDesc="houseForm.describe" 
            @changeDesc="changeDesc"
          >
          </Quill>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false"
                   v-if="dialogStatus=== 'create' || dialogStatus=== 'update'">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'create'"
                   @click="handleSubmit('houseForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('houseForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
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
import { mapGetters } from 'vuex'
import { getListObj, addObj, putObj, delObj, getSIngleObj, getQuarterByRole } from '@/api/house'
import { validatePhone } from '@/api/validator'
import VDistpicker from 'v-distpicker'
import { filterError } from '@/util/filterError.js'
export default {
  data() {
    return {
      // add_houselist: false,
      add_house: false,
      update_house: false,
      del_house: false,
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
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      houseForm: {
        homeficationId: undefined,
        title: undefined,
        name: undefined,
        tele: undefined,
        address: undefined,
        photo: undefined,
        serviceTime: undefined,
        briefIntroduction: undefined
      },
      rules: {
        homeficationId: [
          { required: true, message: '请选择家政服务类别', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入服务名称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        tele: [
          { required: true, message: '请输入联系电话', trigger: 'change' },
          {
            validator: validatePhone,
            trigger: 'blur'
          }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        briefIntroduction: [
          { required: true, message: '请输入简介', trigger: 'blur' }
        ]
      },
      villageOptions: [],
      editorOption: {}
    }
  },
  created() {
    // this.add_houselist = this.permissions['add_houselist']
    this.add_house = this.permissions['add_house']
    this.update_house = this.permissions['update_house']
    this.del_house = this.permissions['del_house']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.handleGetAllListObj()
  },
  components: { VDistpicker, quillEditor, Quill },
  methods: {

    /*
      @desc  自定义事件   获取描述详情

      @param  [String] desc 详情描述
    */

    changeDesc({ desc }) {
      this.houseForm = Object.assign({}, this.houseForm, { describe: desc })
    },

    /**
     * desc 获取家政分类
     */
    async handleGetAllListObj() {

      try {
        const { data: { data: requireInfo } } = await getQuarterByRole();
        this.villageOptions = []
        if (requireInfo.length) {
          requireInfo.forEach(item => {
            delete item.bulidList
            this.villageOptions.push(item)
          })
        }

        if (this.villageOptions.length) {
          this.listQuery.homeficationId = this.villageOptions[0].homeficationId
          this.getList()
        }

      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 获取家政列表
     */
    async getList() {

      try {
        this.listLoading = true
        const res = ({ data: { data: { total: this.total, records: this.tableData } } } = await getListObj(this.listQuery))
        this.listLoading = false
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
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
    /**
     * desc 触发添加按钮
     */
    handleAdd() {
      this.dialogStatus = 'create'
      this.resetForm()
      this.formDialogVisible = true
    },

    /**
     * desc 添加数据
     */
    async handleSubmit(formName) {

      try {
        await this.$refs[formName].validate()
        const res = await addObj(this.houseForm)
        await filterError(res, 'notify', 1)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },
    
    /**
     * desc 触发更新按钮
     */
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      Object.assign(this.houseForm, rows)
      this.formDialogVisible = true
    },

    /**
     * desc 更新数据
     */
    async handleUptForm(formName) {

      try {
        await this.$refs[formName].validate()
        const res = await putObj(this.houseForm)
        await filterError(res, 'notify', 3)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }

    },

    /**
     * desc 删除数据
     */
    async handleDel() {

      try {

        const { multipleSelection } = this;

        if (!multipleSelection.length) {
          this.$notify({ title: '失败', message: '请选择要删除的数据', type: 'error' })
          return;
        }

        await this.$confirm('此操作将删除该条数据, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        let delIds = { ids: '' }
        multipleSelection.forEach(item => { delIds.ids += item.id + ',' })
        delIds.ids = delIds.ids.substring(0, delIds.ids.length - 1)
        const res = await delObj(delIds)
        await filterError(res, 'notify', 4)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 重置请求
     */
    resetForm() {
      this.houseForm = {
        homeficationId: undefined,
        title: undefined,
        name: undefined,
        tele: undefined,
        address: undefined,
        serviceTime: undefined,
        briefIntroduction: undefined,
        photo: undefined
      }
    },

    /**
     * desc 获取详情
     */
    async handleDetail({ id }) {

      try {
        const res = ({data: { data: this.houseForm }} = await getSIngleObj({ id }))
        await filterError(res, 'notify')
        this.dialogStatus = 'detail'
        this.formDialogVisible = true
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 图片上传成功
     */
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        this.houseForm.photo = res.data
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

