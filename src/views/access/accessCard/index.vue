<template>
  <div>
    <h2 class="layout-pages-title">门禁卡列表</h2>
    <div class="layout-pages-search" style="width:100%">
      <el-row>
        <el-col :span="3">
          <el-select
            v-model="listQuery.quartersId"
            size="small"
            clearable
            @change="handleFilter"
            placeholder="请选择小区"
          >
            <el-option
              v-for="item in villageOptions"
              size="small"
              :key="item.quartersId"
              :label="item.name"
              :value="item.quartersId"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="请输入用户卡号"
            size="small"
            class="search-btn"
            v-model="listQuery.userCardNo"
            @keyup.native.enter="handleFilter"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="请输入门禁IC号"
            size="small"
            class="search-btn"
            v-model="listQuery.doorIc"
            @keyup.native.enter="handleFilter"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="请输入手机号"
            size="small"
            class="search-btn"
            v-model="listQuery.mobile"
            @keyup.native.enter="handleFilter"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="1">
          <el-button size="small" type="primary" @click="handleFilter">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="layout-pages-content">
      <p class="total-number">
        (共
        <span>{{total}}</span>条数据)
      </p>
      <el-button
        type="success"
        size="mini"
        class="btn-opearator"
        v-if="add_drIdcard"
        @click="handleAdd"
      >添加门禁卡</el-button>
      <el-table
        :data="tableData"
        class="layout-pages-content-table"
        v-loading="listLoading"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column align="center" label="用户卡号">
          <template slot-scope="scope">
            <span>{{scope.row.userCardNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="内编号">
          <template slot-scope="scope">
            <span>{{scope.row.doorIc}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="卡分类">
          <template slot-scope="scope">
            <span>{{scope.row.cardType==='11'?'IC卡':'ID卡'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号">
          <template slot-scope="scope">
            <span>{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="成员">
          <template slot-scope="scope">
            <span>{{scope.row.userType === '0' ? '业主': scope.row.userType === '1' ? '家属': '' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '1'">
              <el-tag>绑定</el-tag>
            </span>
            <span v-else-if="scope.row.status === '2'">
              <el-tag type="warning">解绑</el-tag>
            </span>
            <span v-else-if="scope.row.status === '3'">
              <el-tag>授权</el-tag>
            </span>
            <span v-else-if="scope.row.status === '4'">
              <el-tag type="warning">销权</el-tag>
            </span>
            <span v-else>
              <el-tag type="warning">正常</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="小区">
          <template slot-scope="scope">
            <span>{{scope.row.qName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="楼号">
          <template slot-scope="scope">
            <span>{{scope.row.buildsName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="单元号">
          <template slot-scope="scope">
            <span>{{scope.row.unitName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="房间号">
          <template slot-scope="scope">
            <span>{{scope.row.roomName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="生效时间">
          <template slot-scope="scope">
            <span>{{scope.row.validDate }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="失效时间">
          <template slot-scope="scope">
            <span>{{scope.row.expireDate}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="220px" label="管理">
          <template slot-scope="scope">
            <p style="margin-bottom: 10px;">
              <span
                class="tag-opearte"
                v-if="update_drIdcard"
                @click="handleUpdate(scope.row)"
                effect="plain"
              >编辑</span>
              <span
                class="tag-opearte"
                @click="handleDel(scope.row)"
                v-if="del_drIdcard"
                effect="plain"
              >删除</span>
              <span
                class="tag-opearte"
                v-if="update_drIdcard"
                @click="handleBindUser(scope.row)"
                effect="plain"
              >绑定用户</span>
            </p>
            <p>
              <span
                class="tag-opearte"
                v-if="update_drIdcard"
                @click="unbindOwner(scope.row)"
                effect="plain"
              >解绑</span>
              <span
                class="tag-opearte"
                v-if="update_drIdcard"
                @click="grantAuth(scope.row)"
                effect="plain"
              >授权</span>
              <span
                class="tag-opearte"
                v-if="update_drIdcard"
                @click="cancelAuth(scope.row)"
                effect="plain"
              >销权</span>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="layout-pages-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.limit"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 编辑、详情、添加 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="formDialogVisible">
      <el-form :model="drIdcardForm" :rules="rules" ref="drIdcardForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="小区" prop="quartersId">
              <el-select
                v-model="drIdcardForm.quartersId"
                size="small"
                :disabled="dialogStatus=== 'detail'"
                placeholder="请选择小区"
              >
                <el-option
                  v-for="item in villageArr"
                  :key="item.quartersId"
                  :label="item.name"
                  :value="item.quartersId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="dialogStatus=== 'create' || dialogStatus=== 'detail'">
          <el-col :span="12">
            <el-form-item label="卡分类" prop="cardType">
              <el-radio-group v-model="drIdcardForm.cardType">
                <el-radio v-for="item in cardTypeList" :key="item.id" :label="item.id">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="dialogStatus=== 'create' || dialogStatus=== 'detail'">
          <el-col :span="12">
            <el-form-item label="用户卡号" prop="cardNo">
              <el-input
                v-model="drIdcardForm.cardNo"
                size="small"
                clearable
                :disabled="dialogStatus=== 'detail'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生效时间" prop="validDate">
              <el-date-picker
                v-model="drIdcardForm.validDate"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                :disabled="dialogStatus=== 'detail'"
                size="small"
                placeholder="选择日期时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="失效时间" prop="expireDate">
              <el-date-picker
                v-model="drIdcardForm.expireDate"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :disabled="dialogStatus=== 'detail'"
                type="datetime"
                size="small"
                placeholder="选择日期时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="formDialogVisible = false"
          v-if="dialogStatus=== 'create' || dialogStatus=== 'update'"
        >取 消</el-button>
        <el-button
          type="primary"
          v-if="dialogStatus=== 'create'"
          @click="handleSubmit('drIdcardForm')"
        >确 定</el-button>
        <el-button
          type="primary"
          v-if="dialogStatus=== 'update'"
          @click="handleUptForm('drIdcardForm')"
        >更 新</el-button>
        <el-button
          type="primary"
          v-if="dialogStatus=== 'detail'"
          @click="formDialogVisible = false"
        >关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="绑定用户" :visible.sync="bindUserDialogVisible">
      <el-form :rules="rules" label-width="100px" :model="bindUserForm" ref="bindUserForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="小区" prop="quartersId">
              <el-select
                v-model="searchList.quartersId"
                @change="handleChangeVillage"
                size="small"
                placeholder="请选择小区"
              >
                <el-option
                  v-for="item in villageArr"
                  :key="item.quartersId"
                  :label="item.name"
                  :value="item.quartersId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="楼栋" prop="buildsId">
              <el-select
                v-model="searchList.buildsId"
                @change="handleChangeBuilding"
                size="small"
                placeholder="请选择楼栋"
              >
                <el-option
                  v-for="item in buildingArr"
                  :key="item.buildsId"
                  :label="item.buildsName"
                  :value="item.buildsId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单元" prop="unitId">
              <el-select
                v-model="searchList.unitId"
                @change="handleChangeUnit"
                size="small"
                placeholder="请选择单元"
              >
                <el-option
                  v-for="item in unitArr"
                  :key="item.unitId"
                  :label="item.unitName"
                  :value="item.unitId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="房间" prop="roomId">
              <el-select
                v-model="searchList.roomId"
                @change="handleChangeRoom"
                size="small"
                placeholder="请选择房间"
              >
                <el-option
                  v-for="item in roomArr"
                  :key="item.roomId"
                  :label="item.roomNum"
                  :value="item.roomId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="userId" label="户主">
              <el-select v-model="bindUserForm.userId" size="small" placeholder="请选择户主">
                <el-option
                  v-for="item in ownerArr"
                  size="small"
                  :key="item.ownerId"
                  :label="item.fullName"
                  :value="item.ownerId"
                >
                  <span style="float: left">{{ item.fullName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bindUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleBindUpdate('bindUserForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getListObj,
  addObj,
  putObj,
  delObj,
  getSingleObj,
  bindOwnerObj,
  unbindOwner,
  cancelAuth,
  grantAuth
} from "@/api/drIdcard";
import {
  getQuarterByRole,
  getBuildsListByquartersId,
  getUnitListByBuildId,
  getRoomListByUnitId,
  getOwnerVoListByRoomId
} from "@/api/village";
import { filterError } from "@/util/filterError";
export default {
  data() {
    const startTime = (rule, value, callback) => {
      const self = this;
      if (!value) {
        return callback(new Error("生效时间不能为空"));
      }
      setTimeout(() => {
        if (self.drIdcardForm.expireDate) {
          const beginDate = self.drIdcardForm.validDate;
          const endDate = self.drIdcardForm.expireDate;
          const d1 = new Date(beginDate.replace(/\-/g, "/"));
          const d2 = new Date(endDate.replace(/\-/g, "/"));
          if (beginDate !== "" && endDate !== "" && d1 >= d2) {
            callback(new Error("开始时间不能大于结束时间！"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    const endTime = (rule, value, callback) => {
      const self = this;
      if (!value) {
        return callback(new Error("失效时间不能为空"));
      }
      setTimeout(() => {
        if (self.drIdcardForm.validDate) {
          const beginDate = self.drIdcardForm.validDate;
          const endDate = self.drIdcardForm.expireDate;
          const d1 = new Date(beginDate.replace(/\-/g, "/"));
          const d2 = new Date(endDate.replace(/\-/g, "/"));
          if (beginDate !== "" && endDate !== "" && d1 >= d2) {
            callback(new Error("结束时间不能小于开始时间！"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      add_drIdcard: false,
      update_drIdcard: false,
      del_drIdcard: false,
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
      dialogStatus: "",
      textMap: {
        update: "更新",
        create: "创建",
        detail: "详情"
      },
      drIdcardForm: {
        id: undefined,
        cardNo: undefined,
        status: undefined,
        expireDate: "",
        validDate: "",
        cardType: '11'
      },
      rules: {
        cardNo: [{ required: true, message: "请输入门禁卡", trigger: "blur" }],
        userId: [{ required: true, message: "请选择用户", trigger: "change" }],
        quartersId: [
          { required: true, message: "请选择小区", trigger: "change" }
        ],
        validDate: [{ validator: startTime, trigger: "change" }],
        expireDate: [{ validator: endTime, trigger: "change" }]
      },
      cardTypeList: [
        {
          id: '10',
          label: "id卡"
        },
        {
          id: '11',
          label: "ic卡"
        },
        {
          id: '12',
          label: "身份证"
        }
      ],
      quartersId: "",
      villageOptions: [],
      bindUserDialogVisible: false,
      villageArr: [],
      buildingArr: [],
      unitArr: [],
      roomArr: [],
      ownerArr: [],
      searchList: {
        quartersId: "",
        buildsId: "",
        unitId: "",
        roomId: ""
      },
      bindUserForm: {
        userId: undefined
      }
    };
  },
  created() {
    this.add_drIdcard = this.permissions["add_drIdcard"];
    this.update_drIdcard = this.permissions["update_drIdcard"];
    this.del_drIdcard = this.permissions["del_drIdcard"];
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  watch: {},
  mounted() {
    this.handleGetAllListObj();
  },
  methods: {
    /**
     * desc 授权
     */
    async grantAuth({ cardId: id }) {
      try {
        await this.$confirm("此操作将授权, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        const res = await grantAuth({ id });
        await filterError(res, "notify", 6);
        this.handleFilter();
      } catch (err) {
        console.log(err);
      }
    },
    /**
     * desc 销权
     */
    async cancelAuth({ cardId: id }) {
      try {
        await this.$confirm("此操作将销权, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        const res = await cancelAuth({ id });
        await filterError(res, "notify", 5);
        this.handleFilter();
      } catch (err) {
        console.log(err);
      }
    },

    /**
     * desc 解绑
     */
    async unbindOwner({ cardId: id }) {
      try {
        await this.$confirm("此操作将解绑用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        const res = await unbindOwner({ id });
        await filterError(res, "notify", 7);
        this.handleFilter();
      } catch (err) {
        console.log(err);
      }
    },

    handleGetAllListObj() {
      getQuarterByRole().then(res => {
        this.villageOptions = [];
        const requireInfo = res.data.data;
        this.allList = requireInfo;
        if (requireInfo) {
          if (requireInfo.length) {
            requireInfo.forEach(item => {
              delete item.bulidList;
              this.villageOptions.push(item);
              this.villageArr.push(item);
            });
            if (this.villageOptions.length) {
              this.listQuery.quartersId = this.villageOptions[0].quartersId;
              this.getList();
            }
          }
        }
      });
    },
    getList() {
      this.listLoading = true;
      getListObj(this.listQuery).then(res => {
        this.listLoading = false;
        if (res.data.code === 0) {
          this.total = res.data.data.total;
          this.tableData = res.data.data.records;
        } else {
          this.$notify({
            title: "失败",
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
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
    handleAdd() {
      this.dialogStatus = "create";
      this.resetForm();
      this.formDialogVisible = true;
    },
    handleSubmit(formName) {
      console.log(this.drIdcardForm)
      this.$refs[formName].validate(valid => {
        if (valid) {
          addObj(this.drIdcardForm).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false;
              this.$notify({
                title: "成功",
                message: "新增成功",
                type: "success"
              });
              this.getList();
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg,
                type: "error"
              });
            }
          });
        }
      });
    },
    handleUpdate(rows) {
      this.dialogStatus = "update";
      Object.assign(this.drIdcardForm, rows);
      this.formDialogVisible = true;
    },
    handleUptForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          putObj(this.drIdcardForm).then(res => {
            if (res.data.code === 0) {
              this.formDialogVisible = false;
              this.$notify({
                title: "成功",
                message: "编辑成功",
                type: "success"
              });
              this.getList();
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg,
                type: "error"
              });
            }
          });
        }
      });
    },
    handleDel(row) {
      this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delObj(row.cardId).then(res => {
          if (res.data.code === 0) {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success"
            });
            this.getList();
          } else {
            this.$notify({
              title: "失败",
              message: res.data.msg,
              type: "error"
            });
          }
        });
      });
    },
    resetForm() {
      this.drIdcardForm = {
        id: undefined,
        cardType: '11',
        cardNo: undefined,
        status: undefined
      };
    },
    handleDetail(rows) {
      getSingleObj(rows.cardId).then(res => {
        if (res.data.code === 0) {
          this.dialogStatus = "detail";
          this.drIdcardForm = res.data.data;
          this.formDialogVisible = true;
        } else {
          this.$notify({
            title: "失败",
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    handleBindUser(rows) {
      Object.assign(this.bindUserForm, rows);
      this.bindUserForm.userId = undefined;
      this.bindUserDialogVisible = true;
    },
    handleChangeVillage() {
      this.searchList.buildsId = undefined;
      this.searchList.unitId = undefined;
      this.searchList.roomId = undefined;
      this.bindUserForm.userId = undefined;
      this.buildingArr = [];
      this.unitArr = [];
      this.roomArr = [];
      this.ownerArr = [];
      getBuildsListByquartersId({
        quartersId: this.searchList.quartersId
      }).then(res => {
        if (res.data.code === 0) {
          this.buildingArr = res.data.data;
        } else {
          this.$notify({
            title: "失败",
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    handleChangeBuilding() {
      this.searchList.unitId = undefined;
      this.searchList.roomId = undefined;
      this.bindUserForm.userId = undefined;
      this.unitArr = [];
      this.roomArr = [];
      this.ownerArr = [];
      getUnitListByBuildId({ buildsId: this.searchList.buildsId }).then(res => {
        if (res.data.code === 0) {
          this.unitArr = res.data.data;
        } else {
          this.$notify({
            title: "失败",
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    handleChangeUnit() {
      this.searchList.roomId = undefined;
      this.bindUserForm.userId = undefined;
      this.roomArr = [];
      this.ownerArr = [];
      getRoomListByUnitId({ unitId: this.searchList.unitId }).then(res => {
        if (res.data.code === 0) {
          this.roomArr = res.data.data;
        } else {
          this.$notify({
            title: "失败",
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    handleChangeRoom() {
      this.bindUserForm.userId = undefined;
      this.ownerArr = [];
      getOwnerVoListByRoomId({ roomId: this.searchList.roomId }).then(res => {
        if (res.data.code === 0) {
          this.ownerArr = res.data.data;
        } else {
          this.$notify({
            title: "失败",
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    handleBindUpdate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          bindOwnerObj(this.bindUserForm).then(res => {
            if (res.data.code === 0) {
              this.bindUserDialogVisible = false;
              this.$notify({
                title: "成功",
                message: "编辑成功",
                type: "success"
              });
              this.getList();
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg,
                type: "error"
              });
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.tag-opearte {
  background-color: #ffffff;
  display: inline-block;
  height: 32px;
  padding: 0 10px;
  line-height: 30px;
  font-size: 12px;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  margin-left: 10px;
}
.tag-opearte:hover {
  color: #409eff;
  cursor: pointer;
  border: 1px solid #409eff;
}
</style>

