<template>
  <div>
    <h2 class="layout-pages-title">商户审核</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select v-model="filter.title"
                     size="small"
                     placeholder="请选择服务">
            <el-option v-for="item in villageOptions"
                       size="small"
                       :key="item.value"
                       :label="item.title"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3"
                :offset="1">
          <el-input placeholder="请输入要查找的值"
                    size="small"
                    class="search-btn"
                    v-model="filter.value"
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
      <p class="total-number">(共<span>{{ total }}</span>条数据)</p>
      <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 @click="batchAuditHandler">批量审核</el-button>
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
                         label="店铺头像">
          <template slot-scope="scope">
            <img :src="scope.row.shopico"
                 @click="changePhotoSrc(scope.row.shopico)"
                 class="table-img"
                 alt=""
                 srcset="">
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="店铺名称">
          <template slot-scope="scope">
            <span>{{ scope.row.shopname }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="联系人姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.realName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="联系电话">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="联系地址">
          <template slot-scope="scope">
            <span>{{ addressProcess(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.realName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="身份证号码">
          <template slot-scope="scope">
            <span>{{scope.row.idno}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="身份证正面">
          <template slot-scope="scope">
            <img :src="scope.row.idfront"
                 @click="changePhotoSrc(scope.row.idfront)"
                 class="table-img"
                 alt=""
                 srcset="">
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="身份证反面">
          <template slot-scope="scope">
            <img :src="scope.row.idback"
                 @click="changePhotoSrc(scope.row.idback)"
                 class="table-img"
                 alt=""
                 srcset="">
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="操作"
                         min-width="120px">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  @click="singleAuditHandler(scope.row)">审核</span>
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

    <el-dialog
      :visible.sync="dialogVisible"
      title="商家详情"
      width="50%"
      class="el-dialog1"
      center
      :before-close="handleClose">
      <el-tabs type="border-card">
        <el-tab-pane label="店铺信息">
          <el-row class="s-row">
            <el-col type="flex" class="s-col s-col-imgwrap">
              店铺头像: 
              <img :src="auditData.shopico"
                 class="table-img s-col-img"
                 alt=""
                 srcset="">
              <!-- <el-avatar shape="square" src="http://img3.duitang.com/uploads/item/201507/23/20150723115018_ma428.thumb.700_0.jpeg"></el-avatar> -->
            </el-col>
            <el-col class="s-col">店铺名: {{ auditData.shopname }}</el-col>
            <el-col class="s-col">店铺地址: {{ addressProcess(auditData) }}</el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="联系人信息">
          <el-row class="s-row">
            <el-col class="s-col">用户: {{ auditData.nickName }}</el-col>
            <el-col class="s-col">电话: {{ auditData.phone }}</el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="证件人信息">
          <el-row class="s-row">
            <el-col class="s-col">姓名: {{ auditData.realName }}</el-col>
            <el-col class="s-col">身份证号: {{ auditData.idno }}</el-col>
            <el-col type="flex" class="s-col s-col-sfzimgwrap">
              <img :src="auditData.idfront"
                 @click="changePhotoSrc(auditData.idfront)"
                 class="table-img s-col-sfzimg"
                 alt=""
                 srcset="">
              <img :src="auditData.idback"
                  @click="changePhotoSrc(auditData.idback)"
                 class="table-img s-col-sfzimg"
                 alt=""
                 srcset="">
              <!-- <el-avatar shape="square" src="http://img3.duitang.com/uploads/item/201507/23/20150723115018_ma428.thumb.700_0.jpeg"></el-avatar> -->
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-row type="flex" justify="end" class="s-btns">
        <el-col :span="4"><el-button @click="auditHandler('1')" type="success">审核成功</el-button></el-col>
        <el-col :span="4"><el-button @click="auditHandler('2')" type="warning">审核失败</el-button></el-col>
        <el-col :span="4"><el-button @click="auditHandler('3')" type="danger">关闭商家</el-button></el-col>
      </el-row>
    </el-dialog>

    <el-dialog :visible.sync="photoShowDialog"
               width="30%">
      <img :src="photoSrc"
           style="max-width:100%">
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="photoShowDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getListObj, checkbes } from '@/api/business/examine'
export default {
  data() {
    return {
      listLoading: false, // 加载动画
      total: 0, // 总数据
      tableData: [], // 数据列表
      listQuery: { // 获取列表参数
        page: 1,
        limit: 20,
        name: undefined
      },
      filter: { // 筛选条件
        title: '',
        value: ''
      },
      villageOptions: [
        {
          title: '手机号',
          value: 'phone'
        },
        {
          title: '店铺名',
          value: 'shopname'
        }
      ], // 查询条件
      selectionData: [], // 已选择数据
      auditData: {}, // 审核数据
      selectionQuery: {// 批量审核参数
        operate: '2',
        ids: []
      },
      dialogVisible: false, // 弹窗显示
      photoShowDialog: false, // 是否显示图片
      photoSrc: '', // 图片路径
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * desc 获取数据
     */
    async getList() {
      this.listLoading = true
      
      try {
        const { data: { 
          code, 
          data: {
            total, 
            records
          } 
        } } = await getListObj(this.listQuery)
        this.listLoading = false

        if (code === 0) {
          this.total = total;
          this.tableData = records;
        } else {
          this.$notify({ title: '失败', message: err, type: 'error' })
        }
      }catch(err) {
        console.log(err)
        this.listLoading = false
      }
    },

    /**
     * desc 更改大图图片路径
     */
    changePhotoSrc(str) {
      this.photoSrc = str;
      this.photoShowDialog = true;
    },

    /**
     * desc 拼接地址
     */
    addressProcess({ province, city, area, detailaddr }) {
      return province + city + area + detailaddr
    },

    /**
     * desc 批量审核
     */
    async batchAuditHandler() {

      try {
        this.setOperate('1')
        const { selectionQuery } = this;
        let { data: { code } } = await checkbes(selectionQuery);
        
        if (code === 0) {
          this.$notify({ title: '成功', message: '审核完成', type: 'success' })
          this.getList();
        } 
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 设置operate
     */
    setOperate(status) {
      this.selectionQuery = Object.assign({}, this.selectionQuery, { operate: status })
    },

    /**
     * desc  选择
     */
    handleSelectionChange(ev) {
      this.selectionData = ev
      this.changeSelectionQuery(ev);
    },

    /**
     * desc 更改批量审核参数
     */
    changeSelectionQuery(list) {
      const { selectionQuery } = this;
      const ids = list.map(item => item.besId)
      this.selectionQuery = Object.assign({}, selectionQuery, { ids })
    },

    /**
     * desc 单个审核
     */
    singleAuditHandler(row) {
      this.auditData = row;
      this.dialogVisible = true;
    },

    /**
     * desc 审核成功 失败 关闭
     */
    async auditHandler(status) {
      this.dialogVisible = false;
      try {
        this.setOperate(status)
        let remark = '';
        if (status != '1') {
          ({ value: remark } = await this.$prompt(status === '3' ? '请输入关闭原因' :'请输入拒绝原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }))
        }

        this.changeSelectionQuery([this.auditData])
        const { selectionQuery } = this;
        const { data: { code } } = await checkbes(remark ? Object.assign({}, selectionQuery, { remark }): selectionQuery)

        if (code === 0) {
          this.$notify({ title: '成功', message: '审核完成', type: 'success' })
          this.getList();
        } 
        
      }catch(err) {
        console.log(11, err)
      }
    },

    /**
     * desc 搜索
     */
    handleFilter() {
      const { filter: { title, value }, villageOptions } = this;
      villageOptions.forEach(item => delete this.listQuery[item.value])
      this.listQuery[title] = value
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

    handleClose() {
      this.dialogVisible = false;
    }
  }
}
</script>

<style lang="scss" scoped>
// .el-dialog1 .el-dialog__header {
//   padding: 0;
// }

.el-dialog1 .el-dialog__body {
  padding: 0 2px;
}

.s-box, .s-row {
  height: 200px;
}

.s-col {
  height: 40px;
  line-height: 40px;
  vertical-align: middle
}

.s-btns {
  padding: 20px 0;
}

.s-col-imgwrap {
  margin-bottom: 10px;
}

.s-col-img {
  width: 40px;
  height:40px;
  padding: 0;
  margin-left: 10px;
}


.s-col-sfzimg {
  padding: 0;
  margin-left: 10px;
  width: 85px;
  height: 54px;
  margin-right: 15px;
}
</style>

