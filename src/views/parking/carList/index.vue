<template>
  <div class="setCharge">
    <el-tabs v-model="activeName"
             @tab-click="handleClick"
             type="card">
      <el-tab-pane label="车辆列表"
                   name="call">
        <VehicleList :vehicleFlag='vehicleFlag'></VehicleList>
      </el-tab-pane>
      <el-tab-pane label="场内车辆"
                   name="inner">
        <innercar></innercar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VehicleList from './VehicleList'
import innercar from './innercar'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: 'call',
      vehicleFlag: false,
      carListFlag: false
    }
  },
  components: {
    VehicleList,
    innercar
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    handleClick(tab, event) {
      if (tab.index === '0') {
        this.vehicleFlag = true
      }
    }
  }
}
</script>

<style>
</style>
