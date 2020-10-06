<template>
  <div v-if="deviceAuthorizeFlag">
    <div>
      <p class="layout-pages-title-sec">人员授权</p>
      <el-row class="tokenPhote-title-detail">
        <el-col :span="12">设备名称：{{propsTitle.name}}</el-col>
        <el-col :span="12">设备序列号：{{propsTitle.deviceKey}}</el-col>
      </el-row>
    </div>
    <div class="layout-pages-search">
      <el-row>
        <el-col :span='3'>
          <el-select v-model="photoSearchLabel"
                     size="small"
                     @change="handlePhotoSearchLabel"
                     class="searchSelect">
            <el-option v-for="item in tokenSearchList"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='3'
                v-if="photoSearchLabel === 0">
          <el-input placeholder="请输入姓名"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.name"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
        </el-col>
        <el-col :span='3'
                v-if="photoSearchLabel === 1">
          <el-input placeholder="请输入Guid"
                    size="small"
                    class="search-btn"
                    v-model="listQuery.guid"
                    @keyup.native.enter='handleFilter'
                    clearable>
          </el-input>
        </el-col>
        <el-col :span='1'
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
                 @click="handleAddAuth">授权</el-button>
      <el-button type="warning"
                 size="mini"
                 class="btn-opearator"
                 @click="handleDelAuth">撤权</el-button>
      <el-button type="danger"
                 size="mini"
                 class="btn-opearator"
                 @click="handleCancel">取消</el-button>
      <el-table :data="tokePhotoTableData"
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
                         label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.fullName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="Guid">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="照片">
          <template slot-scope="scope">
            <template v-if="scope.row.image">
              <template v-for="(item,index) in scope.row.image">
                <img :src="item"
                     @click="handleShowDetail(item)"
                     class="table-img"
                     :key="index">
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="照片注册状态">
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
    <el-dialog :visible.sync="photoShowDialog"
               width="30%">
      <img :src="dialogPhoto"
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
import { mapGetters } from 'vuex'
import registerByPhoto from '@/assets/img/registerByPhoto.png'
import { selectDevicePersionList, setPeople, deleteSomePeople } from '@/api/gateDevice'
import { getListObj } from '@/api/personManger'
export default {
  props: {
    TPLQ: Object,
    deviceAuthorizeFlag: Boolean,
    propsTitle: Object
  },
  data() {
    return {
      list: [],
      total: 0,
      tokePhotoTableData: [],
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined,
        appId: undefined,
        appKey: undefined,
        appSecret: undefined
      },
      multipleSelection: [],
      photoSearchLabel: 0,
      tokenSearchList: [{
        id: 0,
        label: '姓名'
      }, {
        id: 1,
        label: 'Guid'
      }],
      listLoading: false,
      photoShowDialog: false,
      dialogPhoto: '',
      ujQuartersName: '',
      registerByPhoto: registerByPhoto,
      tokingPhotoDialog: false,
      timer: null,
      count: '',
      taskId: ''
    }
  },
  created() {

  },
  watch: {
    propsTitle(val) {
      if (this.propsTitle.quartersId) {
        this.listQuery.quartersId = this.propsTitle.quartersId
        this.getList()
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
  },
  methods: {
    getList() {
      this.listLoading = true
      getListObj(this.listQuery).then(res => {
        this.listLoading = false
        if (res.data.code === 0) {
          this.total = res.data.data.pageResult.total
          this.tokePhotoTableData = res.data.data.pageResult.records
          this.ujQuartersName = res.data.data.ujQuartersName
          this.tokePhotoTableData.forEach(item => {
            if (item.image) {
              item.image = item.image.split(',')
            }
            if (item.image !== null) {
              if (item[item.length] === '') {
                item.image.pop()
              }
            }
          })
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
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
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handlePhotoSearchLabel() {
      if (this.photoSearchLabel === 0) {
        this.listQuery.name = undefined
      } else if (this.photoSearchLabel === 0) {
        this.listQuery.guid = undefined
      }
    },
    handleShowDetail(row) {
      this.dialogPhoto = row
      this.photoShowDialog = true
    },
    handleCancel() {
      this.$emit('handleChangeFlag')
    },
    handleAddAuth() {
      const obj = {
        deviceKey: this.propsTitle.deviceKey,
        personGuids: ''
      }
      if (this.multipleSelection.length) {
        this.multipleSelection.forEach(item => {
          obj.personGuids += item.id + ','
        })
        obj.personGuids = obj.personGuids.substring(0, obj.personGuids.length - 1)
        setPeople(obj).then(res => {
          if (res.data.code === 0) {
            this.getList()
            this.$notify({
              title: '成功',
              message: '授权成功',
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
      } else {
        this.$notify({
          title: '失败',
          message: '请选择授权人员',
          type: 'error'
        })
      }
    },
    handleDelAuth() {
      const obj = {
        deviceKey: this.propsTitle.deviceKey,
        personGuids: ''
      }
      if (this.multipleSelection.length) {
        this.multipleSelection.forEach(item => {
          obj.personGuids += item.id + ','
        })
        obj.personGuids = obj.personGuids.substring(0, obj.personGuids.length - 1)
        deleteSomePeople(obj).then(res => {
          if (res.data.code === 0) {
            this.getList()
            this.$notify({
              title: '成功',
              message: '撤权成功',
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
      } else {
        this.$notify({
          title: '失败',
          message: '请选择撤权人员',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss">
.content-device {
  padding-top: 0;
  padding-bottom: 0;
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

