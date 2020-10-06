<template>
  <div>
    <div class="layout-pages-search">
      <el-input placeholder="请输入广告名"
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
                 v-if="add_advertise"
                 @click="handleAdd">添加广告</el-button>
      <!-- <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 v-if="del_advertise"
                 @click="handleDel">删除</el-button> -->
      <el-table :data="tableData"
                class="layout-pages-content-table"
                v-loading="listLoading"
                style="width: 100%">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="广告位置">
          <template slot-scope="scope">
            <span v-if="scope.row.place === '0'">
              <el-tag>APP</el-tag>
            </span>
            <span v-if="scope.row.place === '1'">
              <el-tag>门口机</el-tag>
            </span>
            <span v-if="scope.row.place === '2'">
              <el-tag>AI识别机</el-tag>
            </span>
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
                         label="广告状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '0'">
              <el-tag type="success">正常</el-tag>
            </span>
            <span v-if="scope.row.status === '1'">
              <el-tag type="danger">删除</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="失效时间">
          <template slot-scope="scope">
            <span>{{scope.row.activeTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理"
                         width="260px">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="update_advertise"
                  @click="handleUpdate(scope.row)">编辑</span>
            <span class="tag-opearte"
                  v-if="del_advertise"
                  @click="handleDel(scope.row)">删除</span>
            <span class="tag-opearte"
                  @click='handleDetail(scope.row)'>详情</span>
            <span class="tag-opearte"
                  @click='handlePublish(scope.row)'>发布</span>
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
               :visible.sync="formDialogVisible"
               width="80%">
      <el-form :model="advertiseForm"
               :rules="rules"
               ref="advertiseForm"
               label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="广告名称"
                          prop="name">
              <el-input v-model="advertiseForm.name"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="广告位置"
                          prop="name">
              <el-radio-group v-model="advertiseForm.place"
                              :disabled="dialogStatus=== 'detail'">
                <el-radio :label="0">APP</el-radio>
                <el-radio :label="1">门口机</el-radio>
                <el-radio :label="2">AI识别机</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="失效时间"
                          prop="activeTime">
              <el-date-picker v-model="advertiseForm.activeTime"
                              type="datetime"
                              clearable
                              value-format='yyyy-MM-dd HH:mm:ss'
                              format='yyyy-MM-dd HH:mm:ss'
                              :disabled="dialogStatus=== 'detail'"
                              placeholder="选择日期时间"
                              size="small">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="广告描述"
                          prop="describe">
              <el-input v-model="advertiseForm.describe"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-transfer v-model="ces"
                     :data="advDoorList"></el-transfer> -->
        <el-row class="advFlex">
          <el-col :span="9">
            <el-table :data="advDoorList"
                      class="layout-pages-content-table"
                      ref="multipleTable"
                      @selection-change="handleSelectionChange"
                      style="width: 100%">
              <el-table-column type="selection"
                               width="55">
              </el-table-column>
              <el-table-column align="center"
                               label="素材名称">
                <template slot-scope="scope">
                  <span>{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center"
                               label="素材内容">
                <template slot-scope="scope">
                  <img :src="scope.row.path"
                       class="table-img"
                       v-if="scope.row.type==='0'"
                       @click="handleImgShow(scope.row.path)"
                       srcset="">
                  <video width="160"
                         height="100"
                         v-if="scope.row.type==='1'"
                         :src="scope.row.path"
                         controls="controls">您的浏览器不支持视频播放</video>
                </template>
              </el-table-column>
            </el-table>
            <div class="layout-pages-pagination">
              <el-pagination @current-change="handleadvDoorCurrentChange"
                             :current-page.sync="advDoorlistQuery.page"
                             :page-sizes="[5]"
                             :page-size="advDoorlistQuery.limit"
                             layout="sizes,total, prev, pager, next, jumper"
                             :total="advDoorTotal">
              </el-pagination>
            </div>
          </el-col>
          <el-col :span="6"
                  style='text-align: center;'>
            <div class="middle-advertise">
              <el-tooltip class="item"
                          effect="dark"
                          content="添加选中的广告素材"
                          placement="bottom">
                <i class="el-icon-d-arrow-right right-icon"
                   @click="handleAdvDoorData"></i>
              </el-tooltip>
              <div>
                <img :src="imgPicture"
                     class="dialog-pic"
                     v-if="imgPicture"
                     alt=""
                     srcset="">
              </div>
            </div>
          </el-col>
          <el-col :span="9">
            <el-table :data="advList"
                      class="layout-pages-content-table"
                      style="width: 100%">
              <el-table-column align="center"
                               label="素材名称">
                <template slot-scope="scope">
                  <span>{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center"
                               label="素材内容">
                <template slot-scope="scope">
                  <img :src="scope.row.path"
                       class="table-img"
                       v-if="scope.row.type==='0'"
                       @click="handleImgShow(scope.row.path)"
                       srcset="">
                  <video width="160"
                         height="100"
                         v-if="scope.row.type==='1'"
                         :src="scope.row.path"
                         controls="controls">您的浏览器不支持视频播放</video>
                </template>
              </el-table-column>
              <el-table-column align="center"
                               label="操作">
                <template slot-scope="scope">
                  <el-button size="mini"
                             type="danger"
                             @click="handleDelAdvList(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false"
                   v-if="dialogStatus=== 'create' || dialogStatus=== 'update'">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'create'"
                   @click="handleSubmit('advertiseForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('advertiseForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="投放广告"
               :visible.sync="publishDialogVisible"
               width="80%">
      <el-row class="advFlex">
        <el-col :span="9">
          <el-select v-model="devicelistQuery.quartersId"
                     size="small"
                     @change="handleDeviceFilter"
                     placeholder="请选择小区">
            <el-option v-for="item in villageList"
                       size="small"
                       :key="item.quartersId"
                       :label="item.name"
                       :value="item.quartersId">
            </el-option>
          </el-select>
          <el-table :data="deviceList"
                    class="layout-pages-content-table"
                    ref="multipleDeviceTable"
                    @selection-change="handleDeviceSelectionChange"
                    style="width: 100%">
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column type="index"
                             width="50">
            </el-table-column>
            <el-table-column align="center"
                             label="名称">
              <template slot-scope="scope">
                <span>{{scope.row.doorphoneName}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6"
                style='text-align: center;'>
          <div class="middle-advertise">
            <el-tooltip class="item"
                        effect="dark"
                        content="添加要投放的小区"
                        placement="bottom">
              <i class="el-icon-d-arrow-right right-icon"
                 @click="handleAddPublicVillage"></i>
            </el-tooltip>
          </div>
        </el-col>
        <el-col :span="9">
          <el-table :data="publishDeviceList"
                    class="layout-pages-content-table"
                    style="width: 100%">
            <el-table-column type="index"
                             width="50">
            </el-table-column>
            <el-table-column align="center"
                             label="名称">
              <template slot-scope="scope">
                <span>{{scope.row.doorphoneName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template slot-scope="scope">
                <el-button size="mini"
                           type="danger"
                           @click="handleDelPublicVillage(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="publishDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="handlePublicSubmit">投 放</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { getAdvDoorListObj } from '@/api/advDoor'
import { getListObj, addObj, putObj, delObj, getSingleObj, sendAdMessageToDoorPhone } from '@/api/advertise'
import { getDoorPhoneListByQuartersId } from '@/api/userlist'
import { getAllListObj } from '@/api/home'
import { filterError } from '@/util/filterError.js'
export default {
  props: {
    AdvertiseFlag: Boolean
  },
  data() {
    return {
      add_advertise: false,
      update_advertise: false,
      del_advertise: false,
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
      advertiseForm: {
        id: undefined,
        name: undefined,
        describe: undefined,
        place: 0,
        ids: undefined
      },
      rules: {
        name: [
          { required: true, message: '请输入屏蔽词', trigger: 'blur' }
        ]
      },
      advDoorList: [],
      advDoorlistQuery: {
        page: 1,
        limit: 5
      },
      advDoorTotal: 0,
      advList: [],
      imgPicture: '',
      publishDialogVisible: false,
      deviceTotal: 0,
      deviceList: [],
      publishDeviceList: [],
      devicelistQuery: {
        quartersId: ''
      },
      multipleDeviceSelection: [],
      villageList: [],
      publishSubmitList: {
        ids: '',
        advertiseId: ''
      }
    }
  },
  created() {
    this.add_advertise = this.permissions['add_advertise']
    this.update_advertise = this.permissions['update_advertise']
    this.del_advertise = this.permissions['del_advertise']
  },
  watch: {
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
    this.getAdvDoorList()
    // this.handleGetDoorListObj()
    this.handleGetAllListObj()
  },
  methods: {

    /**
     * desc 投放广告 -- 获取小区列表
     */
    async handleGetAllListObj() {

      try {
        const res = ({ data: { data: this.villageList } } = await getAllListObj())
        await filterError(res, 'notify')
        if (this.villageList.length) {
          this.devicelistQuery.quartersId = this.villageList[0].quartersId
        }
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 投放广告 -- 获取小区下的信息
     */
    async handleGetDoorListObj() {

      try {
        const res = ({ data: { data: this.deviceList } } = await getDoorPhoneListByQuartersId(this.devicelistQuery))
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc  投放广告 -- 更改小区
     */
    handleDeviceFilter() {
      this.handleGetDoorListObj()
    },

    /**
     * desc 素材列表
     */
    async getAdvDoorList() {

      try {
        const res = ({ data: { data: { total: this.advDoorTotal, records: this.advDoorList  } } } = await getAdvDoorListObj(this.advDoorlistQuery))
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
      }
    },
    handleadvDoorCurrentChange(val) {
      this.advDoorlistQuery.page = val
      this.getAdvDoorList()
    },

    /**
     * desc 广告列表
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
     * desc 广告添加
     */
    handleAdd() {
      this.dialogStatus = 'create'
      this.resetForm()
      this.advList = []
      this.formDialogVisible = true
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
    },

    /**
     * desc 添加广告
     */
    async handleSubmit(formName) {

      if (this.advDoorList.length) {
        this.advertiseForm.ids = ''
        this.advDoorList.forEach(item => {
          this.advertiseForm.ids += item.id + ','
        })
        this.advertiseForm.ids = this.advertiseForm.ids.substring(0, this.advertiseForm.ids.length - 1)
      }

      try {
        await this.$refs[formName].validate()
        const res = await addObj(this.advertiseForm)
        await filterError(res, 'notify', 1)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },
    handleUpdate(rows) {
      getSingleObj(rows.id).then(res => {
        if (res.data.code === 0) {
          this.dialogStatus = 'update'
          if (res.data.data.advList) {
            this.advList = res.data.data.advList
          } else {
            this.advList = []
          }
          this.advertiseForm = res.data.data
          delete this.advertiseForm.advList
          this.imgPicture = ''
          this.formDialogVisible = true
          this.multipleSelection = []
          this.$refs.multipleTable.clearSelection()
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
      if (this.advList.length) {
        this.advertiseForm.ids = ''
        this.advList.forEach(item => {
          this.advertiseForm.ids += item.id + ','
        })
        this.advertiseForm.ids = this.advertiseForm.ids.substring(0, this.advertiseForm.ids.length - 1)
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          putObj(this.advertiseForm).then(res => {
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
      this.imgPicture = ''
      this.advertiseForm = {
        id: undefined,
        name: undefined,
        describe: undefined,
        place: 0,
        ids: undefined
      }
    },
    handleDetail(rows) {
      getSingleObj(rows.id).then(res => {
        if (res.data.code === 0) {
          this.dialogStatus = 'detail'
          if (res.data.data.advList) {
            this.advList = res.data.data.advList
          } else {
            this.advList = []
          }
          this.advertiseForm = res.data.data
          delete this.advertiseForm.advList
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
    handleAdvDoorData() {
      const newArr = [...this.advList, ...this.multipleSelection]
      this.advList = Array.from(new Set(newArr))
    },
    handleDelAdvList(index) {
      this.advList.splice(index, 1)
    },
    handleImgShow(url) {
      this.imgPicture = url
    },
    handlePublish(row) {
      this.publishSubmitList.advertiseId = row.id
      this.publishSubmitList.ids = ''
      this.publishDeviceList = []
      this.publishDialogVisible = true
      this.multipleDeviceSelection = []
      this.$refs.multipleDeviceTable.clearSelection()
    },
    handleDeviceSelectionChange(val) {
      this.multipleDeviceSelection = val
    },
    handleAddPublicVillage() {
      const newArr = [...this.publishDeviceList, ...this.multipleDeviceSelection]
      this.publishDeviceList = Array.from(new Set(newArr))
    },
    handleDelPublicVillage(index) {
      this.publishDeviceList.splice(index, 1)
    },
    handlePublicSubmit() {
      if (this.publishDeviceList.length) {
        this.publishDeviceList.forEach(item => {
          this.publishSubmitList.ids += item.doorphoneId + ','
        })
        this.publishSubmitList.ids = this.publishSubmitList.ids.substring(0, this.publishSubmitList.ids.length - 1)
        sendAdMessageToDoorPhone(this.publishSubmitList).then(res => {
          if (res.data.code === 0) {
            this.publishSubmitList.ids = ''
            this.multipleDeviceSelection = []
            this.$refs.multipleDeviceTable.clearSelection()
            this.publishDeviceList = []
            this.$notify({
              title: '成功',
              message: res.data.msg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.advFlex {
  display: flex;
  flex: 1;
  align-items: baseline;
}
.right-icon {
  text-align: center;
  margin: 0 auto;
  font-size: 13px;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  color: #fff;
  background-color: #409eff;
}
.dialog-pic {
  margin-top: 50px;
  max-width: 80%;
}
</style>
