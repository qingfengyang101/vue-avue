<template>
  <div class="setCharge">
    <el-tabs v-model="activeName"
             @tab-click="handleClick"
             type="card">
      <el-tab-pane label="入场记录"
                   name="carIn">
        <carIn></carIn>
      </el-tab-pane>
      <el-tab-pane label="出场记录"
                   name="carOut">
        <carOut></carOut>
      </el-tab-pane>
      <el-tab-pane label="缴费记录"
                   name="payment">
        <payment></payment>
      </el-tab-pane>
      <el-tab-pane label="交接班记录"
                   name="doverRecord">
        <doverRecord></doverRecord>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import carIn from './carIn'
import carOut from './carOut'
import payment from './payment'
import doverRecord from './doverRecord'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: 'carIn'
    }
  },
  components: {
    carIn,
    carOut,
    payment,
    doverRecord
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
      if (tab.index === '0') {
      }
    }
  }
}
</script>
