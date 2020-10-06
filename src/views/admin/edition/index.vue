<template>
  <div class="setCharge">
    <el-tabs v-model="activeName"
             type="card">
      <el-tab-pane label="app管理"
                   name="appEdition">
        <AppEdition></AppEdition>
      </el-tab-pane>
      <el-tab-pane label="门禁机管理"
                   name="moneyManger">
        <DoorEdition></DoorEdition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AppEdition from './appEdition.vue'
import DoorEdition from './doorEdition.vue'

export default {
  data () {
    return {
      activeName: 'appEdition',
      setRate: false
    }
  },
  components: {
      AppEdition,
      DoorEdition
  },
  created () {
   
  },
  computed: {
    
  },
  methods: {
  }
}
</script>

<style>
</style>
