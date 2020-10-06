<template>
  <div class="amap-page-container map-position">
    <div class="amap-demo">
        <el-amap vid="amapDemo"
            :center="center"
            :zoom="zoom"
            class="amap-demo">
            <el-amap-marker v-for="(marker, index) in markers"
                :key="index"
                :icon='mapIcon'
                :position="marker.position"
                :events="marker.events">
            </el-amap-marker>
        </el-amap>
    </div>
  </div>
</template>

<script>
import parking from '@/assets/img/parking.svg'

import { fetchAllList, delObj } from '@/api/house/list'
import { selectSingleParkingLot, selectParkingLotLogLat } from '@/api/parkingYarn'

export default {
  props: {
    plotList: {
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
    return {
      zoom: 12,
      center: [114.0168100000, 33.5814900000],
      markers: [],
      window: '',
      mapIcon: parking,
      content: '',
      visible: false,
      disabled: true,
      index: -1
    }
  },
  watch: {
    plotList(to, from) {
      if (to) {
        this.handleInit();
      }
    }
  },
  mounted() {
    this.handleInit()
  },
  methods: {
    handleInit() {
      const { plotList } = this;

      if (!plotList.length) {
        return;
      }

      const markers = [];

      plotList.forEach(item => {

        if (item.longitude && item.latitude) {
          markers.push({
            position: [item.longitude, item.latitude]
          })
        }
      })

      this.markers = markers
    }
  }
}
</script>

<style>

.amap-demo {
    width: 96%;
    height: 96%;
    margin: 2%;
}

.prompt {
  background: white;
  height: auto;
  text-align: center;
}
.prompt h1 {
  font-size: 16px;
  padding: 14px 0 14px;
  color: #757575;
}
.prompt p {
  color: #b7b7b7;
}
.prompt .carPostion {
  padding-top: 12px;
  font-size: 14px;
}
.prompt .carPostion span {
  color: #7b9ef3;
}
.prompt .address {
  padding-top: 14px;
  font-size: 14px;
}
.map-img {
  display: block;
  padding-bottom: 10px;
  width: 300px;
  height: 200px;
}
.amap-icon img {
  top: -12px !important;
  left: -12px !important;
  width: 50px;
}
.amap-info-content {
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 20px;
  border-radius: 10px;
}
.flex-map-show {
  display: flex;
  justify-content: space-around;
}
.common-windows-map {
  padding-bottom: 12px;
}
.elot-span {
  color: #409eff;
}
.fdetail {
  padding-left: 20px;
}
</style>

<style lang="scss" scoped>
.map-position {
    width: 100%;
    height: 380px;
    background:#fff;
    border-radius:15px;
    overflow:hidden;
}
</style>