

<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item"
                 style="margin-left: 10px;"
                 @click="handleCreate"
                 v-if="roleManager_btn_add"
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
      <el-table-column label="角色名称"
                       align="center">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="角色标识">
        <template slot-scope="scope">
          <span>{{scope.row.roleCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="角色描述">
        <template slot-scope="scope">
          <span>{{scope.row.roleDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | moment('YYYY-MM-DD HH:mm')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       align="center"
                       width="220">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="success"
                     v-if="roleManager_btn_edit && roles !== scope.row.roleCode"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="mini"
                     type="danger"
                     v-if="roleManager_btn_del && roles !== scope.row.roleCode"
                     @click="handleDelete(scope.row)">删除
          </el-button>
          <el-button size="mini"
                     type="info"
                     v-if="roleManager_btn_perm && roles !== scope.row.roleCode"
                     plain
                     @click="handlePermission(scope.row)">权限
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
            <el-form-item label="角色名称"
                          prop="roleName">
              <el-input v-model="form.roleName"
                        size="small"
                        placeholder="角色名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色标识"
                          prop="roleCode">
              <el-input v-model="form.roleCode"
                        size="small"
                        placeholder="角色标识"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述"
                          prop="roleDesc">
              <el-input v-model="form.roleDesc"
                        size="small"
                        placeholder="描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogPermissionVisible">
      <el-tree class="filter-tree"
               :data="treeData"
               :default-checked-keys="checkedKeys"
               :check-strictly="false"
               node-key="id"
               highlight-current
               :props="defaultProps"
               show-checkbox
               ref="menuTree"
               :filter-node-method="filterNode"
               default-expand-all>
      </el-tree>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="updatePermession(roleId, roleCode)">更 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  permissionUpd,
  fetchRoleTree
} from '@/api/role'
import { fetchTree } from '@/api/menu'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { validatAlphabetsAnd } from '@/util/validate'

export default {
  name: 'table_role',
  directives: {
    waves
  },
  data() {
    var checkLetter = (rule, value, callback) => {
      if (!validatAlphabetsAnd(value)) {
        callback('只能输入由数字和26个英文字母或者下划线组成的字符串')
      } else {
        callback()
      }
    }

    return {
      treeData: [],
      checkedKeys: [],
      menuIds: '',
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
        roleName: undefined,
        roleCode: undefined,
        roleDesc: undefined
      },
      roleId: undefined,
      roleCode: undefined,
      rules: {
        roleName: [
          {
            required: true,
            message: '角色名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        roleCode: [
          {
            required: true,
            message: '角色标识',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
          // { validator: checkLetter, trigger: 'blur' }
        ],

        roleDesc: [
          {
            required: true,
            message: '角色标识',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      statusOptions: ['0', '1'],
      rolesOptions: undefined,
      dialogFormVisible: false,
      dialogPermissionVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        permission: '分配权限'
      },
      tableKey: 0,
      roleManager_btn_add: false,
      roleManager_btn_edit: false,
      roleManager_btn_del: false,
      roleManager_btn_perm: false
    }
  },
  created() {
    this.getList()
    this.roleManager_btn_add = this.permissions['sys_role_add']
    this.roleManager_btn_edit = this.permissions['sys_role_edit']
    this.roleManager_btn_del = this.permissions['sys_role_del']
    this.roleManager_btn_perm = this.permissions['sys_role_perm']
  },
  computed: {
    ...mapGetters(['elements', 'permissions', 'roles'])
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
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
      getObj(row.roleId).then(response => {
        this.form = response.data.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    handlePermission(row) {
      fetchRoleTree(row.roleCode)
        .then(response => {
          this.checkedKeys = response.data
          return fetchTree()
        })
        .then(response => {
          this.treeData = response.data
          this.checkedKeys = this.resolveAllLeafNodeId(this.treeData, this.checkedKeys, [])
          this.dialogStatus = 'permission'
          this.dialogPermissionVisible = true
          this.roleId = row.roleId
          this.roleCode = row.roleCode
        })
    },
    /**
     * 解析出所有的叶子节点id
     * @param json 待解析的json串
     * @param idArr 原始节点数组
     * @param temp 临时存放节点id的数组
     * @return 叶子节点id数组
     */
    resolveAllLeafNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllLeafNodeId(item.children, idArr, temp)
        } else {
          temp.push(idArr.filter(id => id === item.id))
        }
      }
      return temp
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleDelete(row) {
      delObj(row.roleId).then(response => {
        this.dialogFormVisible = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
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
          putObj(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    updatePermession(roleId, roleCode) {
      this.menuIds = ''
      this.menuIds = this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
      permissionUpd(roleId, this.menuIds).then(() => {
        this.dialogPermissionVisible = false
        fetchTree()
          .then(response => {
            this.treeData = response.data
            return fetchRoleTree(roleCode)
          })
          .then(response => {
            this.checkedKeys = response.data
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
      })
    },
    resetTemp() {
      this.form = {
        id: undefined,
        roleName: undefined,
        roleCode: undefined,
        roleDesc: undefined
      }
    }
  }
}
</script>
