<template>
  <div class="setCharge">
    <el-tabs v-model="activeName"
             type="card">
      <el-tab-pane label="充电模板"
                   v-if="setRate"
                   name="rateSet">
        <setRate></setRate>
      </el-tab-pane>
      <!-- <el-tab-pane label="设备参数设置"
                   name="deviceSet">
        <setEquipment></setEquipment>
      </el-tab-pane> -->
      <el-tab-pane label="充值金额设置"
                   name="moneyManger">
        <setMoney></setMoney>
      </el-tab-pane>
      <el-tab-pane label="余额预警"
                   name="Early">
        <Early></Early>
      </el-tab-pane>
      
    </el-tabs>
  </div>
</template>

<script>
import setRate from './setRate'
import setEquipment from './setEquipment'
import setMoney from './setMoney'
import Early from '../early/index'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      activeName: 'rateSet',
      setRate: false
    }
  },
  components: {
    setRate,
    setEquipment,
    setMoney,
    Early
  },
  created () {
    this.setRate = this.permissions['setRate']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
  }
}
</script>

<style>
</style>
