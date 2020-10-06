<template>
  <div>
    <h2 class="layout-pages-title">房间管理</h2>
    <div class="layout-pages-search">
      <el-form :model="roomForm"
               :rules="rules"
               ref="roomForm"
               label-width="80px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="小区"
                          style="margin-bottom:0px">
              <el-select v-model="listQuery.quartersId"
                         size="small"
                         @change="handleQuartChange"
                         placeholder="请选择小区">
                <el-option v-for="item in villageList"
                           size="small"
                           :key="item.quartersId"
                           :label="item.name"
                           :value="item.quartersId">

                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="楼栋"
                          style="margin-bottom:0px">
              <el-select v-model="listQuery.buildsId"
                         size="small"
                         placeholder="请选择楼栋">
                <el-option v-for="item in buildsList"
                           size="small"
                           :key="item.buildsId"
                           :label="item.buildsName"
                           :value="item.buildsId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="单元名"
                          style="margin-bottom:0px">
              <el-select v-model="listQuery.unitId"
                         size="small"
                         @change="handleFilter"
                         placeholder="请选择单元名">
                <el-option v-for="item in unitList"
                           size="small"
                           :key="item.unitId"
                           :label="item.unitName"
                           :value="item.unitId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="房间号"
                          style="margin-bottom:0px">
              <el-input placeholder="请输入房间号"
                        style="display: inline-block;width: 100%;"
                        size="small"
                        v-model="listQuery.roomNum"
                        @keyup.native.enter='handleFilter'
                        clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1"
                  :offset="1">
            <el-button size="small"
                       class="search-btn-small"
                       type="primary"
                       @click="handleFilter">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="layout-pages-content">
      <p class="total-number">(共<span>{{total}}</span>条数据)</p>
      <el-button type="success"
                 size="mini"
                 class="btn-opearator"
                 v-if="add_rooms"
                 @click="handleAdd">添加新房间</el-button>
      <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 v-if="del_rooms"
                 @click="handleDel">删除</el-button>
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
                         label="小区">
          <template slot-scope="scope">
            <span v-if="false">{{scope.row}}</span>
            <span>{{ scope.row.quarterName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="楼栋名称">
          <template slot-scope="scope">
            <span v-if="false">{{scope.row}}</span>
            <span>{{scope.row.buildName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="单元名">
          <template slot-scope="scope">
            <span v-if="false">{{scope.row}}</span>
            <span>{{scope.row.unitName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="房间号">
          <template slot-scope="scope">
            <span>{{scope.row.roomNum}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="房间号呼叫号">
          <template slot-scope="scope">
            <span>{{scope.row.callNo}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center"
                         label="房间类型">
          <template slot-scope="scope">
            <span>{{scope.row.types}}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center"
                         label="管理">
          <template slot-scope="scope">
            <span class="btn-opearator btn-edit"
                  v-if="update_rooms"
                  @click="handleUpdate(scope.row)">编辑&nbsp;/&nbsp;</span>
            <span class="btn-opearator"
                  @click='handleDetail(scope.row)'>详情&nbsp;/&nbsp;</span>
            <span class="btn-opearator"
                  @click='handleSeeDetail(scope.row)'>房间人员</span>
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
    <el-dialog title="房间人员管理"
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
                         label="小区名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date"
                         align="center"
                         label="呼叫编号">
          <template slot-scope="scope">
            <span>{{ scope.row.quarterCallNo }}</span>
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
                         label="姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.fullName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date"
                         align="center"
                         label="手机号">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 编辑、详情、添加 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="formDialogVisible">
      <el-form :model="roomForm"
               :rules="rules"
               ref="roomForm"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="单元名称"
                          prop="unitId">
              <el-select v-model="roomForm.unitId"
                         size="small"
                         clearable
                         :disabled="dialogStatus=== 'detail'"
                         placeholder="请选择楼栋">
                <el-option v-for="item in unitList"
                           size="small"
                           :key="item.unitId"
                           :label="item.unitName"
                           :value="item.unitId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="房间号"
                          prop="roomNum">
              <el-input v-model="roomForm.roomNum"
                        clearable
                        :disabled="dialogStatus=== 'detail'"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="房间呼叫号"
                          prop="callNo">
              <el-input v-model="roomForm.callNo"
                        size="small"
                        clearable
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
                   v-if="dialogStatus=== 'create'"
                   @click="handleSubmit('roomForm')">确 定</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'update'"
                   @click="handleUptForm('roomForm')">更 新</el-button>
        <el-button type="primary"
                   v-if="dialogStatus=== 'detail'"
                   @click="formDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { addObj, updateObj, delObj, getListObj, getSingleObj, getRoomOwnerListByRoomId } from '@/api/rooms'
import { isNumber } from '@/api/validator'
import { getQuarterByRole } from '@/api/village'
import { mapGetters } from 'vuex'
import { getUnitListByBuildId } from '@/api/village'
import { filterError } from "@/util/filterError"
export default {
  data() {
    return {
      tableData: [],
      formDialogVisible1: false,
      add_rooms: false,
      update_rooms: false,
      del_rooms: false,
      listQuery: {
        limit: 20,
        page: 1,
        buildsId: '',
        unitId: '',
        room: ''
      },
      tableData1: null,
      buildsList: [],
      villageList: [],
      unitList: [],
      listLoading: false,
      list: [],
      total: 0,
      formDialogVisible: false,
      multipleSelection: [],
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建',
        detail: '详情'
      },
      roomForm: {
        roomNum: undefined,
        roomId: undefined,
        callNo: undefined,
        unitId: undefined,
        types: undefined
      },
      rules: {
        roomNum: [
          { required: true, message: '请输入单元名称', trigger: 'blur' }
        ],
        unitId: [
          { required: true, message: '请选择单元所在的楼栋名称', trigger: 'change' }
        ],
        types: [
          { required: true, message: '请选择单元所在的楼栋名称', trigger: 'change' }
        ],
        callNo: [
          { required: true, message: '请选择单元呼叫号', trigger: 'blur' },
          {
            validator: isNumber, trigger: 'blur'
          }
        ]
      },
      allData: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
    'listQuery.buildsId': function(val) {
      if (val) {
        this.handlChangeBuild(val)
      }
    }
  },
  created() {
    this.add_rooms = this.permissions['add_rooms']
    this.update_rooms = this.permissions['update_rooms']
    this.del_rooms = this.permissions['del_rooms']
  },
  mounted() {
    this.handleGetAllListObj()
  },
  methods: {
    /**
     * desc 获取单元
     */
    async handlChangeBuild(val) {
      this.unitList = []
      this.listQuery.unitId = undefined
      try {
        const res = ({ data: { data: this.unitList } } = await getUnitListByBuildId({ buildsId: val }))
        await filterError(res, 'notify');
        if (Array.isArray(this.unitList) && this.unitList.length > 0) {
          ([{ unitId: this.listQuery.unitId }] = this.unitList)
        } else {
          this.tableData = []
          this.$notify({  title: '警告',  message: '此楼栋暂未添加单元',  type: 'warning' })
          return;
        }
        this.handleFilter()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 查看房间人员
     */
    async handleSeeDetail({ roomId }) {
      try {
        ({ data: { data: this.tableData1 } } = await getRoomOwnerListByRoomId({ roomId }))
        this.formDialogVisible1 = true;
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 选择小区
     */
    handleQuartChange() {

      ([ { buildList: this.buildsList } ] = this.villageList.filter(item => item.quartersId === this.listQuery.quartersId))

      this.handleBuilding();
    },

    /**
     * desc 设置楼栋
     */
    handleBuilding() {
      const { buildsList } = this;
      if (!buildsList.length) {
        this.tableData = []
        this.listQuery = { ...this.listQuery, buildsId: '', unitId: '' }

        this.$notify({ title: '警告', message: '此小区暂未添加楼栋', type: 'warning' })
        return;
      }

      ([{ buildsId: this.listQuery.buildsId }] = buildsList)
    },

    /**
     * desc 初始化小区
     */
    async handleGetAllListObj() {

      try {
        ({data: { data: this.villageList }} = await getQuarterByRole());
        if (!this.villageList.length) {
          this.tableData = []
          this.$notify({  title: '警告',  message: '此楼栋暂时未添加小区',  type: 'warning'})
          return;
        }
        ([{ quartersId: this.listQuery.quartersId, buildList: this.buildsList }] = this.villageList);
        ([{ buildsId: this.listQuery.buildsId }] = this.buildsList);
        setTimeout(() => { this.getList() }, 300)
      }catch(err) {
        console.log(err)
      }

    },

    /**
     * desc 获取列表
     */
    async getList() {
      const { listQuery: { unitId } } = this
      try {
        if (!unitId) return;
        this.listLoading = true
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
     * desc 触发添加房间按钮
     */
    handleAdd() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.formDialogVisible = true
    },

    /**
     * desc 创建房间
     */
    async handleSubmit(formName) {

      try {
        await this.$refs[formName].validate()
        const res = await addObj(this.roomForm)
        await filterError(res, 'notify', 1)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 触发编辑
     */
    handleUpdate(rows) {
      this.dialogStatus = 'update'
      Object.assign(this.roomForm, rows)
      this.formDialogVisible = true
    },

    /**
     * desc 更新数据
     */
    async handleUptForm(formName) {

      try {
        await this.$refs[formName].validate();
        const res = await updateObj(this.roomForm);
        filterError(res, 'notify', 2)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 删除房间
     */
    async handleDel() {
      const { multipleSelection } = this;
      if (!multipleSelection.length) {
        this.$notify({ title: '失败', message: '请选择要删除的数据', type: 'error' })
        return;
      }

      try {
        await this.$confirm('此操作将删除该条数据, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        let delIds = { ids: '' }
        multipleSelection.forEach(item => { delIds.ids += item.roomId + ','})
        delIds.ids = delIds.ids.substring(0, delIds.ids.length - 1)
        const res = await delObj(delIds)
        await filterError(res, 'notify', 4)
        this.formDialogVisible = false
        this.getList()
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 重置表单
     */
    resetTemp() {
      this.roomForm = {
        roomId: undefined,
        roomNum: undefined,
        unitId: undefined,
        callNo: undefined,
        types: undefined
      }
    },
    /**
     * desc 查看详情
     */
    async handleDetail({ roomId }) {

      try {
        const res = ({ data: { data: this.roomForm } } = await getSingleObj(roomId))
        await filterError(res, 'notify')
        this.dialogStatus = 'detail'
        this.formDialogVisible = true
      }catch(err) {
        console.log(err)
      }
    }
  }
}
</script>
