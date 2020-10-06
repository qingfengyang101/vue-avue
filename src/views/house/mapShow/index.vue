<template>
  <div class="amap-page-container">
    <el-amap vid="amapDemo"
        :center="center"
        :zoom="zoom"
        class="amap-demo">
      <el-amap-marker v-for="(marker,index) in markers"
        :key="index"
        :icon='mapIcon'
        :position="marker.position"
        :events="marker.events">
      </el-amap-marker>
      <el-amap-info-window
        :position="center"
        :visible="visible"
        :content='content'>
      </el-amap-info-window>
          
    </el-amap>
  </div>
</template>

<script>
import parking from '@/assets/img/parking.svg'

import { fetchAllList, delObj } from '@/api/house/list'
import { selectSingleParkingLot, selectParkingLotLogLat } from '@/api/parkingYarn'

export default {
  props: {
    carListFlag: Boolean,
  },
  data() {
    return {
      zoom: 16,
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
    carListFlag: {
      handler: function(val) {
        if (val) {
          //this.handleInit()
          val = false
        }
      },
      deep: true
    }
  },
  mounted() {
    this.handleInit()
    //debugger
  },
  methods: {
    handleInit() {
      //debugger

      fetchAllList().then(res => {
        let ParkingLotList = []
        ParkingLotList = res.data.data
        if (ParkingLotList.length) {
          const markers = []
          for (let i = 0; i < ParkingLotList.length; i++) {
            if (ParkingLotList[i].lon && ParkingLotList[i].lat) {
              markers.push({
                position: [ParkingLotList[i].lon, ParkingLotList[i].lat],
                events: {
                  click: () => {
                    this.getSingleParkingLot(ParkingLotList[i], i)
                  }
                }
              })
            }
          }
          this.markers = markers
          this.ParkingLotList = ParkingLotList
        }
      })
    },

    /** 
     * 获取停车场数据
    */
    async getSingleParkingLot(ParkingLotList, i) {
      // this.disabled = false;
      this.visible = false;

      this.content = `<div class="prompt">
          <h1>${ParkingLotList.stageName}</h1>
          <div class='flex-map-show common-windows-map'>
            <p>
              联系人：<span class="elot-span">${ParkingLotList.stageMan}</span>
            </p>
            <p>
              联系方式：<span>${ParkingLotList.stagePhone}</span>
            </p>
          </div>
      </div>`

      this.center = [ParkingLotList.lon, ParkingLotList.lat]

      this.$nextTick(() => {
        this.visible = true;
      })

      // this.disabled = true;
      this.index = i;
    }
  }
}
</script>

<style>
.amap-demo {
  height: 85vh !important;
}

.prompt {
  background: white;
  width: 300px;
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