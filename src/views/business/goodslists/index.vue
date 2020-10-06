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
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              clearable
              v-model="selectProductCateValue"
              :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.verifyStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="审核状态：">
            <el-select v-model="listQuery.verifyStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in verifyStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
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
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.pic"></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="180" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.price}}</p>
            <p>货号：{{scope.row.productSn}}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="150" align="center">
          <template slot-scope="scope">
            <p>上架：
              <el-switch
                @change="handlePublishStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.verifyStatus">
              </el-switch>
            </p>
            <p>推荐：
              <el-switch
                @change="handleRecommendStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.recommandStatus">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="积分率" width="100" align="center">
          <template slot-scope="scope">{{scope.row.giftPoint}}%</template>
        </el-table-column>
        <!-- <el-table-column label="库存量" width="150" align="center">
            <template slot-scope="scope">{{scope.row.stock}}</template>
        </el-table-column> -->
        <el-table-column label="SKU库存" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)" circle></el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="销量" width="150" align="center">
          <template slot-scope="scope">{{scope.row.sale}}</template>
        </el-table-column> -->
        <el-table-column label="操作" width="260" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleShowProduct(scope.$index, scope.row)">查看
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleSet(scope.$index, scope.row)">设置积分率
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
          label="库存预警值"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-input :disabled="editDisabled" v-model="scope.row.lowStock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSkuInfo.dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="详情"
               :visible.sync="formDialogVisible">
      <el-form :model="goodsForm"
               ref="goodsForm"
               label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="商品名称"
                          prop="goodsName">
              <el-input v-model="goodsForm.name"
                        clearable
                        :disabled="true"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="品牌"
                          prop="goodsName">
              <el-input v-model="goodsForm.brandName"
                        clearable
                        :disabled="true"
                        size="small"></el-input>
            </el-form-item>
          </el-col> -->
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
                 :src="goodsForm.pic"
                 @click="changeDialogImageUrl(goodsForm.pic)"
                 alt="">
            <img style="width: 
            
            150px;height: 150px;"
                  v-for="(item, index)
                   in initImageUrl(goodsForm.albumPics)"
                  :key="index"
                 :src="item"
                 @click="changeDialogImageUrl(item)"
                 alt="">
          <el-dialog :visible.sync="imgDialogVisible"
                     append-to-
                     >
            <img width="100%"
                 :src="dialogImageUrl"
                 alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品详情"
                      prop="goodsDesc">
          <!-- <Quill 
            :parentDesc="goodsForm.detailMobileHtml" 
          >
          </Quill> -->
          <quillEditor v-model="goodsForm.detailMobileHtml"
                       ref="myQuillEditor"
                       :options="editorOption"
                       :disabled="true">
          </quillEditor>
          <!-- <div style="overflow:hidden" v-html="goodsForm.detailMobileHtml"></div> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
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

