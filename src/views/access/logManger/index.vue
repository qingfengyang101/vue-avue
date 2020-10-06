<template>
  <div class="setCharge">
    <el-tabs v-model="activeName"
             type="card">
      <el-tab-pane label="一键开门记录"
                   name="onekey">
        <onekey :quartersId='quartersId'
              :villageOptions='villageOptions'></onekey>
      </el-tab-pane>
      <el-tab-pane label="通话记录"
                   name="call">
        <call :quartersId='quartersId'
              :villageOptions='villageOptions'></call>
      </el-tab-pane>
      <el-tab-pane label="刷卡记录"
                   name="card">
        <card :quartersId='quartersId'
              :villageOptions='villageOptions'></card>
      </el-tab-pane>
      <el-tab-pane label="人脸识别记录"
                   name="face">
        <face :quartersId='quartersId'
              :villageOptions='villageOptions'></face>
      </el-tab-pane>
      <el-tab-pane label="访客记录"
                   name="invite">
        <invite :quartersId='quartersId'
                :villageOptions='villageOptions'></invite>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import call from './call'
import card from './card'
import face from './face'
import invite from './invite'
import onekey from './onekey'
import { mapGetters } from 'vuex'
import { getQuarterByRole } from '@/api/village'
export default {
  data() {
    return {
      activeName: 'onekey',
      setRate: false,
      quartersId: '',
      villageOptions: []
    }
  },
  components: {
    call,
    card,
    face,
    invite,
    onekey
  },
  created() {
    this.setRate = this.permissions['setRate']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.handleGetAllListObj()
  },
  methods: {
    handleGetAllListObj() {
      getQuarterByRole().then(res => {
        this.villageOptions = []
        const requireInfo = res.data.data
        if (requireInfo) {
          if (requireInfo.length) {
            requireInfo.forEach(item => {
              delete item.bulidList
              this.villageOptions.push(item)
            })
            if (this.villageOptions.length) {
              this.quartersId = this.villageOptions[0].quartersId
            }
          }
        }
      })
    }
  }
}
</script>

<style>
</style>
