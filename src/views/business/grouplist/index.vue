<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="商品搜索：">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="店铺搜索：">
            <el-input style="width: 203px" v-model="listQuery.shopname" placeholder="店铺名称"></el-input>
          </el-form-item>
          <el-form-item  label="状态搜索：">
            <el-select style="width: 203px" v-model="listQuery.checkres" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="审核搜索：">
            <el-select style="width: 203px" v-model="listQuery.ischecked" placeholder="请选择">
              <el-option
                v-for="item in statusOptions1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="店铺头像" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.shopico"></template>
        </el-table-column>
        <el-table-column label="店铺名" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.shopname }}</template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.productName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="SKU库存" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)" circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="拼团人数" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.teamnum }}人团</template>
        </el-table-column>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">{{ scope.row.checkres == null ? '待审核': scope.row.checkres === 0 ? '已通过' : '未通过' }}</template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">{{ scope.row.remark }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <p style="margin-bottom: 10px;">
              <el-button
                size="mini"
                @click="handleShowProduct(scope.$index, scope.row)">查看
              </el-button>
              <el-button
                size="mini"
                @click="handleShowProduct(scope.$index, scope.row)">审核
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.page"
        :total="total">
      </el-pagination>
    </div>

    
    <el-dialog
      title="sku信息"
      :visible.sync="editSkuInfo.dialogVisible"
      width="50%">
      <span>商品货号：</span>
      <span>{{editSkuInfo.productSn}}</span>
      <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
      </el-input>
      <el-table style="width: 100%;margin-top: 20px"
                :data="editSkuInfo.stockList"
                border>
        <el-table-column
          label="SKU编号"
          align="center">
          <template slot-scope="scope">
            <el-input :disabled="editDisabled" v-model="scope.row.skuCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in editSkuInfo.productAttr"
          :label="item.name"
          :key="item.id"
          align="center">
          <template slot-scope="scope">
            {{getProductSkuSp(scope.row,index)}}
          </template>
        </el-table-column>
        <el-table-column
          label="销售价格"
          align="center">
          <template slot-scope="scope">
            <el-input :disabled="editDisabled" v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="商品库存"
          align="center">
          <template slot-scope="scope">
            <el-input :disabled="editDisabled" v-model="scope.row.stock"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="拼团价格"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-input :disabled="editDisabled" v-model="scope.row.promotionPrice"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSkuInfo.dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <div class="batch-operate-container">
      <el-select
        style="float:left;"
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px;float:left;"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>

    <el-dialog title="详情"
               :visible.sync="formDialogVisible">
      <el-form :model="goodsForm"
               ref="goodsForm"
               label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="商品名称"
                          prop="goodsName">
              <el-input v-model="goodsForm.productName"
                        clearable
                        :disabled="true"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品分类"
                          prop="goodsName">
              <el-input v-model="goodsForm.categoryName"
                        clearable
                        :disabled="true"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格"
                          prop="shopPrice">
              <el-input v-model="goodsForm.price"
                        type="number"
                        clearable
                        :disabled="true"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          
          
          <el-col :span="12">
            <el-form-item label="商品库存"
                          prop="goodsStock">
              <el-input v-model.number="goodsForm.stock"
                        type="number"
                        clearable
                        :disabled="true"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货号"
                          prop="phone">
              <el-input v-model="goodsForm.productSn"
                        clearable
                        :disabled="true"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品图片"
                      prop="img">
            <img style="width: 150px;height: 150px;"
                 :src="goodsForm.propic"
                 @click="changeDialogImageUrl(goodsForm.propic)"
                 alt="">
            <img style="width: 150px;height: 150px;"
                  v-for="(item, index) in initImageUrl(goodsForm.albumPics)"
                  :key="index"
                 :src="item"
                 @click="changeDialogImageUrl(item)"
                 alt="">
          <el-dialog :visible.sync="imgDialogVisible"
                     append-to-body>
            <img width="100%"
                 :src="dialogImageUrl"
                 alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品详情"
                      prop="goodsDesc">
          <quillEditor v-model="goodsForm.detailMobileHtml"
                       ref="myQuillEditor"
                       :options="editorOption"
                       :disabled="true">
          </quillEditor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <template v-if="goodsForm.checkres == null">
          <el-button
            type="success"
            @click="handleCheckre(0, goodsForm)">通过
          </el-button>
          <el-button
            type="info"
            @click="handleFailCheckre(0, goodsForm)">不通过
          </el-button>
        </template>
        <el-button type="primary" @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { getProductCateList, fetchProductAttrList, getSKUObj } from "@/api/business/goodslists"
import { fetchList, checkSuccessHandler, checkFailHandler } from "@/api/business/grouplist.js"
  const defaultListQuery = {
    name: null,
    shopname: null,
    checkres: null,
    ischecked: null,
    page: 1,
    limit: 10,
  };

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


import Quill from '@/components/quill'
  export default {
    name: "productList",
    data() {
      return {
        editSkuInfo:{
          dialogVisible:false,
          productId:null,
          productSn:'',
          productAttributeCategoryId:null,
          stockList:[],
          productAttr:[],
          keyword:null
        },
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
        statusOptions: [
          {
            label: '已通过',
            value: 0
          },
          {
            label: '未通过',
            value: 1
          }
        ],
        statusOptions1: [
          {
            label: '已审核',
            value: 0
          },
          {
            label: '待审核',
            value: 1
          }
        ],
        operateType: null,
        operates: [
          {
            label: "批量通过",
            value: "publishOn"
          }
        ],
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: [],
        productCateOptions: [],
        formDialogVisible: false, // 详情窗口是否显示
        editDisabled: true,
        goodsForm: {},
        imgDialogVisible: false,
        dialogImageUrl: ''
      }
    },
    components: {
      quillEditor
    },
    created() {
      this.getList();
      this.getBrandList();
      this.getProductCateList();
    },
    methods: {
      getProductSkuSp(row, index) {
        if (index === 0) {
          return row.sp1;
        } else if (index === 1) {
          return row.sp2;
        } else {
          return row.sp3;
        }
      },
      async getList() {
        this.listLoading = true;
        try {
            let { data: { data: { records: list, total } } } = await fetchList(this.listQuery);
            this.list = list;
            this.total = total;
            this.listLoading = false;
        }catch(err) {
            this.listLoading = false;
            console.log(err)
        }
      },

      /**
       * desc 获取分类列表
       */
      async getProductCateList() {

        try {
          const { data: { data: list } } = await getProductCateList();
          this.productCateOptions = [];
           for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].children != null && list[i].children.length > 0) {
              for (let j = 0; j < list[i].children.length; j++) {
                children.push({label: list[i].children[j].name, value: list[i].children[j].id});
              }
            }
            this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children});
          }
        }catch(err) {
          console.log(err)
        }
      },

      /**
       * desc 搜索列表
       */
      handleSearchList() {
        this.listQuery.page = 1;
        this.getList();
      },

      handleSizeChange(val) {
        this.listQuery.page = 1;
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      handleShowSkuEditDialog(index,row){
        this.editSkuInfo.dialogVisible=true;
        this.editSkuInfo.productId=row.productId;
        this.editSkuInfo.productSn=row.productSn;
        this.editSkuInfo.productAttributeCategoryId = row.productAttributeCategoryId;
        this.editSkuInfo.keyword=null;
        getSKUObj(row.productId,{keyword:this.editSkuInfo.keyword}).then(response=>{
          this.editSkuInfo.stockList=response.data.data;
        });

        if (row.productAttributeCategoryId == null) {
          return;
        }
        fetchProductAttrList(row.productAttributeCategoryId,{type:0}).then(response=>{
          this.editSkuInfo.productAttr=response.data.data.list;
        });
      },
      handleSearchEditSku(){
        getSKUObj(this.editSkuInfo.productId,{keyword:this.editSkuInfo.keyword}).then(response=>{
          this.editSkuInfo.stockList=response.data.data;
        });
      },
 
      /**
       * desc 重置搜索条件
       */
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },

      /**
       * desc 查看详情
       */
      handleShowProduct(index,row){
        
        this.formDialogVisible = true;
        let categoryName = ''

        this.productCateOptions.forEach(item => {
  
          if (item.value == row.besId) {
            categoryName = item.label
          }
        })

        this.goodsForm = Object.assign({},row, { categoryName: categoryName ? `${categoryName}/${row.productCategoryName}`: row.productCategoryName })
      },

      /**
       * @desc  点击图片放大
       */
      changeDialogImageUrl(pic) {
        this.imgDialogVisible = true;
        this.dialogImageUrl = pic
      },

      /**
       * desc 审核
       */
      async handleCheckre(index, row) {

        try {
          await checkSuccessHandler({ ids: [row.id] })
          this.formDialogVisible = false
          this.getList()
        }catch(err) { 
          console.log(err)
        }
      },

      /**
       * desc 审核失败
       */
      async handleFailCheckre(index, row) {
        try {
          let remark;
           ({ value: remark } = await this.$prompt(status === '3' ? '请输入关闭原因' :'请输入拒绝原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }))
          const res = await checkFailHandler({ id: row.id, remark })
          this.formDialogVisible = false
          this.getList()
        }catch(err) { 
          console.log(err)
        }
      },

      handleBatchOperate() {
        if(this.operateType==null){
          this.$message({
            message: '请选择操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if(this.multipleSelection == null || this.multipleSelection.length < 1){
          this.$message({
            message: '请选择要操作的商品',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.$confirm('是否要进行该批量操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          try {
            let ids=[];
            for(let i=0;i<this.multipleSelection.length;i++){

              if (this.multipleSelection[i].checkres == null) {
                ids.push(this.multipleSelection[i].id);
              }
            }

            if (ids.length === 0) {
              return;
            }
            
            await checkSuccessHandler({ ids })
            this.getList()
          }catch(err) {
            console.log(err)
          }
        });
      },

      /**
       * desc 初始化图片
       */
      initImageUrl(imgString) {
        if (typeof imgString === 'string') {
          let imgs = imgString.split(',')
          if (imgs.length) {
            return imgs
          } else {
            return []
          }
        } else {
          return [];
        }
      }
    }
  }
</script>
<style></style>


