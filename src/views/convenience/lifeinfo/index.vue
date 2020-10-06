<template>
  <div>
    <h2 class="layout-pages-title">生活列表</h2>
    <div class="layout-pages-search">
      <el-input placeholder="请输入小区名"
                size="small"
                class="search-btn"
                v-model="listQuery.name"
                @keyup.native.enter='handleFilter'
                clearable>
      </el-input>
      <el-button size="small"
                 type="primary"
                 @click="handleFilter">搜索</el-button>
    </div>
    <div class="layout-pages-content">
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <el-button type="success"
                 size="mini"
                 class="btn-opearator"
                 v-if="add_life"
                 @click="handleAdd">添加新生活服务</el-button>
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
                         label="店名">
          <template slot-scope="scope">
            <span>{{scope.row.storeName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="店主名">
          <template slot-scope="scope">
            <span>{{scope.row.storeOwner}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="联系电话">
          <template slot-scope="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="营业时间">
          <template slot-scope="scope">
            <span>{{scope.row.businessHour}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="简介">
          <template slot-scope="scope">
            <span>{{scope.row.brief}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="主治">
          <template slot-scope="scope">
            <span>{{scope.row.major}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="经度">
          <template slot-scope="scope">
            <span>{{scope.row.longitude}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="纬度">
          <template slot-scope="scope">
            <span>{{scope.row.latitude}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理"
                         width="240px">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="update_life"
                  @click="handleUpdate(scope.row)">编辑</span>
            <span class="tag-opearte"
                  v-if="del_life"
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
      <el-form :model="lifeInfoForm"
               :rules="rules"
               ref="lifeInfoForm"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务类别"
                          prop="categoryId">
              <el-select v-model="lifeInfoForm.categoryId"
                         size="small"
                         clearable
                         @change="handleCategoryId"
                         :disabled="dialogStatus=== 'detail'"
                         placeholder="请选择服务类别">
                <el-option v-for="item in categoryList"
                           :key="item.categoryId"
                           :label="item.name"
                           :value="item.categoryId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店名"
                          prop="storeName">
              <el-input v-model="lifeInfoForm.storeName"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店主名"
                          prop="storeOwner">
              <el-input v-model="lifeInfoForm.storeOwner"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话"
                          prop="phone">
              <el-input v-model="lifeInfoForm.phone"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业时间"
                          prop="businessHour">
              <el-input v-model="lifeInfoForm.businessHour"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="简介"
                          prop="brief">
              <el-input v-model="lifeInfoForm.brief"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主治"
                          prop="major">
              <el-input v-model="lifeInfoForm.major"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经度"
                          prop="longitude">
              <el-input v-model="lifeInfoForm.longitude"
                        clearable
                        @focus="handleOpenMapDialog"
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度"
                          prop="latitude">
              <el-input v-model="lifeInfoForm.latitude"
                        @focus="handleOpenMapDialog"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <!-- <el-form-item label="列表图片"
                          prop="latitude">
              <el-input v-model="lifeInfoForm.latitude"
                        @focus="handleOpenMapDialog"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item> -->
            <el-form-item label="列表图片"
                          prop="banner">
              <el-upload class="avatar-uploader"
                         action="/api/admin/ujPicture/pictureUpload"
                         :on-success="handleAvatarSuccess"
                         :show-file-list="false">
                <img v-if="lifeInfoForm.banner"
                     :src="lifeInfoForm.banner"
                     class="avatar">
                <i v-else
                   class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="详情"
                      prop="detail">
          <!--<quillEditor v-model="lifeInfoForm.detail"
                       ref="myQuillEditor"
                       :options="editorOption"
                       :disabled="dialogStatus=== 'detail'">
          </quillEditor>-->
          <Quill 
            :dialogStatus="dialogStatus" 
            :parentDesc="lifeInfoForm.detail" 
            @changeDesc="changeDesc"
          >
          </Quill>
        </el-form-item>
      </el-form>
      <!-- 根据地图选点 -->
      <el-dialog title="选取经纬度"
                 :visible.sync="mapDialogVisible"
                 append-to-body>
        <el-amap vid="amapDemo"
                 :zoom="zoom"
                 :events="reqPosition"
                 :center="center"
                 style="height: 55vh;">
        </el-amap>
      </el-dialog>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false"
                   v-if="dialogStatus=== 'create' || dialogStatus=== 'update'">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'create'"
                   @click="handleSubmit('lifeInfoForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('lifeInfoForm')">更 新</el-button>
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
import { getListObj, addObj, putObj, delObj, getSIngleObj, getcategoryList } from '@/api/lifeinfo'
import VDistpicker from 'v-distpicker'
import { validatePhone } from '@/api/validator'
import { filterError } from '@/util/filterError.js'
export default {
  data() {
    const self = this
    const addressReg = (rules, value, callback) => {
      if (this.isAddress) {
        if (!value) {
          callback(new Error('请输入经纬度'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      add_life: false,
      update_life: false,
      del_life: false,
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
      lifeInfoForm: {
        name: undefined,
        categoryId: undefined,
        storeName: undefined,
        storeOwner: undefined,
        phone: undefined,
        businessHour: undefined,
        brief: undefined,
        major: undefined,
        policePhone: undefined,
        longitude: undefined,
        latitude: undefined,
        detail: undefined,
        banner: undefined
      },
      rules: {
        categoryId: [
          { required: true, message: '请选择服务类别', trigger: 'change' }
        ],
        storeName: [
          { required: true, message: '请输入店名', trigger: 'blur' }
        ],
        storeOwner: [
          { required: true, message: '请输入店主', trigger: 'blur' }
        ],
        longitude: [
          { validator: addressReg, trigger: 'blur' }
        ],
        latitude: [
          { validator: addressReg, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          {
            validator: validatePhone,
            trigger: 'blur'
          }
        ],
        detail: [
          { required: true, message: '请输入详情', trigger: 'blur' }
        ]
      },
      editorOption: {},
      categoryList: [],
      isAddress: true,
      mapDialogVisible: false,
      zoom: 16,
      center: [114.01669, 33.580473],
      reqPosition: {
        click(e) {
          const { lng, lat } = e.lnglat
          self.lifeInfoForm.longitude = lng
          self.lifeInfoForm.latitude = lat
          self.mapDialogVisible = false
        }
      }
    }
  },
  created() {
    this.add_life = this.permissions['add_life']
    this.update_life = this.permissions['update_life']
    this.del_life = this.permissions['del_life']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
    this.getcategoryListObj()
  },
  components: { VDistpicker, quillEditor, Quill },
  methods: {
    /*
      @desc  自定义事件   获取描述详情

      @param  [String] desc 详情描述
    */

    changeDesc({ desc }) {
      this.lifeInfoForm = Object.assign({}, this.lifeInfoForm, { detail: desc })
    },

    /**
     * desc 获取列表
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
     * desc 获取服务类别
     */
    async getcategoryListObj() {

      try {
        const { data: { data: requireInfo } } = await getcategoryList()
        requireInfo.forEach(item => {
          delete item.bulidList
          this.categoryList.push(item)
        })
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
        const res = await addObj(this.lifeInfoForm)
        await filterError(res, 'notify', 1)
        this.formDialogVisible = false
        this.getList()
      }catch(err) { 
        console.log(err)
      }
    },

    /**
     * desc 触发编辑按钮
     */
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      Object.assign(this.lifeInfoForm, rows)
      this.formDialogVisible = true
    },

    /**
     * desc 更新数据
     */
    async handleUptForm(formName) {

      try {
        await this.$refs[formName].validate()
        const res = await putObj(this.lifeInfoForm)
        await filterError(res, 'notify', 2)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }

    },

    /**
     * desc 删除数据
     */
    async handleDel({ infoId }) {

      try {
        await this.$confirm('此操作将删除该条数据, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        const res = await delObj(infoId);
        await filterError(res, 'notify', 4)
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },
    onChangeProvince(data) {
      this.lifeInfoForm.province = data.value
    },
    onChangeCity(data) {
      this.lifeInfoForm.city = data.value
    },
    onChangeArea(data) {
      this.lifeInfoForm.area = data.value
    },
    resetForm() {
      this.lifeInfoForm = {
        name: undefined,
        categoryId: undefined,
        storeName: undefined,
        storeOwner: undefined,
        phone: undefined,
        businessHour: undefined,
        brief: undefined,
        major: undefined,
        policePhone: undefined,
        longitude: undefined,
        latitude: undefined,
        banner: undefined,
        detail: undefined
      }
    },

    /**
     * desc 查看详情
     */
    async handleDetail({ infoId }) {

      try {
        const res = ({data: { data: this.lifeInfoForm }} = await getSIngleObj(infoId))
        await filterError(res, 'notify')
        this.dialogStatus = 'detail'
        this.formDialogVisible = true
      }catch(err) {
        console.log(err)
      }
    },
    handleCategoryId() {
      this.categoryList.forEach(item => {
        if (this.lifeInfoForm.categoryId === item.categoryId) {
          if (item.type === '1') {
            this.isAddress = true
          } else if (item.type === '0') {
            this.isAddress = false
          }
        }
      })
    },

    handleOpenMapDialog() {
      this.mapDialogVisible = true
    },
    /**
     * desc 图片上传
     */
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        this.lifeInfoForm.banner = res.data
        this.$notify({
          title: '成功',
          message: '图片上传成功',
          type: 'success'
        })
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

