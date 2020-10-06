<template>
  <div>
    <h2 class="layout-pages-title">人员管理</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.quartersId"
                     size="small"
                     @change="handleFilter"
                     placeholder="请选择小区">
            <el-option v-for="item in villageOptions"
                       size="small"
                       :key="item.quartersId "
                       :label="item.name"
                       :value="item.quartersId ">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input placeholder="请输入名称"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.name"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="1">
          <el-button size="small"
                     type="primary"
                     @click="handleFilter">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="layout-pages-content">
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
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
                         label="名称">
          <template slot-scope="scope">
            <span>{{scope.row.fullName}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="guid">
          <template slot-scope="scope">
            <span>{{scope.row.guid}}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column align="center"
                         label="卡号">
          <template slot-scope="scope">
            <span>{{scope.row.idNo}}</span>
          </template>
        </el-table-column> -->

        <el-table-column align="center"
                         label="人脸识别照片">
          <template slot-scope="scope">
            <template v-if="scope.row.images">
              <template v-for="(item,index) in scope.row.images">
                <img :src="item"
                     @click="handleShowDetail(item,true,index,scope.row)"
                     class="table-img"
                     :key="index">
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="门禁机照片">
          <template slot-scope="scope">
            <template v-if="scope.row.drimg">
              <img :src="scope.row.drimg"
                   @click="handleShowDetail(scope.row.drimg,false)"
                   class="table-img">
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="照片授权状态">
          <template slot-scope="scope">
            <span v-if="scope.row.successOrFail === '3'"
                  style="color:#666666;">未授权</span>
            <span v-if="scope.row.successOrFail === '2'"
                  style="color:red;">授权失败</span>
            <span v-if="scope.row.successOrFail === '1'"
                  style="color:#e6a23c;">授权未完成</span>
            <span v-if="scope.row.successOrFail === '0'"
                  style="color:#409eff">授权</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理"
                         min-width="170px">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="update_personManger"
                  @click="handleUpdate(scope.row)"
                  effect="plain">
              编辑
            </span>
            <span class="tag-opearte"
                  @click="handleFaceRegister(scope.row)"
                  v-if="faceRegister_personManger"
                  effect="plain">
              人脸识别注册
            </span>
            <span class="tag-opearte"
                  v-if="auth_personManger"
                  @click="handleDeviceShow(scope.row)"
                  effect="plain">
              授权
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="layout-pages-pagination">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10]"
                     :page-size="listQuery.limit"
                     layout="sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
    <!-- 编辑、详情、添加 -->
    <el-dialog :title="textMap[dialogStatus]"
               width="40%"
               :visible.sync="formDialogVisible">
      <el-form :model="personMangerForm"
               :rules="rules"
               ref="personMangerForm"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择小区："
                          prop="quartersName">
              <el-select v-model="personMangerForm.quartersId"
                         :disabled="dialogStatus==='update'"
                         size="small"
                         placeholder="请选择小区">
                <el-option v-for="item in villageOptions"
                           size="small"
                           :key="item.quartersId"
                           :label="item.name"
                           :value="item.quartersId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名："
                          prop="userId">
              <el-select v-model="personMangerForm.userId"
                         :disabled="dialogStatus==='update'"
                         size="small"
                         @change="handleUserId"
                         placeholder="请选择用户">
                <el-option v-for="item in personList"
                           size="small"
                           :key="item.ownerId"
                           :label="item.fullName"
                           :value="item.ownerId">
                  <span style="float: left">{{ item.fullName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="dialogStatus==='update'">
          <el-col :span="12">
            <el-form-item label="本地上传：">
              <el-switch v-model="photoUploadWay"
                         active-value="1"
                         active-text="设备拍照"
                         inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="photoUploadWay === '0' && dialogStatus==='update'">
          <el-col :span="24">
            <el-form-item label="上传照片："
                          prop="phone">
              <el-upload action="/api/admin/goods/goodsImgUpload"
                         list-type="picture-card"
                         class="deleteNone"
                         :file-list="fileList"
                         :on-success="handleAvatarSuccess"
                         :class="{disabled:uploadDisabled0}"
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
          </el-col>
        </el-row>
        <el-row v-if="photoUploadWay === '1' && dialogStatus==='update'">
          <el-col :span="12">
            <el-form-item label="设备：">
              <el-select v-model="deviceKey"
                         size="small"
                         placeholder="请选择拍照设备">
                <el-option v-for="item in allDeviceList"
                           size="small"
                           :key="item.deviceKey"
                           :label="item.name"
                           :value="item.deviceKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="photoUploadWay === '1' && dialogStatus==='update'">
          <el-col :span="24">
            <el-form-item label="设备拍照：">
              <el-button @click="handleTokenDevice">调取设备拍照</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false"
                   v-if="dialogStatus=== 'create' ">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'create'"
                   @click="
                   ('personMangerForm')">确 定</el-button>
        <el-button type="primary"
                   @click="formDialogVisible = false"
                   v-if="dialogStatus=== 'update'">关 闭</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="photoShowDialog"
               width="30%">
      <img :src="dialogPhoto"
           style="display:block;margin:auto;max-width:100%;">
      <span slot="footer"
            class="dialog-footer">
        <el-button type="danger"
                   @click="handleDelImageUrl"
                   v-if="showFlag">删 除</el-button>
        <el-button type="primary"
                   @click="photoShowDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="人员授权"
               :visible.sync="deviceFormDialogVisible">
      <el-table :data="tableDataDevice"
                stripe
                @selection-change="handleDeviceSelectionChange"
                style="width: 100%">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="设备序列号">
          <template slot-scope="scope">
            <span>{{scope.row.deviceKey}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="应用名称">
          <template slot-scope="scope">
            <span v-if="false">{{scope.row.name}}</span>
            <span>{{quartersName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="设备名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="版本号">
          <template slot-scope="scope">
            <span>{{scope.row.versionNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="授权状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.ispower === '1'"
                    type="primary">已授权</el-tag>
            <el-tag v-else
                    type="warning">未授权</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="scope.row.ispower !== '1'"
                  @click="handleAuthorized(scope.row)"
                  effect="plain">
              授权
            </span>
            <span class="tag-opearte"
                  v-if="scope.row.ispower === '1'"
                  @click="handleCancelAuthorized(scope.row)"
                  effect="plain">
              销权
            </span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="deviceFormDialogVisible=false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="tokingPhotoDialog"
               :before-close="handleClose"
               width="30%">
      <div class="photo-taking">
        <img :src="registerByPhoto">
        <p>进入拍照模式，请站立在设备面前 <span style="color: #0092DF;margin-left: 10px;">{{count}} s</span></p>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import registerByPhoto from '@/assets/img/registerByPhoto.png'
import { mapGetters } from 'vuex'
import { getAllListObj } from '@/api/gateDevice'
import { getListObj, addObj, putObj, delObj, selectUjQuarters, selectPowerList, setPeople, selectPerson, selectImageIdByImageUrl, deleteFace, selectFace, personAndPicRegister, saleRightOfEquipment } from '@/api/personManger'
import { openRegistration, getRegisteration, cancel } from '@/api/gateDevice'
import { filterError } from '@/util/filterError'
export default {
  data() {
    return {
      add_personManger: false,
      update_personManger: false,
      del_personManger: false,
      faceRegister_personManger: false,
      auth_personManger: false,
      listLoading: false,
      list: [],
      total: 0,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 10,
        quartersId: undefined
      },
      formDialogVisible: false,
      multipleSelection: [],
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      personMangerForm: {
        quartersName: undefined,
        quartersId: undefined,
        userId: undefined,
        name: undefined,
        callNo: undefined,
        phone: undefined,
        guid: undefined,
        imageUrl: []
      },
      rules: {
        quartersName: [
          { required: true, message: '请输入小区名称', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ]
      },
      villageOptions: [],
      photoShowDialog: false,
      dialogPhoto: '',
      quartersName: '',
      deviceFormDialogVisible: false,
      tableDataDevice: [],
      multipleDeviceSelection: [],
      peopleObj: {
        guid: undefined,
        deviceKeys: undefined
      },
      formImgdialogVisible: false,
      photoUploadWay: '0',
      dialogImageUrl: '',
      imgDialogVisible: false,
      fileList: [],
      personList: [],
      tokingPhotoDialog: false,
      timer: null,
      count: '',
      taskId: '',
      registerByPhoto: registerByPhoto,
      deviceKey: '',
      allDeviceList: [],
      showFlag: true,
      picguidIndex: undefined
    }
  },
  created() {
    this.add_personManger = this.permissions['add_personManger']
    this.update_personManger = this.permissions['update_personManger']
    this.del_personManger = this.permissions['del_personManger']
    this.faceRegister_personManger = this.permissions['faceRegister_personManger']
    this.auth_personManger = this.permissions['auth_personManger']
  },
  watch: {
    'personMangerForm.quartersId': function(val) {
      if (val) {
        this.personMangerForm.userId = undefined
        this.handleChangeVillage()
      }
    },
    'listQuery.quartersId': function(val) {
      if (val) {
        const findArr = this.villageOptions.find(item => {
          if (item.quartersId === val) {
            return item
          }
        })
        this.quartersName = findArr.name
      }
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    uploadDisabled0: function() {
      return this.fileList.length >= 3
    }
  },
  mounted() {
    this.handleGetAllListObj()
    //this.handleChangeVillage()
  },
  methods: {
    handleUserId(val) {
      let obj = {}
      obj = this.personList.find((item) => {
        return item.ownerId === val
      })
      this.personMangerForm.name = obj.fullName
    },
    /**
     * desc 获取用户列表
     */
    async handleChangeVillage() {

      try {
        const { personMangerForm: { quartersId } } = this;
        if (!quartersId) { return; }

        const res = ({ data: { data: this.personList } } = await selectPerson({ deptId: quartersId }))
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
      }

      // if (this.personMangerForm.quartersId) {
      //   selectPerson({ deptId: this.personMangerForm.quartersId }).then(res => {
      //     if (res.data.code === 0) {
      //       this.personList = res.data.data
      //     } else {
      //       this.$notify({
      //         title: '失败',
      //         message: res.data.msg,
      //         type: 'error'
      //       })
      //     }
      //   })
      // }
    },
    /**
     * desc 获取小区列表
     */
    async handleGetAllListObj() {

      try {
        const { data: { data: requireInfo } } = await selectUjQuarters()
        this.villageOptions = []

        if (requireInfo.length) {
          requireInfo.forEach(item => {
            delete item.bulidList
            this.villageOptions.push(item)
          })
        }

        if (this.villageOptions.length) {
          this.listQuery.quartersId = this.villageOptions[0].quartersId
          this.quartersName = this.villageOptions[0].name
          this.getList()
        }

      }catch(err) {
        console.log(err)
      }
    },
    handleGetAllDeviceListObj() {
      const obj = {
        page: 1,
        limit: 100,
        quartersId: this.listQuery.quartersId
      }
      getAllListObj(obj).then(res => {
        if (res.data.code === 0) {
          this.allDeviceList = res.data.data.records
        }
      })
    },
    /**
     * desc 获取用户列表
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


      // this.listLoading = true
      // getListObj(this.listQuery).then(res => {
      //   this.listLoading = false
      //   if (res.data.code === 0) {
      //     this.total = res.data.data.total
      //     this.tableData = res.data.data.records
      //     this.tableData.forEach(item => {
      //       if (item.image) {
      //         item.image = item.image.split(',')
      //       }
      //       if (item.image !== null) {
      //         if (item[item.length] === '') {
      //           item.image.pop()
      //         }
      //       }
      //     })
      //   } else {
      //     this.$notify({
      //       title: '失败',
      //       message: res.data.msg,
      //       type: 'error'
      //     })
      //   }
      // })
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
    resetForm() {
      this.personMangerForm = {
        quartersName: this.quartersName,
        quartersId: undefined,
        userId: undefined,
        name: undefined,
        callNo: undefined,
        phone: undefined
      }
    },

    /**
     * desc 编辑人员管理
     */
    async handleUpdate(rows) {
      this.dialogStatus = 'update'
      this.fileList = []
      this.personList = []

      try {
        this.handleGetAllDeviceListObj()
        Object.assign(this.personMangerForm, rows)
        this.personMangerForm.guid = rows.id
        this.personMangerForm.quartersName = this.quartersName
        this.personMangerForm.quartersId = this.listQuery.quartersId
        await this.handleChangeVillage()
        this.personMangerForm.userId = rows.userId
        if (rows.images && rows.images.length) {
          rows.images.forEach(item => {
            this.fileList.push({
              url: item
            })
          })
        }
      this.formDialogVisible = true
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 查看大图
     */
    handleShowDetail(row, value, index, rows) {
      if (typeof (index) !== 'undefined') {
        this.picguidIndex = rows.picguid[index]
      }
      this.showFlag = value
      this.dialogPhoto = row
      this.photoShowDialog = true
    },

    /**
     * desc 授权
     */
    async handleDeviceShow({ guid }) {
      const listQueryDevice = {
        quartersId: this.listQuery.quartersId,
        guid: undefined
      }

      if (!guid) {
        this.$notify({ title: '失败', message: '暂无Guid,无法进行授权', type: 'error' })
        return;
      }

      listQueryDevice.guid = guid
      this.peopleObj.guid = guid

      try {
        const res = ({ data: { data: this.tableDataDevice } } = await selectPowerList(listQueryDevice))
        await filterError(res, 'notify')
        this.deviceFormDialogVisible = true
      }catch(err) {
        console.log(err)
      }
    },
    handleDeviceSelectionChange(val) {
      this.multipleDeviceSelection = val
    },

    /**
     * desc 上传图片成功
     */
    async handleAvatarSuccess(res, file, fileList) {


      try {
        if (res.code !== 0) { 
          console.log(1111)
          this.$notify({ title: '失败', message: res.msg, type: 'error'})
          return; 
        }
        const obj = {
          personGuid: this.personMangerForm.id,
          imageUrl: res.data.url
        }

        let data = '';
        const response = ({ data } = await putObj(obj))
        await filterError(response, 'notify', 2)
        fileList[fileList.length - 1] = data
        //this.fileList = fileList
        this.getList()
      }catch(err) {
        fileList.pop()
      }

      this.fileList = fileList
      

      // if (res.code === 0) {
      //   const obj = {
      //     personGuid: this.personMangerForm.id,
      //     imageUrl: res.data.url
      //   }
      //   putObj(obj).then(res => {
      //     if (res.data.code === 0) {
      //       this.$notify({
      //         title: '成功',
      //         message: '编辑成功',
      //         type: 'success'
      //       })
      //       fileList[fileList.length - 1] = res.data
      //       this.getList()
      //     } else {
      //       fileList.pop()
      //       this.$notify({
      //         title: '失败',
      //         message: res.data.msg,
      //         type: 'error'
      //       })
      //     }
      //   })
      //   this.fileList = fileList
      // } else {
      //   this.$notify({
      //     title: '失败',
      //     message: res.msg,
      //     type: 'error'
      //   })
      // }
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.imgDialogVisible = true
    },

    /**
     * desc 取消授权
     */
    async handleCancelAuthorized(row) {

      try {
        this.peopleObj.deviceKeys = row.deviceKey;
        await saleRightOfEquipment(this.peopleObj)
        await filterError(res, 'notify', 5)
        this.formDialogVisible = false
        this.handleDeviceShow(row)
      }catch(err) {
        console.log(err)
      }

      // this.peopleObj.deviceKeys = row.deviceKey
      // saleRightOfEquipment(this.peopleObj).then(res => {
      //   if (res.data.code === 0) {
      //     this.formDialogVisible = false
      //     this.handleDeviceShow(row)
      //     debugger
      //     this.$notify({
      //       title: '成功',
      //       message: '销权成功',
      //       type: 'success'
      //     })
      //     this.getList()
      //   } else {
      //     this.$notify({
      //       title: '失败',
      //       message: res.data.msg,
      //       type: 'error'
      //     })
      //   }
      // })
    },

    /**
     * desc 授权
     */
    async handleAuthorized(row) {

      try {
        this.peopleObj.deviceKeys = row.deviceKey;
        await setPeople(this.peopleObj)
        await filterError(res, 'notify', 6)
        this.formDialogVisible = false
        this.handleDeviceShow(row)
      }catch(err) {
        console.log(err)
      }


      // this.peopleObj.deviceKeys = row.deviceKey
      // setPeople(this.peopleObj).then(res => {
      //   if (res.data.code === 0) {
      //     this.formDialogVisible = false
      //     this.handleDeviceShow(row)
      //     debugger
      //     this.$notify({
      //       title: '成功',
      //       message: '授权成功',
      //       type: 'success'
      //     })
      //     this.getList()
      //   } else {
      //     this.$notify({
      //       title: '失败',
      //       message: res.data.msg,
      //       type: 'error'
      //     })
      //   }
      // })
    },

    /**
     * desc 删除图片
     */
    async handleDelImageUrl() {


      try {
        let data = '';
        const res = ({ data: { data } } = await selectImageIdByImageUrl({ imageUrl: this.dialogPhoto }))
        await filterError(res, 'notify')
        const response = await deleteFace({ personGuid: data.personGuid, guid: this.picguidIndex, imageUrl: this.dialogPhoto })
        await filterError(res, 'notify', 4)
        this.photoShowDialog = false
        this.getList()
      }catch(err) {
        console.log(err)
      }

      // selectImageIdByImageUrl({ imageUrl: this.dialogPhoto }).then(res => {
      //   let data = ''
      //   if (res.data.code === 0) {
      //     data = res.data.data
      //     deleteFace({ personGuid: data.personGuid, guid: this.picguidIndex, imageUrl: this.dialogPhoto }).then(response => {
      //       if (response.data.code === 0) {
      //         this.$notify({
      //           title: '成功',
      //           message: '删除成功',
      //           type: 'success'
      //         })
      //         this.photoShowDialog = false
      //         this.getList()
      //       } else {
      //         this.$notify({
      //           title: '失败',
      //           message: res.data.msg,
      //           type: 'error'
      //         })
      //       }
      //     })
      //   } else {
      //     this.$notify({
      //       title: '失败',
      //       message: res.data.msg,
      //       type: 'error'
      //     })
      //   }
      // })
    },

    /**
     * desc 关闭拍照
     */
    async handleClose(row) {

      try {
        const cencelObj = { deviceKey: this.deviceKey, guid: this.personMangerForm.guid, taskId: this.taskId, state: 4 }
        const { data: { code } } = await cancel(cencelObj)
        
        if (code === 'GS_SUS211') {
          this.getList()
          this.$notify({ title: '提示', message: '拍照结束', type: 'success' })
        }
        this.tokingPhotoDialog = false
      }catch(err) {
        console.log(err)
      }

      // const cencelObj = { deviceKey: this.deviceKey, guid: this.personMangerForm.guid, taskId: this.taskId, state: 4 }
      // cancel(cencelObj).then(res => {
      //   if (res.data.code === 'GS_SUS211') {
      //     this.getList()
      //     this.$notify({
      //       title: '提示',
      //       message: '拍照结束',
      //       type: 'success'
      //     })
      //   }
      // })
      // this.tokingPhotoDialog = false
    },
    handleCycleDevice() {
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        const obj = { 'type': 1, deviceKey: this.deviceKey, personGuid: this.personMangerForm.id }
        openRegistration(obj).then(res => {
          if (res.data.code === 0) {
            const searchObj = { deviceKey: this.deviceKey, guid: this.personMangerForm.guid, taskId: res.data.data.data }
            this.taskId = res.data.data.data
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
                if (this.count % 3 === 0) {
                  getRegisteration(searchObj).then(res => {
                    const reqData = res.data.data.data
                    if (reqData === 3) {
                      clearInterval(this.timer)
                      this.timer = null
                      this.handleClose()
                      this.$notify({
                        title: '失败',
                        message: '开启失败',
                        type: 'error'
                      })
                    } else if (reqData === 4) {
                      clearInterval(this.timer)
                      selectFace({ guid: this.personMangerForm.id }).then(res => {
                        if (res.data.code === 0) {
                          this.getList()
                          this.handleClose()
                          this.timer = null
                          this.$notify({
                            title: '完成',
                            message: '拍照结束',
                            type: 'success'
                          })
                        }
                      })
                    } else if (reqData === 5) {
                      clearInterval(this.timer)
                      this.timer = null
                      this.$notify({
                        title: '失败',
                        message: '任务过期',
                        type: 'error'
                      })
                    } else if (reqData === 6) {
                      clearInterval(this.timer)
                      this.timer = null
                      this.handleClose()
                      this.$notify({
                        title: '失败',
                        message: '任务失败',
                        type: 'error'
                      })
                    }
                  })
                }
              } else {
                clearInterval(this.timer)
                this.tokingPhotoDialog = false
                this.timer = null
              }
            }, 1000)
          } else {
            clearInterval(this.timer)
            this.timer = null
            this.tokingPhotoDialog = false
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      }
    },

    /**
     * desc  调取设备拍照
     */
    handleTokenDevice() {
      if (this.deviceKey) {
        this.tokingPhotoDialog = true
        this.handleCycleDevice()
      } else {
        this.$message({
          message: '请选择设备',
          type: 'warning'
        })
      }
    },

    /**
     * desc 人脸识别注册
     */
    async handleFaceRegister(row) {

      try {
        const obj = {
          username: row.fullName,
          quartersId: this.listQuery.quartersId,
          image: row.drimg,
          ownerid: row.userId,
          guid: row.guid
        }

        const res = await personAndPicRegister(obj)
        await filterError(res, 'notify')
        this.getList()
      }catch(err) {
        console.log(err)
      }

      // personAndPicRegister(obj).then(res => {
      //   if (res.data.code === 0) {
      //     this.$notify({
      //       title: '成功',
      //       message: res.data.msg,
      //       type: 'success'
      //     })
      //     this.getList()
      //   } else {
      //     this.$notify({
      //       title: '失败',
      //       message: res.data.msg,
      //       type: 'error'
      //     })
      //   }
      // })
    }
  }
}
</script>
<style lang="scss">
.middleware-person {
  padding-top: 20px;
  border-top: 1px solid #ccc;
}
.tokenPhote-title-detail {
  font-weight: 500;
  font-size: 14px;
  padding: 20px;
  color: #555555;
  background: #f7f7f7;
}
.disabled .el-upload--picture-card {
  display: none;
}
.deleteNone .el-upload-list__item-delete {
  display: none !important;
}
.photo-taking {
  text-align: center;
  p {
    text-align: center;
    font-size: 14px;
    color: #686f79;
  }
}
</style>

