<template>
  <div class="setCharge">
    <el-tabs v-model="activeName"
             @tab-click="handleClick"
             type="card">
      <el-tab-pane label="车场列表"
                   name="call">
        <yarnList @changeMap="changeMap" @changeActive="changeActive" :parkingListFlag='parkingListFlag'></yarnList>
      </el-tab-pane>
      <el-tab-pane label="运营地图"
                   name="card">
        <mapShow :centerOrign="center"  :carListFlag='carListFlag'></mapShow>
      </el-tab-pane>
      <el-tab-pane label="设备管理"
                   name="device">
        <device :parkId="parkId" @changeParkId="changeParkId"  :deviceFlag='deviceFlag'></device>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import mapShow from './mapShow'
import yarnList from './yarnList'
import device from '../device'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: 'call',
      setRate: false,
      quartersId: '',
      parkingListFlag: false,
      carListFlag: false,
      center: [114.032439, 33.57041],
      parkId: '7DE5F2D1C07B', // 当前选中项目id
      deviceFlag: false
    }
  },
  components: {
    mapShow,
    yarnList,
    device
  },
  created() {
    this.setRate = this.permissions['setRate']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
  },
  methods: {
    /** 
     * 更改选项卡中的name
    */
    changeActive({ name, row: { id } }) {
      //this.parkingListFlag = true
      this.parkId = id;
      this.activeName = name;
      this.deviceFlag = true
    },

    /**  
     * 查看地图
    */
    changeMap({ name, row: { longitude, latitude } }) {
      this.center = [longitude, latitude]
      this.activeName = name;
    },

    changeParkId({ parkId }) {
      this.parkId = parkId
    },

    handleClick(tab, event) {
      if (tab.index === '0') {
        this.parkingListFlag = true
      } else if (tab.index === '1') {
        this.carListFlag = true
      } else if(tab.index === '2') {
        this.deviceFlag = true
      }
    }
  }
}
</script>

<style>
</style>
