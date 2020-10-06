<template>
  <div>
    <h2 class="layout-pages-title">商品列表</h2>
    <div class="layout-pages-search">
      <el-input placeholder="请输入商品名称"
                size="small"
                class="search-btn"
                v-model="listQuery.goodsName"
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
                 v-if="add_goodslist"
                 @click="handleAdd">添加新商品</el-button>
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
                         label="商品名称">
          <template slot-scope="scope">
            <span>{{scope.row.goodsName}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center"
                         label="所属分类">
          <template slot-scope="scope">
            <span>{{scope.row.catName}}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center"
                         label="价格">
          <template slot-scope="scope">
            <span>{{scope.row.shopPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="库存">
          <template slot-scope="scope">
            <span>{{scope.row.goodsStock}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="销量">
          <template slot-scope="scope">
            <span>{{scope.row.saleNum}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="手机号">
          <template slot-scope="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="操作"
                         min-width="160px">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  @click="handleUpdate(scope.row)"
                  v-if="update_goodslist"
                  effect="plain">
              编辑
            </span>
            <span class="tag-opearte"
                  @click="handleDel(scope.row)"
                  v-if="del_goodslist"
                  effect="plain">
              删除
            </span>
            <span class="tag-opearte"
                  @click="handleDetail(scope.row)"
                  effect="plain">
              详情
            </span>
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
      <el-form :model="goodsForm"
               :rules="rules"
               ref="goodsForm"
               label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="商品名称"
                          prop="goodsName">
              <el-input v-model="goodsForm.goodsName"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="价格"
                          prop="shopPrice">
              <el-input v-model="goodsForm.shopPrice"
                        type="number"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品库存"
                          prop="goodsStock">
              <el-input v-model.number="goodsForm.goodsStock"
                        type="number"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号"
                          prop="phone">
              <el-input v-model="goodsForm.phone"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设置商品分类"
                          prop="goodsCat1">
              <el-select v-model="goodsForm.goodsCat1"
                         size="small"
                         :disabled="dialogStatus=== 'detail'"
                         placeholder="请选择商品分类">
                <el-option v-for="item in goodsList"
                           size="small"
                           :key="item.id"
                           :label="item.catName"
                           :value="item.catName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品图片"
                      prop="img">
          <el-upload action="/api/admin/goods/goodsImgUpload"
                     list-type="picture-card"
                     :file-list="goodsForm.img"
                     :on-success="handleAvatarSuccess"
                     :on-preview="handlePictureCardPreview"
                     :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="imgDialogVisible"
                     append-to-body>
            <img width="100%"
                 :src="dialogImageUrl"
                 alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品详情"
                      prop="goodsDesc">
          <!--  <el-upload
              v-show="false"
              class="avatar-uploader"
              :action="serverUrl"
              name="img"
              :show-file-list="false"
              :on-success="handSuccess"
              :on-error="handError"
              :before-upload="beforeUpload">
                <i class="el-icon-plus"></i>
            </el-upload>
          <quillEditor v-model="goodsForm.goodsDesc"
                       ref="myQuillEditor"
                       :options="editorOption"
                       :disabled="dialogStatus=== 'detail'">
          </quillEditor>
          -->
          <Quill 
            :dialogStatus="dialogStatus" 
            :parentDesc="goodsForm.goodsDesc" 
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
                   @click="handleSubmit('goodsForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('goodsForm')">更 新</el-button>
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
import { getListObj, addObj, putObj, delObj, getSingleObj, getgoodsList } from '@/api/goodslist'
import { validatePhone } from '@/api/validator'

// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{'header': 1}, {'header': 2}],               // custom button values
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
  [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
  [{'direction': 'rtl'}],                         // text direction

  [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
  [{'header': [1, 2, 3, 4, 5, 6, false]}],

  [{'color': []}, {'background': []}],          // dropdown with defaults from theme
  [{'font': []}],
  [{'align': []}],
  ['link', 'image'],
  ['clean']                                         // remove formatting button
];


export default {
  data() {
    return {
      add_goodslist: false,
      update_goodslist: false,
      del_goodslist: false,
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
      editorOption: {
        placeholder: '',
          theme: 'snow',  // or 'bubble'
          modules: {
            toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  if (value) {
                    document.querySelector('.avatar-uploader input').click();        
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            }
          }
      },
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      goodsForm: {
        goodsNum: undefined,
        goodsName: undefined,
        shopPrice: undefined,
        goodsStock: undefined,
        parentId: undefined,
        // goodsImg: [],
        img: [],
        goodsDesc: undefined,
        phone: undefined
      },
      rules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        shopPrice: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goodsStock: [
          { required: true, message: '请输入商品库存', trigger: 'blur' }
        ],
        goodsCat1: [
          { required: true, message: '请输入商品价格', trigger: 'change' }
        ],
        goodsDesc: [
          { required: true, message: '请输入商品详情', trigger: 'blur' }
        ],
        phone: [
          {
            validator: validatePhone, trigger: 'blur'
          }
        ]
      },
      goodsList: [],
      dialogImageUrl: '',
      imgDialogVisible: false,
      fileList: [],
      serverUrl: '/api/admin/goods/goodsImgUpload', // 图片上传地址
    }
  },
  created() {
    console.log('1', Quill)
    this.add_goodslist = this.permissions['add_goodslist']
    this.update_goodslist = this.permissions['update_goodslist']
    this.del_goodslist = this.permissions['del_goodslist']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  components: {
    quillEditor,
    Quill
  },
  mounted() {
    this.getList()
    this.handleGetGoodsList()
  },
  methods: {
    /*
      @desc  自定义事件   获取描述详情

      @param  [String] desc 详情描述
    */

    changeDesc({ desc }) {
      this.goodsForm = Object.assign({}, this.goodsForm, { goodsDesc: desc })
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
    handleGetGoodsList() {
      getgoodsList().then(res => {
        if (res.data.code === 0) {
          this.goodsList = res.data.data
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
      this.formDialogVisible = true
    },
    handleSubmit(formName) {
      this.goodsForm.img = []
      this.fileList.forEach(item => {
        this.goodsForm.img.push(item.id)
      })
      
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addObj(this.goodsForm).then(res => {
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
      this.dialogStatus = 'update'
      getSingleObj(rows.id).then(res => {
        if (res.data.code === 0) {
          this.goodsForm = res.data.data
          this.goodsForm.img = this.goodsForm.imgList
          this.fileList = this.goodsForm.imgList
          this.formDialogVisible = true
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
      this.formDialogVisible = true
    },
    handleUptForm(formName) {
      this.goodsForm.img = []
      this.fileList.forEach(item => {
        this.goodsForm.img.push(item.id)
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          putObj(this.goodsForm).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
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
    handleAvatarSuccess(res, file, fileList) {
      if (res.code === 0) {
        fileList[fileList.length - 1] = res.data
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success'
        })
        this.fileList = fileList
      } else {
        this.$notify({
          title: '失败',
          message: res.msg,
          type: 'error'
        })
      }
    },
    resetForm() {
      this.goodsForm = {
        goodsNum: undefined,
        goodsName: undefined,
        shopPrice: undefined,
        goodsStock: undefined,
        parentId: undefined,
        img: [],
        goodsDesc: undefined,
        phone: undefined
      }
    },
    handleDetail(rows) {
      getSingleObj(rows.id).then(res => {
        if (res.data.code === 0) {
          this.dialogStatus = 'detail'
          this.goodsForm = res.data.data
          this.goodsForm.img = res.data.data.imgList
          this.fileList = res.data.data.imgList
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
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.imgDialogVisible = true
    },

    // 商品详情上传--成功
    handSuccess(res, file) {
      
      let quill = this.$refs.myQuillEditor.quill

      const { data: { url } } = res;

      if (url) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        quill.insertEmbed(length, 'image', url)

        // 调整光标到最后
        quill.setSelection(length + 1)
      }

    },
    // 商品详情上传--失败
    handError(res, file) {
      console.log('上传失败')
    },

    // 商品详情上传--在什么前
    beforeUpload(res, file) {

    }
  }
}
</script>

<style lang="scss">
</style>