<template>
  <div>
    <div v-if="!(tokenPhotoFlag ||deviceAuthorizeFlag)">
      <el-row :gutter="20"
              class="device-content">
        <el-col :span="4"
                class="device-left-content">
          <el-card class="device-card">
            <p class="device-card-title">请选择小区</p>
            <div class="device-card-input">
              <el-input placeholder="请输入搜索的小区"
                        size="small"
                        @keyup.native.enter='handleUjQuarters'
                        v-model="UjLisQueryName.name">
                <i slot="suffix"
                   class="el-input__icon el-icon-search"
                   @click="handleUjQuarters"></i>
              </el-input>
            </div>
            <p v-for="item in UjQuartersList"
               :key="item.quartersId"
               @click='hanleQjusrter(item)'
               class="device-left-list"
               :class="(item.quartersId)===activeItem?'device-left-list-active':''">
              {{item.name}}
            </p>
          </el-card>
        </el-col>
        <el-col :span="20"
                class="device-right-content">
          <el-card class="device-card">
            <deviceTableList :query='query'
                             @handleAuth='handleAuth'
                             @handleTokenPhoto='handleTokenPhoto'
                             :quartersName='quartersName'></deviceTableList>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 设备拍照注册 -->
    <tokenPhotoList :TPLQ='tokenPhotoListQuery'
                    :tokenPhotoFlag='tokenPhotoFlag'
                    :propsTitle='propsTitle'
                    @handleChangeFlag='handleChangeFlag'></tokenPhotoList>
    <deviceAuthorize :TPLQ='tokenPhotoListQuery'
                     :deviceAuthorizeFlag='deviceAuthorizeFlag'
                     :propsTitle='propsTitle'
                     @handleChangeFlag='handleChangeFlag'></deviceAuthorize>
  </div>
</template>

<script>
import { selectUjQuarters } from '@/api/gateDevice'
import deviceTableList from './deviceTableList'
import tokenPhotoList from './tokenPhotoList'
import deviceAuthorize from './deviceAuthorize'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      UjLisQueryName: {
        name: ''
      },
      UjQuartersList: [],
      activeItem: 0,
      query: {
        // appId: '',
        // appKey: '',
        // appSecret: ''，
        quartersId: ''
      },
      // appId: '',
      quartersName: '',
      tokenPhotoFlag: false,
      tokenPhotoListQuery: {},
      propsTitle: {},
      deviceAuthorizeFlag: false,
      look_deviceState: false,
      set_authPeople: false,
      del_gateDevice: false,
      upgrade_device: false,
      sync_device: false,
      update_gateDevice: false,
      jiaodui_device: false,
      reset_device: false,
      add_gateDevice: false
    }
  },
  components: {
    deviceTableList,
    tokenPhotoList,
    deviceAuthorize

  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.look_deviceState = this.permissions['look_deviceState']
    this.set_authPeople = this.permissions['set_authPeople']
    this.del_gateDevice = this.permissions['del_gateDevice']
    this.upgrade_device = this.permissions['upgrade_device']
    this.sync_device = this.permissions['sync_device']
    this.update_gateDevice = this.permissions['update_gateDevice']
    this.jiaodui_device = this.permissions['jiaodui_device']
    this.reset_device = this.permissions['reset_device']
    this.add_gateDevice = this.permissions['add_gateDevice']
  },
  mounted() {
    this.handleUjQuarters()
  },
  methods: {
    resetQueryTemp() {
      this.query = {
        // appId: '',
        // appKey: '',
        // appSecret: ''
        quartersId: ''
      }
    },
    handleUjQuarters() {
      selectUjQuarters(this.UjLisQueryName).then(res => {
        if (res.data.code === 0) {
          this.resetQueryTemp()
          this.UjQuartersList = res.data.data
          this.activeItem = this.UjQuartersList[0].quartersId
          // this.query.appId = this.UjQuartersList[0].appId
          // this.query.appKey = this.UjQuartersList[0].appKey
          // this.query.appSecret = this.UjQuartersList[0].appSecret
          this.query.quartersId = this.UjQuartersList[0].quartersId
          this.quartersName = this.UjQuartersList[0].name
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    hanleQjusrter(row) {
      this.resetQueryTemp()
      this.activeItem = row.quartersId
      this.query.quartersId = row.quartersId
      // this.query.appId = row.appId
      // this.query.appKey = row.appKey
      // this.query.appSecret = row.appSecret
      this.quartersName = row.name
    },
    handleTokenPhoto(row) {
      this.tokenPhotoFlag = true
      const obj = {
        // appId: row.row.appId,
        deviceKey: row.row.deviceKey,
        page: 1,
        limit: 10
      }
      const propsTitle = {
        deviceKey: row.row.deviceKey,
        name: row.row.name,
        quartersId: row.row.quartersId
        // appId: row.row.appId,
        // appKey: this.query.appKey,
        // appSecret: this.query.appSecret
      }
      this.tokenPhotoListQuery = {}
      Object.assign(this.tokenPhotoListQuery, obj)
      this.propsTitle = {}
      Object.assign(this.propsTitle, propsTitle)
    },
    handleAuth(row) {
      this.deviceAuthorizeFlag = true
      const obj = {
        // appId: row.row.appId,
        deviceKey: row.row.deviceKey,
        page: 1,
        limit: 10
      }
      const propsTitle = {
        deviceKey: row.row.deviceKey,
        name: row.row.name,
        quartersId: row.row.quartersId
        // appId: row.row.appId,
        // appKey: this.query.appKey,
        // appSecret: this.query.appSecret
      }
      this.tokenPhotoListQuery = {}
      Object.assign(this.tokenPhotoListQuery, obj)
      this.propsTitle = {}
      Object.assign(this.propsTitle, propsTitle)
    },
    handleChangeFlag() {
      this.tokenPhotoFlag = false
      this.deviceAuthorizeFlag = false
      this.handleUjQuarters()
    }
  }
}
</script>

<style lang="scss" >
.device-content {
  position: absolute;
  top: 80px;
  bottom: 35px;
  left: 25px;
  right: 20px;
  overflow: hidden;
  .device-left-content,
  .device-right-content {
    padding-left: 0px !important;
    height: 100%;
    .el-card {
      overflow: auto;
    }
    .device-card {
      height: 100%;
      padding: 8px;
      .el-card__body {
        padding: 6px;
        .device-card-title {
          padding-bottom: 16px;
          font-weight: 500;
        }
        .device-card-input {
          margin-bottom: 16px;
          width: 80%;
          margin-left: auto;
          margin-right: auto;
        }
        .device-left-list {
          font-size: 14px;
          cursor: pointer;
          padding-left: 20px;
          color: #a3a3a3;
        }
        .device-left-list-active {
          color: #409eff;
        }
      }
    }
  }
}
</style>