import { 
  getListObj, 
  getBrandObj, 
  getProductCateList, 
  getSKUObj, 
  fetchProductAttrList, 
  updatePublishStatus, 
  updateDeleteStatus, 
  updateRecommendStatus,
  updateJFrate 
} from "@/api/business/goodslists.js"
  const defaultListQuery = {
    keyword: null,
    page: 1,
    limit: 10,
    publishStatus: null,
    verifyStatus: null,
    productSn: null,
    productCategoryId: null,
    brandId: null
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
        rate: 0,
        operates: [
          {
            label: "商品上架",
            value: "publishOn"
          },
          {
            label: "商品下架",
            value: "publishOff"
          },
          {
            label: "设为推荐",
            value: "recommendOn"
          },
          {
            label: "取消推荐",
            value: "recommendOff"
          },
          {
            label: "转移到分类",
            value: "transferCategory"
          },
          {
            label: "移入回收站",
            value: "recycle"
          }
        ],
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
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        selectProductCateValue: null,
        multipleSelection: [],
        productCateOptions: [],
        brandOptions: [],
        formDialogVisible: false, // 详情窗口是否显示
        editDisabled: true,
        goodsForm: {},
        imgDialogVisible: false,
        dialogImageUrl: '',
        publishStatusOptions: [{
          value: 1,
          label: '上架'
        }, {
          value: 0,
          label: '下架'
        }],
        verifyStatusOptions: [{
          value: 1,
          label: '审核通过'
        }, {
          value: 0,
          label: '未审核'
        }]
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
    watch: {
      selectProductCateValue: function (newValue) {
        if (newValue != null && newValue.length == 2) {
          this.listQuery.productCategoryId = newValue[1];
        } else {
          this.listQuery.productCategoryId = null;
        }

      }
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
            let { data: { data: { list, total } } } = await getListObj(this.listQuery);
            this.list = list;
            this.total = total;
            this.listLoading = false;
        }catch(err) {
            this.listLoading = false;
            console.log(err)
        }
      },
      /**
       * desc 获取品牌列表
       */
      async getBrandList() {
        
        try {
          let { data: { data: { list } } } = await getBrandObj()
          this.brandOptions = [];
          for (let i = 0; i < list.length; i++) {
            this.brandOptions.push({label: list[i].name, value: list[i].id});
          }
          
        }catch(err) {
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
      handleBatchOperate() {
        if(this.operateType==null){
          this.$message({
            message: '请选择操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if(this.multipleSelection==null||this.multipleSelection.length<1){
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
        }).then(() => {
          let ids=[];
          for(let i=0;i<this.multipleSelection.length;i++){
            ids.push(this.multipleSelection[i].id);
          }
          switch (this.operateType) {
            case this.operates[0].value:
              this.updatePublishStatus(1,ids);
              break;
            case this.operates[1].value:
              this.updatePublishStatus(0,ids);
              break;
            case this.operates[2].value:
              this.updateRecommendStatus(1,ids);
              break;
            case this.operates[3].value:
              this.updateRecommendStatus(0,ids);
              break;
            case this.operates[4].value:
              break;
            case this.operates[5].value:
              this.updateDeleteStatus(1,ids);
              break;
            default:
              break;
          }
        });
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
      handlePublishStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        
        this.updatePublishStatus(row.verifyStatus, ids);
      },
      handleRecommendStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updateRecommendStatus(row.recommandStatus, ids);
      },

      handleShowSkuEditDialog(index,row){
        this.editSkuInfo.dialogVisible=true;
        this.editSkuInfo.productId=row.id;
        this.editSkuInfo.productSn=row.productSn;
        this.editSkuInfo.productAttributeCategoryId = row.productAttributeCategoryId;
        this.editSkuInfo.keyword=null;
        getSKUObj(row.id,{keyword:this.editSkuInfo.keyword}).then(response=>{
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
        this.selectProductCateValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleDelete(index, row){
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.id);
          this.updateDeleteStatus(1,ids);
        });
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
      updatePublishStatus(publishStatus, ids) {
        // let params = new URLSearchParams();
        // params.append('ids', ids);
        // params.append('publishStatus', publishStatus);
        
        updatePublishStatus({ ids, operate: publishStatus }).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          this.getList();
        });
      },
      updateRecommendStatus(recommendStatus, ids) {
        // let params = new URLSearchParams();
        // params.append('ids', ids);
        // params.append('recommendStatus', recommendStatus);
        updateRecommendStatus({ ids, operate: recommendStatus }).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          this.getList();
        });
      },

      /**
       * @desc  点击图片放大
       */
      changeDialogImageUrl(pic) {
        this.imgDialogVisible = true;
        this.dialogImageUrl = pic
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
      },

      /**
       * desc 设置积分率
       */
      async handleSet(index, { id, giftPoint }) {
        console.log(giftPoint, 'giftPoint')
        this.rate = giftPoint
        try {
          const { value } = await this.$prompt('请输入积分率(0-100之间的整数)', '提示', {  
            confirmButtonText: '确定',  
            cancelButtonText: '取消', 
            inputPlaceholder: this.rate,
            inputPattern: /^(0|[0-9][0-9]?|100)$/,
            inputErrorMessage: '请输入大于0且小于100数字' 
          })
          
          if (value != undefined) {
            this.rate = value;
          }
          
          const res = await updateJFrate({ productId: id, rate: this.rate })
          this.getList();
          
        }catch(err) {
          console.log(err)
        }
      },
      updateDeleteStatus(deleteStatus, ids) {
        // let params = new URLSearchParams();
        // params.append('ids', ids);
        // params.append('deleteStatus', deleteStatus);

        updateDeleteStatus({ ids, operate: deleteStatus }).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
          this.getList();
        });
      }
    }
  }
</script>
<style></style>


