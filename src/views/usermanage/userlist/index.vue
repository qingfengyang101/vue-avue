<template>
  <div>
    <h2 class="layout-pages-title">用户列表</h2>
    <div class="layout-pages-search"
         style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select v-model="listQuery.quartersId"
                     size="small"
                     clearable
                     @change="handleFilter"
                     placeholder="请选择小区">
            <el-option v-for="item in villageOptions"
                       size="small"
                       :key="item.quartersId"
                       :label="item.name"
                       :value="item.quartersId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input placeholder="请输入姓名"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.fullName"
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-input placeholder="请输入手机号"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.mobile"
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
                 v-if="add_userlist"
                 @click="handleAdd">添加新用户</el-button>
      <el-table :data="tableData"
                class="layout-pages-content-table"
                v-loading="listLoading"
                @selection-change="handleSelectionChange"
                style="width: 100%">
        <!-- <el-table-column type="selection"
                         width="55">
        </el-table-column> -->
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.fullName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="手机号">
          <template slot-scope="scope">
            <span>{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="小区">
          <template slot-scope="scope">
            <span>{{scope.row.quartersName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="房间">
          <template slot-scope="scope">
            <span>{{scope.row.buildsName ? scope.row.buildsName + '-' : ""}}{{scope.row.unitName ? scope.row.unitName + '-': ""}}{{ scope.row.roomNum }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center"
                         label="是否开启人脸">
          <template slot-scope="scope">
            <span v-if="scope.row.faceStatus === '0'">未开启</span>
            <span v-if="scope.row.faceStatus === '1'">已开启</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center"
                         label="注册时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="登录时间">
          <template slot-scope="scope">
            <span>{{scope.row.loginTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         width="350px"
                         label="管理">
          <template slot-scope="scope">
            <span class="tag-opearte"
                  v-if="update_userlist"
                  @click="handleUpdate(scope.row)"
                  effect="plain">
              编辑
            </span>
            <span class="tag-opearte"
                  v-if="del_userlist"
                  @click="handleDel(scope.row)"
                  effect="plain">
              删除
            </span>
            <!-- <span class="tag-opearte"
                  @click='handleDetail(scope.row)'
                  effect="plain">
              详情
            </span> -->
            <span class="tag-opearte"
                  @click="handleLook(scope.row)"
                  effect="plain">
              查看房间
            </span>
            <el-dropdown>
              <span class="el-dropdown-link tag-opearte"
                    effect="plain">
                更多
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                                  @click.native="handleDoorDevice(scope.row)">门禁支持</el-dropdown-item>
                <el-dropdown-item divided
                                  @click.native="handleBindCard(scope.row)">绑定云卡</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
      <el-form :model="userListForm"
               :rules="rules"
               ref="userListForm"
               label-width="100px">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="小区名称"
                          prop="quartersId">
              <el-select v-model="userListForm.quartersId"
                         :disabled="dialogStatus=== 'detail'"
                         placeholder="请选择小区名称"
                         size="small">
                <el-option v-for="item in villageOptions"
                           size="small"
                           :key="item.quartersId"
                           :label="item.name"
                           :value="item.quartersId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="姓名"
                          prop="fullName">
              <el-input v-model="userListForm.fullName"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="手机号"
                          prop="mobile">
              <el-input v-model="userListForm.mobile"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="身份证号"
                          prop="idcard">
              <el-input v-model="userListForm.idcard"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="性别"
                          prop="sex">
              <el-select v-model="userListForm.sex"
                         clearable
                         :disabled="dialogStatus=== 'detail'"
                         size="small">
                <el-option v-for="item in sexOptions"
                           size="small"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="状态"
                          prop="status">
              <el-select v-model="userListForm.status"
                         clearable
                         :disabled="dialogStatus=== 'detail'"
                         size="small">
                <el-option v-for="item in statusOptions"
                           size="small"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="formDialogVisible = false"
                   v-if="dialogStatus=== 'create' || dialogStatus=== 'update'">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'create'"
                   @click="handleSubmit('userListForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('userListForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="房间管理"
               :visible.sync="formDialogVisible1">
      <el-table :data="tableData1"
                stripe
                style="width: 100%">
        <el-table-column type="index"
                         align="center"
                         width="50">
        </el-table-column>
        <el-table-column prop="date"
                         align="center"
                         label="名称">
          <template slot-scope="scope">
            <span>{{ scope.row.fullName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date"
                         align="center"
                         label="用户类型">
          <template slot-scope="scope">
            <span v-if='scope.row.userType === "0"'>业主</span>
            <span v-if='scope.row.userType === "1"'>家属</span>
            <span v-if='scope.row.userType === "2"'>租客</span>
            <span v-if='scope.row.userType === "3"'>访客</span>
            <span v-if='scope.row.userType === "4"'>商家</span>
          </template>
        </el-table-column>
        <el-table-column prop="date"
                         align="center"
                         label="小区">
          <template slot-scope="scope">
            <span>{{ scope.row.quartersName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date"
                         align="center"
                         label="楼栋">
          <template slot-scope="scope">
            <span>{{ scope.row.buildsName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date"
                         align="center"
                         label="单元">
          <template slot-scope="scope">
            <span>{{ scope.row.unitName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date"
                         align="center"
                         label="房间">
          <template slot-scope="scope">
            <span>{{ scope.row.roomName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="handleCancelBind(scope.row)">解绑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog width="60%"
                 title="绑定房间"
                 :visible.sync="innerAddRoomVisible"
                 append-to-body>
        <el-form ref="bindRoomForm"
                 :model="bindRoomForm"
                 :rules="ruleBind"
                 label-width="80px">
          <el-row>
            <el-col>
              <el-form-item label="用户类型"
                            prop="userType">
                <el-radio-group v-model="bindRoomForm.userType">
                  <el-radio label="0">业主</el-radio>
                  <el-radio label="1">家属</el-radio>
                  <el-radio label="2">租客</el-radio>
                  <el-radio label="4">商家</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span='12'>
              <el-form-item label="小区"
                            prop="quartersId">
                <el-select v-model="bindRoomForm.quartersId"
                           @change="handleChangeVillage"
                           placeholder="请选择小区"
                           size="small">
                  <el-option v-for="item in villageArr"
                             :key="item.quartersId"
                             :label="item.name"
                             :value="item.quartersId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='12'>
              <el-form-item label="楼栋"
                            prop="buildsId">
                <el-select v-model="bindRoomForm.buildsId"
                           @change="handleChangeBuilding"
                           placeholder="请选择楼栋"
                           size="small">
                  <el-option v-for="item in buildingArr"
                             :key="item.buildsId"
                             :label="item.buildsName"
                             :value="item.buildsId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='12'>
              <el-form-item label="单元"
                            prop="unitId">
                <el-select v-model="bindRoomForm.unitId"
                           @change="handleChangeUnit"
                           placeholder="请选择单元"
                           size="small">
                  <el-option v-for="item in unitArr"
                             :key="item.unitId"
                             :label="item.unitName"
                             :value="item.unitId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='12'>
              <el-form-item prop="roomId"
                            label="房间">
                <el-select v-model="bindRoomForm.roomId"
                           placeholder="请选择房间"
                           size="small">
                  <el-option v-for="item in roomArr"
                             :key="item.roomId"
                             :label="item.roomNum"
                             :value="item.roomId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer"
              class="dialog-footer">
          <el-button type="primary"
                     @click="handleBindRoomUpdate('bindRoomForm')">确 定</el-button>
          <el-button @click="innerAddRoomVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
      <div class="flex_item">
        <el-button type="primary"
                   size="mini"
                   class="btn-opearator"
                   @click="handleAddRoom()">添加房间</el-button>
      </div>
    </el-dialog>

    <el-dialog title="门禁支持"
               :before-close="handleDoorDeviceDialogClose"
               :visible.sync="doorDeviceDialog">
      <el-form :model="doorDeviceForm"
               :rules="ruleDoor"
               ref="doorDeviceForm"
               label-width="100px">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="生效时间"
                          prop="validDate">
              <el-date-picker v-model="doorDeviceForm.validDate"
                              clearable
                              value-format='yyyy-MM-dd HH:mm:ss'
                              format='yyyy-MM-dd HH:mm:ss'
                              type="datetime"
                              placeholder="选择日期时间"
                              size="small">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="失效时间"
                          prop="expireDate">
              <el-date-picker v-model="doorDeviceForm.expireDate"
                              clearable
                              value-format='yyyy-MM-dd HH:mm:ss'
                              format='yyyy-MM-dd HH:mm:ss'
                              type="datetime"
                              placeholder="选择日期时间"
                              size="small">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="小区"
                          prop="quartersId">
              <el-select v-model="doorDeviceForm.quartersId"
                         @change="handleChangeVillageDoor"
                         placeholder="请选择小区"
                         size="small">
                <el-option v-for="item in villageArr"
                           :key="item.quartersId"
                           :label="item.name"
                           :value="item.quartersId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-row>
              <el-col :span='18'>
                <el-form-item label="门禁机"
                              prop="doorPhoneId">
                  <el-select v-model="doorDeviceForm.doorPhoneId"
                             placeholder="请选择门禁机"
                             size="small">
                    <el-option v-for="item in doorDeviceList"
                               :key="item.doorphoneId"
                               :label="item.doorphoneName"
                               :value="item.doorphoneId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2"
                      :offset="1">
                <el-button @click="handleInsertFace">人脸录入</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <img :src="pictureUrl"
                 v-if="pictureUrl"
                 style="max-width:90%;max-height:100%;margin:24px;margin-top:0px;"
                 alt="">
          </el-col>
        </el-row>
      </el-form>
      <p v-if="count"
         style="color:red;text-align: center;">正在录入....{{count}}s</p>
      <p v-if="reqCode === 0"
         style="color:red;text-align: center;">录入成功!!!</p>
      <div class="flex_item">
        <el-button type="primary"
                   size="mini"
                   class="btn-opearator"
                   @click="handleAddDoorDevice('doorDeviceForm')">确 定</el-button>
        <el-button size="mini"
                   class="btn-opearator"
                   @click="handleDoorDeviceDialogClose">关 闭</el-button>
      </div>
    </el-dialog>


    <el-dialog title="绑定云卡"
               :visible.sync="BindCardDialogVisible">
      <el-form :model="bindCardForm"
               :rules="rulesBindCard"
               ref="bindCardForm"
               label-width="100px">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="卡号"
                          prop="cardNum">
              <el-input v-model="bindCardForm.cardNum"
                        clearable
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleBindCardSubmit('bindCardForm')">确 定</el-button>
        <el-button type="primary"
                   @click="BindCardDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListObj,
  addObj,
  putObj,
  delObj,
  getSIngleObj,
  getOwnerObj,
  ujRoomOwnerBind,
  ujRoomOwnerDel,
  getDoorPhoneListByQuartersId,
  getNewFace,
  insertFace,
  bindCard,
  drFaceInfoUpdate,
  confirmPhotoAccessControl,
  uniformPhotos,
  getByUid,
  getSingleFaceInfo } from '@/api/userlist'
import { getQuarterByRole, getBuildsListByquartersId, getUnitListByBuildId, getRoomListByUnitId } from '@/api/village'
import { validatePhone } from '@/api/validator'
import { filterError } from '@/util/filterError.js'
export default {
  data() {
    const startTime = (rule, value, callback) => {
      const self = this
      if (!value) {
        return callback(new Error('生效时间不能为空'))
      }
      setTimeout(() => {
        if (self.doorDeviceForm.expireDate) {
          const beginDate = self.doorDeviceForm.validDate
          const endDate = self.doorDeviceForm.expireDate
          const d1 = new Date(beginDate.replace(/\-/g, '\/'))
          const d2 = new Date(endDate.replace(/\-/g, '\/'))
          if (beginDate !== '' && endDate !== '' && d1 >= d2) {
            callback(new Error('开始时间不能大于结束时间！'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    const endTime = (rule, value, callback) => {
      const self = this
      if (!value) {
        return callback(new Error('失效时间不能为空'))
      }
      setTimeout(() => {
        if (self.doorDeviceForm.validDate) {
          const beginDate = self.doorDeviceForm.validDate
          const endDate = self.doorDeviceForm.expireDate
          const d1 = new Date(beginDate.replace(/\-/g, '\/'))
          const d2 = new Date(endDate.replace(/\-/g, '\/'))
          if (beginDate !== '' && endDate !== '' && d1 >= d2) {
            callback(new Error('结束时间不能小于开始时间！'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    return {
      add_userlist: false,
      update_userlist: false,
      del_userlist: false,
      listLoading: false,
      list: [],
      total: 0,
      tableData: [],
      tableData1: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      formDialogVisible: false,
      formDialogVisible1: false,
      multipleSelection: [],
      dialogStatus: '',
      dialogStatus1: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      userListForm: {
        fullName: undefined,
        mobile: undefined,
        status: undefined,
        faceStatus: undefined,
        idcard: undefined,
        sex: undefined,
        updateTime: undefined,
        quartersId: undefined
      },
      rules: {
        quartersId: [
          { required: true, message: '请输入小区名称', trigger: 'change' }
        ],
        fullName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: validatePhone,
            trigger: 'blur'
          }
        ]
      },
      villageOptions: [],
      sexOptions: [{
        id: '0',
        label: '男'
      }, {
        id: '1',
        label: '女'
      }],
      statusOptions: [{
        id: '0',
        label: '激活'
      }, {
        id: '2',
        label: '冻结'
      }, {
        id: '3',
        label: '删除'
      }],
      typeOptions: [{
        id: '0',
        label: '业主'
      }, {
        id: '1',
        label: '家属'
      }, {
        id: '2',
        label: '租客'
      }, {
        id: '3',
        label: '访客'
      }],
      innerAddRoomVisible: false,
      bindRoomForm: {
        userType: '0',
        roomId: undefined,
        ownerId: undefined
      },
      villageArr: [],
      buildingArr: [],
      unitArr: [],
      roomArr: [],
      ownerArr: [],
      ruleBind: {
        userType: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ],
        roomId: [
          { required: true, message: '请选择房间', trigger: 'change' }
        ]
      },
      ruleDoor: {
        validDate: [
          { required: true, message: '请选择生效时间', trigger: 'blur' },
          { validator: startTime, trigger: 'change' }
        ],
        expireDate: [
          { required: true, message: '请选择失效时间', trigger: 'blur' },
          { validator: endTime, trigger: 'change' }
        ]
      },
      rulesBindCard: {
        cardNum: [
          { required: true, message: '请输入卡号', trigger: 'blur' }
        ]
      },
      rowsTemp: {},
      doorDeviceDialog: false,
      doorDeviceForm: {
        validDate: undefined,
        doorPhoneId: '',
        expireDate: undefined,
        ownerId: undefined
      },
      doorDeviceList: [],
      timer: null,
      count: '',
      reqCode: '',
      bindCardForm: {
        cardNum: undefined,
        uid: undefined
      },
      BindCardDialogVisible: false,
      pictureUrl: ''
    }
  },
  created() {
    this.add_userlist = this.permissions['add_userlist']
    this.update_userlist = this.permissions['update_userlist']
    this.del_userlist = this.permissions['del_userlist']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
    this.handleGetAllListObj()
  },
  methods: {

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
     * desc 触发添加用户
     */
    handleAdd() {
      this.dialogStatus = 'create'
      this.resetForm()
      this.formDialogVisible = true
    },

    /**
     * desc 获取小区列表
     */
    async handleGetAllListObj() {
      
      try {
        const { data: { data: requireInfo } } = await getQuarterByRole()
        
        if (Array.isArray(requireInfo)) {
          requireInfo.forEach(item => {
            delete item.bulidList
            this.villageOptions.push(item)
            this.villageArr.push(item)
          })
        }

      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 新增用户
     */
    async handleSubmit(formName) {
      
      try {
        await this.$refs[formName].validate()
        const res = await addObj(this.userListForm)
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
      Object.assign(this.userListForm, rows)
      if (!this.userListForm.quartersId) {
        this.userListForm.quartersId = undefined
      }
      this.formDialogVisible = true
    },

    /**
     * desc 更新用户信息
     */
    async handleUptForm(formName) {
      
      try {
        await this.$refs[formName].validate()
        const res = await putObj(this.userListForm)
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
    async handleDel({ ownerId }) {
      
      try {
        await this.$confirm('此操作将删除该条数据, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        const res = await delObj(ownerId)
        await filterError(res, 'notify', 4)
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 重置表单数据
     */
    resetForm() {
      this.userListForm = {
        fullName: undefined,
        mobile: undefined,
        status: undefined,
        faceStatus: undefined,
        idcard: undefined,
        sex: undefined,
        updateTime: undefined
      }
    },

    /**
     * desc 查看详情
     */
    async handleDetail({ ownerId }) {

      try {
        const res = ({ data: { data: this.userListForm } } = await getSIngleObj(ownerId))
        await filterError(res, 'notify')
        this.dialogStatus = 'detail'
        this.formDialogVisible = true
      }catch(err) { 
        console.log(err)
      }
    },

    /**
     * desc 查看房间
     */
    async handleLook(rows) {
      this.rowsTemp = rows
      this.bindRoomForm = {
        userType: '0',
        roomId: undefined,
        ownerId: undefined
      }
      this.bindRoomForm.ownerId = rows.ownerId

      try {
        const res = ({ data: { data: this.tableData1 } } = await getOwnerObj({ ownerId: rows.ownerId }))
        await filterError(res, 'notify')
        this.dialogStatus = 'detail'
        this.formDialogVisible1 = true
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 添加房间
     */
    handleAddRoom() {
      this.innerAddRoomVisible = true
    },

    /**
     * desc 获取小区
     */
    async handleChangeVillage() {
      
      try {
        this.bindRoomForm = { ...this.bindRoomForm, ...{ buildsId: undefined, unitId: undefined, roomId: undefined } }
        this.buildingArr = this.unitArr = this.roomArr = this.ownerArr = []
        const res = ({ data: { data: this.buildingArr } } = await getBuildsListByquartersId({ quartersId: this.bindRoomForm.quartersId }))
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 获取楼栋
     */
    async handleChangeBuilding() {
      
      try {
        this.bindRoomForm = { ...this.bindRoomForm, ...{ unitId: undefined, roomId: undefined } }
        this.unitArr = this.roomArr = this.ownerArr = []

        const res = ({ data: { data: this.unitArr } } = await getUnitListByBuildId({ buildsId: this.bindRoomForm.buildsId }))
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 获取单元
     */
    async handleChangeUnit() {
      
      try {
        this.bindRoomForm.roomId = undefined
        this.roomArr = []
        this.ownerArr = []
        const res = ({ data: { data: this.roomArr } } = await getRoomListByUnitId({ unitId: this.bindRoomForm.unitId }))
        await filterError(res, 'notify')
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 绑定房间
     */
    async handleBindRoomUpdate(formName) {
      
      try {
        await this.$refs[formName].validate()
        const res = await ujRoomOwnerBind(this.bindRoomForm)
        await filterError(res, 'notify')
        this.innerAddRoomVisible = false
        this.handleLook(this.rowsTemp)
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 解绑房间
     */
    async handleCancelBind(rows) {
      
      try {
        const res = await ujRoomOwnerDel(rows.relationId)
        await filterError(res, 'notify', 7)
        this.handleLook(this.rowsTemp)
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 门禁支持
     */
    async handleDoorDevice(rows) {
      this.pictureUrl = ''
      
      try {
        let data;
        const res = ({ data: { data } } = await getSingleFaceInfo(rows.ownerId))
        await filterError(res, 'notify')
        if (data) {
          const { validDate, expireDate } = data
            this.pictureUrl = data.pictureUrl
            this.reqCode = ''
            this.doorDeviceForm = {
              validDate: validDate,
              expireDate: expireDate,
              doorPhoneId: '',
              ownerId: ''
            }
        }

        this.rowsTemp = rows
        this.doorDeviceForm.ownerId = rows.ownerId
        this.doorDeviceDialog = true

      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 绑定电卡
     */
    async handleBindCard(rows) {

      try {
        this.bindCardForm = {...this.bindCardForm, ...{ uid: rows.mobile, cardNum: undefined }}
        const { data: { code, data: { cardNum } } } = await getByUid(rows.mobile)

        if (code === 0) {
          this.bindCardForm.cardNum = cardNum
        } else {
          this.bindCardForm.cardNum = undefined
        }
        
        this.BindCardDialogVisible = true
        
      }catch(err) {
        
        this.BindCardDialogVisible = true
      }
    },

    /**
     * desc 绑定电卡
     */
    async handleBindCardSubmit(formName) {
      
      try {
        await this.$refs[formName].validate()
        const res = await bindCard(this.bindCardForm)
        await filterError(res, 'notify', 8)
        this.BindCardDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 获取门禁机数据
     */
    async handleChangeVillageDoor() {

      try {
        this.doorDeviceForm.doorPhoneId = ''
        this.doorDeviceList = []

        ({ data: { data: this.doorDeviceList } } = await getDoorPhoneListByQuartersId({ quartersId: this.doorDeviceForm.quartersId }))
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 人脸录入
     */
    async handleInsertFace() {
      
      try {

        const { doorDeviceForm: { doorPhoneId, ownerId } } = this;

        if (!doorPhoneId) {
          this.$message.error('请先选择小区')
          return;
        }

        const obj = { doorPhoneId, ownerId }
        const res = await insertFace(obj)
        await filterError(res, 'notify')
        this.handleCycleDevice()
      }catch(err) {
        console.log(err)
      }
    },
    handleCycleDevice() {
      const TIME_COUNT = 60
      const today = new Date()
      const y = today.getFullYear()
      const M = today.getMonth() + 1
      const d = today.getDate()
      const h = today.getHours()
      const m = today.getMinutes()
      const s = today.getSeconds()
      if (!this.timer) {
        this.count = TIME_COUNT
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
            if (this.count % 6 === 0) {
              const obj = {
                userId: this.rowsTemp.ownerId,
                time: y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s
              }
              getNewFace(obj).then(res => {
                if (res.data.code === 0) {
                  clearInterval(this.timer)
                  this.count = undefined
                  this.timer = null
                  this.rowsTemp.info = res.data.data
                  if (res.data.data.pictureUrl) {
                    this.pictureUrl = res.data.data.pictureUrl
                    confirmPhotoAccessControl({ photo: this.pictureUrl, ownerId: this.rowsTemp.ownerId }).then(resConfirm => {
                      if (resConfirm.data.code === 0) {
                        uniformPhotos({ photo: this.pictureUrl, ownerId: this.rowsTemp.ownerId }).then(resUniform => {
                          if (resUniform.data.code === 0) {
                            this.reqCode = res.data.code
                            this.$notify({
                              title: '成功',
                              message: resUniform.data.msg,
                              type: 'success'
                            })
                          } else {
                            this.$notify({
                              title: '失败',
                              message: '人脸录入失败',
                              type: 'error'
                            })
                          }
                        })
                      } else {
                        this.$notify({
                          title: '失败',
                          message: resConfirm.data.msg,
                          type: 'error'
                        })
                      }
                    })
                  }
                }
              })
            }
          } else {
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    /**
     * desc 人脸录入
     */
    async handleAddDoorDevice(formName) {
      
      try {
        await this.$refs[formName].validate()
        if (this.reqCode === 0) {
          const { doorDeviceForm: { validDate, expireDate } } = this;
          this.rowsTemp.info = { ...this.rowsTemp.info, ...{ validDate, expireDate } }
          const res = await drFaceInfoUpdate(this.rowsTemp.info)
          await filterError(res, 'notify', 2)
          this.doorDeviceDialog = false
        }

      }catch(err) {
        console.log(err)
      }
    },
    handleDoorDeviceDialogClose() {
      clearInterval(this.timer)
      this.count = undefined
      this.timer = null
      this.doorDeviceDialog = false
    }
  }
}
</script>


