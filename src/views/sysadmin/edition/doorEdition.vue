<template>
  <div>
    <!-- <h2 class="layout-pages-title">版本控制</h2> -->
    <div class="layout-pages-content">
        <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <el-table :data="tableData"
                class="layout-pages-content-table"
                style="width: 100%">
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="apk名称">
          <template slot-scope="scope">
            <span>{{scope.row.apkName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="版本名称">
          <template slot-scope="scope">
            <span>{{scope.row.versionName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="版本号">
          <template slot-scope="scope">
            <span>{{scope.row.versionNo}}</span>
          </template>
        </el-table-column>
      
        <el-table-column align="center"
                         label="升级原因">
          <template slot-scope="scope">
            <span>{{scope.row.upgradeExplain }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="备注">
          <template slot-scope="scope">
            <span>{{scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '0'">
              <el-tag type="info">已禁用</el-tag>
            </span>
            <span v-if="scope.row.status === '1'">
              <el-tag type="info">已启用</el-tag>
            </span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         width="300px"
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
            <span class="tag-opearte"
                  @click="handleBindUser(scope)"
                  effect="plain">
              启用/禁用
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
            <el-form-item label="版本Id"
                          prop="versionId">
              <el-input v-model="drDoorphoneForm.versionId"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="版本名称"
                          prop="versionName">
              <el-input v-model="drDoorphoneForm.versionName"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
            <el-form-item label="版本类型"
                          prop="versionType">
              <el-input v-model="drDoorphoneForm.versionType"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="apk名称"
                          prop="apkName">
              <el-input v-model="drDoorphoneForm.apkName"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="app类型"
                          prop="appType">
              <el-input v-model="drDoorphoneForm.appType"
                        clearable
                        size="small"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="升级原因"
                          prop="upgradeExplain">
              <el-input v-model="drDoorphoneForm.upgradeExplain"
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
          <el-col :span="18">
            <el-form-item label="下载地址"
                          clearable
                          size="small"
                          prop="downUrl">
              <el-input v-model="drDoorphoneForm.downUrl"
                        :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择设备"
                          prop="accountId">
              <el-select v-model="drDoorphoneForm.flag"
                         size="small"
                         :disabled="dialogStatus=== 'detail'">
                <el-option v-for="item in equipmentList"
                           size="small"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="drDoorphoneForm.flag == 'one'">
          <el-col :span="12">
            <el-form-item label="设备Id"
                          clearable
                          size="small"
                          prop="serialId">
              <el-input v-model="drDoorphoneForm.serialId"
                :disabled="dialogStatus=== 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="强制更新"
                          prop="faceStatus">
              <el-radio-group v-model="drDoorphoneForm.versionForce"
                              :disabled="dialogStatus=== 'detail'">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
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
    
    <el-dialog title="门禁机设备app程序下发"
               width="30%"
               @closed="console.log(222)"
               :visible.sync="editDeviceStatus">
               
      <el-form :model="newTipsData"
               :rules="rules"
               ref="editDeviceForm"
               label-width="100px">
        <el-form-item label="是否开启"
                      prop="status">
          <el-switch v-model="newTipsData.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            active-text="启用"
            inactive-text="禁用">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
          @click="handleEditDevice('editDeviceForm')">更 新</el-button>
        <el-button type="primary"
          @click="editDeviceStatus = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="TipsdialogVisible"
      width="30%">
      <span>确定{{tipTextMap[newTipsData.status]}}该设备更新apk程序吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="TipsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 表单验证规则
 */
const rules = {
  versionId: [
    { required: true, message: '请输入版本Id', trigger: 'blur' }
  ],
  versionName: [
    { required: true, message: '请输入版本名称', trigger: 'blur' }
  ],
  versionNo: [
    { required: true, message: '请输入版本号', trigger: 'blur' }
  ],
  apkName: [
    { required: true, message: '请输入apk名称', trigger: 'blur' }
  ],
  upgradeExplain: [
    { required: true, message: '请输入升级原因', trigger: 'blur' }
  ],
  remark: [
    { required: true, message: '请输入备注', trigger: 'blur' }
  ],
  downUrl: [
    { required: true, message: '请输入下载地址', trigger: 'blur' }
  ],
  serialId: [
    { required: true, message: '请输入设备ID', trigger: 'blur' }
  ] 
}

import { getListObj, putObj, updateStatus } from '@/api/doorEdition'
export default {
  data() {
    return {
      update_drDoorphone: false,
      jh_dj_device: false,
      //activeIndex: 0, // 当前点击索引
      total: 0, // 
      tableData: [], // 门禁机列表
      exhibitionData: [], // 列表展示数据
      listQuery: {}, // 版本号列表请求数据
      dialogStatus: 'detail', // 详情展示状态  detail update 
      formDialogVisible: false, // 详情页面隐藏
      TipsdialogVisible: false, // 提示页面隐藏
      editDeviceStatus: false, // 启用/禁用切换
      newTipsData: {}, // 启用关闭数据
      tipsData: {}, // 启用关闭数据
      tipTextMap: {
        0: '禁用',
        1: '启用'
      },
      textMap: {
        update: '更新',
        detail: '详情'
      },
      equipmentList: [{ label: '全部', value: 'all' }, { label: '单个', value: 'one' }], 
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
      console.log('dialogStatus', dialogStatus)
      this.dialogStatus = dialogStatus
      this.drDoorphoneForm = Object.assign({}, row)
      this.formDialogVisible = true
    },

    /**
     * desc 获取详情
     */
    handleDetail({ $index, row }) {
      this.getExhibitionInfo({ dialogStatus: 'detail', row })
      //this.activeIndex = $index;
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

        let newDrRoorphoneForm = JSON.parse(JSON.stringify(drDoorphoneForm))
        delete newDrRoorphoneForm.status
        let { data: { code } } = await putObj(newDrRoorphoneForm)
        
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
    },

    /**
     * 
     * desc 设备更新按钮
     */
    handleEditDevice(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return;
        }

        const { tipsData, newTipsData } = this;

        if (tipsData.status == newTipsData.status) {
          this.$notify({title: '成功', message: '更新成功', type: 'success'})
        } else {
          this.TipsdialogVisible = true
        }

        this.editDeviceStatus = false;
      })
    },

    /**
     * desc 更新启用/禁用数据
     */
    async updateStatus() {
      try {
        this.TipsdialogVisible = false
        const { newTipsData: { status, id } } = this;
        let { data: { code } } = await updateStatus({ status, id });

        if (code === 0) {
          this.$notify({title: '成功', message: '更新成功', type: 'success'})
          this.getList()
        }
        
      }catch(err) {
        console.log(err)
        this.$notify({ title: '失败', message: err, type: 'error'})
      }
    },

    /**
     * 触发启用/禁用按钮
     */
    handleBindUser({ $index, row }) {
      this.editDeviceStatus = true
      this.newTipsData = JSON.parse(JSON.stringify(row));
      this.tipsData = row
    }
  }
}
</script>


