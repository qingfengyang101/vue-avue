<template>
  <div class="setCharge">
    <el-tabs v-model="activeName"
             @tab-click="handleClick"
             type="card">
      <el-tab-pane label="门禁广告素材管理"
                   name="call">
        <AdvDoorManger></AdvDoorManger>
      </el-tab-pane>
      <el-tab-pane label="门禁广告发布"
                   name="card">
        <Advertise :AdvertiseFlag='AdvertiseFlag'></Advertise>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AdvDoorManger from './advDoorManger'
import Advertise from './advertise'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: 'call',
      AdvDoorMangerFlag: false,
      AdvertiseFlag: false
    }
  },
  components: {
    AdvDoorManger,
    Advertise
  },
  created() {
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
  },
  methods: {
    handleClick(tab, event) {
      if (tab.index === '1') {
        this.AdvertiseFlag = true
      }
    }
  }
}
</script>

<style>
</style>
