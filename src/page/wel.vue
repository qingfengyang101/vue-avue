

<template>
  <div class="wel-home">
    <el-row style="margin-bottom: 15px" :gutter="24">
      <el-col v-if="appObj == 2"  :span="24">
        <Quarters :appObj="appObj"></Quarters>
      </el-col>
      <el-col v-else :span="12">
        <Quarters :appObj="appObj"></Quarters>
      </el-col>
      <el-col v-if="appObj != 2 && appObj" :span="12">
        <AppStatistics class="app-sta"></AppStatistics>
        <el-row type="flex" justify="space-between" :gutter="24">
          <el-col  :span="12">
            <Progress1 ref1="appRef" :appObj='appObj'></Progress1>
          </el-col>
          <el-col :span="12">
            <Progress1 ref1="shopRef" :appObj="shopObj"></Progress1>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="8">
        <mapPosition :plotList="plotList"></mapPosition>
      </el-col>
      <el-col :span="8">
        <Vehicle></Vehicle>
      </el-col>
      <el-col :span="8">
        <Door :doorList="doorList"></Door>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import Quarters from "./quarters.vue"
import AppStatistics from "./appStatistics.vue"
import Progress1 from "./progress.vue"
import mapPosition from "./mapPosition.vue"
import Vehicle from "./vehicle.vue"
import Door from "./door.vue"

import { getAppindex, getShopindex, getDoorcount, getSelectQuaterLT } from '@/api/statistics'

export default {
  name: 'wel',
  data() {
    return {
      appObj: null,
      shopObj: {},
      doorList: [],
      plotList: [],
      isObj: false
    }
  },
  components: {
    Quarters,
    AppStatistics,
    Progress1,
    mapPosition,
    Vehicle,
    Door
  },
  created() {
    this.getAppindex();
    this.getShopindex();
    this.getDoorcount();
    this.getSelectQuaterLT();
  },
  methods: {

    /**
     * desc 获取app主页访问量
     */
    async getAppindex() {
      try {
        const { data: { data: appObj } } = await getAppindex()

        if (!appObj) {
          return this.appObj = 2
        }
        
        const { visitsAppindextotay, yesterday, visitsAppindexCurweek, visitsAppindexCurrmonth } = appObj
        const list = [visitsAppindextotay, yesterday, visitsAppindexCurweek, visitsAppindexCurrmonth];
        this.appObj = {
          title: 'APP主页访问量',
          list,
          max: this.sortHandler(list)
        }
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 获取商城主页访问量
     */
    async getShopindex() {
      try {
        const { data: { data: shopObj } } = await getShopindex()

        if (!shopObj) {
          return
        }

        const { visitsshopindextotay, yesterdayshop, visitsShopindexCurweek, visitsShopindexCurrmonth } = shopObj
        const list = [visitsshopindextotay, yesterdayshop, visitsShopindexCurweek, visitsShopindexCurrmonth];

        this.shopObj = {
          title: '商城主页访问量',
          list,
          max: this.sortHandler(list)
        }
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 统计开门
     */
    async getDoorcount() {
      try {
        const { data: { data: { cardopentotal, facelogtotal, calltotal, opentotal } } } = await getDoorcount();
        const doorList = [
          {
              name: "手机开门",
              value: opentotal
          },
          {
              name: "门禁卡开门",
              value: cardopentotal
          },
          {
              name: "人脸开门",
              value: facelogtotal
          },
          {
              name: "通话开门",
              value: calltotal
          }]

        this.doorList = doorList.sort((v1, v2) => v2.value - v1.value)
        
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 获取小区经纬度
     */
    async getSelectQuaterLT() {
      try {
        const { data: { data } } = await getSelectQuaterLT()
        this.plotList = data
      }catch(err) {
        console.log(err)
      }
    },

    /**
     * desc 获取最大值
     */
    sortHandler(list) {
      const newList = JSON.parse(JSON.stringify(list))
      newList.sort((v1, v2) => v2 - v1)
      return newList[0]
    }
  }
}
</script>

<style scoped="scoped" lang="scss">

.wel-home {
  width: 100%;
}

.wel-app {
  background: #fff;
  height: 530px;
}

.app-sta {
  height: 245px;
  overflow:hidden;
}
</style>
