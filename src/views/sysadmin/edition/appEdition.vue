<template>
  <div>
    <!-- <h2 class="layout-pages-title">版本控制</h2> -->
    <div class="layout-pages-content">
        <p class="total-number">(共<span>{{ total }}</span>条数据)</p>
      <el-table :data="tableData"
                class="layout-pages-content-table"
                style="width: 100%">
        <el-table-column type="index"
                         width="50">
        </el-table-column>

        <el-table-column align="center"
                         label="版本号">
          <template slot-scope="scope">
            <span>{{scope.row.versionNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="类型">
          <template slot-scope="scope">
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>
      
        <el-table-column align="center"
                         label="更新时间">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="备注">
          <template slot-scope="scope">
            <span>{{scope.row.remark }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         width="200px"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  @click="handleUpdate(scope)"
                  effect="plain">
              编辑
            </span>
            <span class="tag-opearte"
                  @click="handleDetail(scope)"
                  effect="plain">
              详情
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑、详情、添加 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="formDialogVisible"
               width="60%">
      <el-form :model="drDoorphoneForm"
               :rules="rules"
               ref="drDoorphoneForm"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="版本号"
                          prop="versionNo">
              <el-input v-model="drDoorphoneForm.versionNo"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注"
                          prop="remark">
              <el-input v-model="drDoorphoneForm.remark"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="更新内容"
                          prop="msg">
              <el-input v-model="drDoorphoneForm.msg"
                        clearable
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="下载地址"
                          prop="downUrl">
              <el-input v-model="drDoorphoneForm.downUrl"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false"
                   v-if="dialogStatus=== 'create' || dialogStatus=== 'update'">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('drDoorphoneForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  
  </div>
</template>

<script>
/**
 * 表单验证规则
 */
const rules = {
  remark: [
    { required: true, message: '请输入备注', trigger: 'blur' }
  ],
  versionNo: [
    { required: true, message: '请输入版本号', trigger: 'blur' }
  ]
}

import { getListObj, putObj } from '@/api/appEdition'
export default {
  data() {
    return {
      update_drDoorphone: false,
      jh_dj_device: false,
      total: 0, // 
      tableData: [], // 门禁机列表
      exhibitionData: [], // 列表展示数据
      dialogStatus: 'detail', // 详情展示状态  detail update 
      formDialogVisible: false, // 详情页面隐藏
      textMap: {
        update: '更新',
        detail: '详情'
      },
      drDoorphoneForm: {}, // 详情展示数据
      rules // 表单验证规则
    }
  },
  created() {
    this.getList()
  },
  
  methods: {
      /**
       * desc 获取门禁机版本号列表
       */
    async getList() {

        try {
            ({ 
                data: { 
                  records: this.tableData, 
                  total:  this.total 
                } 
              } = await getListObj())
            
        }catch(err) {
            this.$notify({
                title: '失败',
                message: err,
                type: 'error'
            })
        }
    },
    
    /**
     * desc 列表展示数据
     */
    initExhibitionData({ apkName, versionName, versionNo, upgradeExplain, remark }) {
      
    },

    /**
     * desc 设置当前展示数据
     * @param [String] dialogStatus 展示状态
     */
    getExhibitionInfo({ dialogStatus, row }) {
      this.dialogStatus = dialogStatus
      this.drDoorphoneForm = Object.assign({}, row)
      this.formDialogVisible = true
    },

    /**
     * desc 获取详情
     */
    handleDetail({ $index, row }) {
      this.getExhibitionInfo({ dialogStatus: 'detail', row })
    },

    /**
     * desc 触发更新
     */
    handleUptForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return;
        }

        this.updateData()
      })
    },

    /**
     * desc 更新数据
     */
    async updateData() {
      try {
        let { drDoorphoneForm } = this;
        this.formDialogVisible = false

        let { id, remark, versionNo, msg, downUrl } = drDoorphoneForm

        let { data: { code } } = await putObj({ id, remark, versionNo, downUrl, msg })
        
        if (code === 0) {
          this.$notify({title: '成功', message: '编辑成功', type: 'success'})
          this.getList()
        }

      }catch(err) {
        this.$notify({ title: '失败', message: err, type: 'error'})
      }
    },

    /**
     * 编辑按钮
     */
    handleUpdate({ $index, row }) {
      this.getExhibitionInfo({ dialogStatus: 'update', row } )
      //this.activeIndex = $index;
    }
  }
}
</script>


