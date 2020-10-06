<template>
  <div v-if="tokenPhotoFlag">
    <div>
      <p class="layout-pages-title-sec">设备拍照注册</p>
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
                 @click="handleAdd">确定</el-button>
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
                     :page-sizes="[10, 20, 30, 50]"
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
    <el-dialog :visible.sync="tokingPhotoDialog"
               :before-close="handleClose"
               width="30%">
      <div class="photo-taking">
        <img :src="registerByPhoto">
        <p>进入拍照模式，请站立在设备面前 <span style="color: #0092DF;margin-left: 10px;">{{count}} s</span></p>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import registerByPhoto from '@/assets/img/registerByPhoto.png'
import { getListObj } from '@/api/personManger'
import { selectDevicePersionList, openRegistration, getRegisteration, cancel } from '@/api/gateDevice'
export default {
  props: {
    TPLQ: Object,
    tokenPhotoFlag: Boolean,
    propsTitle: Object
  },
  data() {
    return {
      list: [],
      total: 0,
      tokePhotoTableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        quartersId: undefined
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
    handleClose(row) {
      const cencelObj = { deviceKey: this.propsTitle.deviceKey, guid: this.multipleSelection[0].id, taskId: this.taskId, state: 4 }
      cancel(cencelObj).then(res => {
        if (res.data.code === 'GS_SUS211') {
          this.getList()
          this.$notify({
            title: '提示',
            message: '拍照结束',
            type: 'success'
          })
        }
      })
      this.tokingPhotoDialog = false
    },
    handleShowDetail(row) {
      this.dialogPhoto = row
      this.photoShowDialog = true
    },
    handleCancel() {
      this.$emit('handleChangeFlag')
    },
    // 定时60s
    handleCycleDevice() {
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        const obj = { 'type': 1, deviceKey: this.propsTitle.deviceKey, personGuid: this.multipleSelection[0].id }
        openRegistration(obj).then(res => {
          if (res.data.code === 0) {
            const searchObj = { deviceKey: this.propsTitle.deviceKey, guid: this.multipleSelection[0].id, taskId: res.data.data.data }
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
                      this.handleClose()
                      clearInterval(this.timer)
                      this.timer = null
                      this.$notify({
                        title: '完成',
                        message: '拍照结束',
                        type: 'success'
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
            this.$notify({
              title: '失败',
              message: '只能注册一条数据',
              type: 'error'
            })
          }
        })
      }
    },
    handleAdd() {
      if (this.multipleSelection.length) {
        if (this.multipleSelection.length === 1) {
          if (this.multipleSelection[0].image.length >= 3) {
            // 照片数量已超出限制！
            this.$notify({
              title: '失败',
              message: '照片数量已超出限制!',
              type: 'error'
            })
          } else {
            this.tokingPhotoDialog = true
            this.handleCycleDevice()
          }
        } else {
          this.$notify({
            title: '失败',
            message: '只能注册一条数据',
            type: 'error'
          })
        }
      } else {
        this.$notify({
          title: '失败',
          message: '请选择要注册的数据',
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
.layout-pages-pagination {
  margin: 30px auto 0;
  text-align: center;
  .el-pagination {
    display: inline-block;
  }
}
.form-setting {
  line-height: 24px;
  font-size: 16px;
  color: #666666;
  border-radius: 5px;
  padding: 10px 0px 10px;
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

