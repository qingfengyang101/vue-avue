<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter"
                style="width: 200px;"
                size="small"
                class="filter-item"
                placeholder="账号"
                v-model="listQuery.username">
      </el-input>
      <el-button class="filter-item"
                 type="success"
                 size="small"
                 v-waves
                 icon="search"
                 @click="handleFilter">搜索</el-button>
      <el-button v-if="sys_user_add"
                 class="filter-item"
                 style="margin-left: 10px;"
                 @click="handleCreate"
                 size="small"
                 type="primary"
                 icon="edit">添加
      </el-button>
    </div>

    <el-table :key='tableKey'
              :data="list"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border
              fit
              highlight-current-row
              style="width: 99%">

      <el-table-column align="center"
                       type="index"
                       width="50">
      </el-table-column>
      <el-table-column align="center"
                       label="账号">
        <template slot-scope="scope">
          <span>
            {{scope.row.username}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="角色">
        <template slot-scope="scope">
          <span>{{scope.row.roleCode}} </span>
        </template>
      </el-table-column>

      <!--<el-table-column align="center" label="创建时间">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{scope.row.createTime | moment('YYYY-MM-DD HH:mm')}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!-- 
      <el-table-column align="center"
                       class-name="status-col"
                       label="状态">
        <template slot-scope="scope">
          <el-tag>{{scope.row.delFlag | statusFilter}}</el-tag>
        </template>
      </el-table-column> -->

      <el-table-column align="center"
                       label="操作"
                       width="280">
        <template slot-scope="scope">
          <el-button v-if="sys_user_upd && userInfo.username !== scope.row.username"
                     size="small"
                     type="success"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="sys_user_del && userInfo.username !== scope.row.username"
                     size="small"
                     type="danger"
                     @click="deletes(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading"
         class="pagination-container">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号"
                          prop="username">
              <el-input v-model="form.username"
                        placeholder="请输账号"
                        size="small"
                        :disabled="dialogStatus === 'update'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名"
                          prop="nickname">
              <el-input v-model="form.nickname"
                        size="small"
                        placeholder="请输用户名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色"
                          prop="role">
              <el-select class="filter-item"
                         v-model="form.role"
                         size="small"
                         @change="handleRole"
                         placeholder="请选择">
                <el-option v-for="item in rolesOptions"
                           :key="item.roleId"
                           :label="item.roleCode"
                           :value="item.roleId"
                           :disabled="isDisabled[item.delFlag]">
                  <span style="float: left">{{ item.roleDesc }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.roleCode }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分配小区"
                          v-if="deptIdShow"
                          size="small"
                          prop="deptId">
              <el-select class="filter-item"
                         v-model="form.deptId"
                         placeholder="请选择">
                <el-option v-for="item in villageList"
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
            <el-form-item label="手机号"
                          size="small"
                          prop="phone">
              <el-input v-model="form.phone"
                        placeholder="验证码登录使用"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="dialogStatus == 'create'"
                          label="密码"
                          placeholder="请输入密码"
                          prop="password">
              <el-input type="password"
                        size="small"
                        v-model="form.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="状态"
                      v-if="dialogStatus == 'update' && sys_user_del "
                      prop="delFlag">
          <el-select class="filter-item"
                     v-model="form.delFlag"
                     placeholder="请选择">
            <el-option v-for="item in statusOptions"
                       :key="item"
                       :label="item | statusFilter"
                       :value="item"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'"
                   type="primary"
                   @click="create('form')">确 定</el-button>
        <el-button v-else
                   type="primary"
                   @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, getObj, putObj, getCurrentRole } from '@/api/user'
import { getAllListObj } from '@/api/village'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { validatePhone } from '@/api/validator'
// import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
import ElOption from 'element-ui/packages/select/src/option'

export default {
  components: {
    ElOption,
    ElRadioGroup
  },
  name: 'table_user',
  directives: {
    waves
  },
  data() {
    var unicodeVal = (rule, value, callback) => {
      // const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      const mailReg = /[\u4E00-\u9FA5]/
      if (!value) {
        return callback(new Error('账号不能为空'))
      }
      setTimeout(() => {
        if (!mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('账号为英文、下划线、数字组合'))
        }
      }, 100)
    }
    return {
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      form: {
        username: undefined,
        nickname: undefined,
        password: undefined,
        // delFlag: undefined,
        role: undefined,
        phone: undefined,
        deptId: undefined
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入账户',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          },
          { validator: unicodeVal, trigger: 'blur' }
        ],
        nickname: [
          {
            required: true,
            message: '请输入账户',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        role: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '手机号',
            trigger: 'blur'
          },
          {
            validator: validatePhone,
            trigger: 'blur'
          }
        ]
      },
      // statusOptions: ['0', '9'],
      rolesOptions: [],
      dialogFormVisible: false,
      userAdd: false,
      userUpd: false,
      userDel: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      isDisabled: {
        0: false,
        1: true
      },
      tableKey: 0,
      deptIdShow: true,
      villageList: []
    }
  },
  computed: {
    ...mapGetters(['permissions', 'userInfo'])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '有效',
        1: '无效',
        9: '锁定'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
    this.sys_user_add = this.permissions['sys_user_add']
    this.sys_user_upd = this.permissions['sys_user_upd']
    this.sys_user_del = this.permissions['sys_user_del']
    this.sys_user_reset = this.permissions['sys_user_reset']
    this.handleGetCurrentRole()
    this.hanledGetAllListObj()
  },
  methods: {
    hanledGetAllListObj() {
      getAllListObj().then(res => {
        this.villageList = res.data.data
      })
    },
    getList() {
      this.listLoading = true
      this.listQuery.isAsc = false
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleGetCurrentRole() {
      getCurrentRole().then(res => {
        this.rolesOptions = res.data.data
      })
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.resetTemp()
      getObj(row.id).then(response => {
        this.form = response.data.data
        this.handleRole()
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then((res) => {
            if (res.data.data) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.password = undefined
          putObj(this.form).then((res) => {
            if (res.data.data) {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    deletes(row) {
      this.$confirm(
        '此操作将永久删除该用户(账号:' + row.username + '), 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        delObj(row.id)
          .then((res) => {
            if (res.data.code === 0) {
              this.getList()
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: res.data.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
          .catch(() => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
      })
    },
    resetTemp() {
      this.form = {
        id: undefined,
        username: '',
        nickname: '',
        password: '',
        role: '',
        // delFlag: '',
        phone: '',
        deptId: ''
      }
    },
    handleRole() {
      this.rolesOptions.forEach(item => {
        if (this.form.role === item.roleId) {
          this.form.roleCode = item.roleCode
        }
      })
      if (this.form.roleCode !== 'ROLE_ADMIN') {
        this.deptId = ''
        this.deptIdShow = true
      } else {
        this.deptIdShow = false
      }
    }
  }
}
</script>
<style>
.resetTip {
  text-align: center;
  font-size: 18px;
  font-weight: 700;
}
</style>
