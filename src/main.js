import Vue from 'vue'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import VueMoment from 'vue-moment'
import App from './App'
import 'babel-polyfill'
import axios from './router/axios'
import './permission' // 权限
import './errorLog' // 错误日志
import router from './router/router'
import store from './store'
import Validator from 'vue-validator'
import { loadStyle } from './util/util'

import * as urls from '@/config/env'
import { iconfontUrl, iconfontVersion } from '@/config/env'
import * as filters from './filters' // 全局filter
import './styles/common.scss'
import './styles/index.scss'
import './assets/icon/iconfont.css'
import './assets/css/common.scss'
import echarts from 'echarts'
import Print from '@/util/print'
import VueAMap from 'vue-amap'
import "@/util/mixin.js"
import Vuetify from "vuetify";
Vue.use(Print)
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: 'e9403cc3a37a0976d318904a0a220f64',
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor'
  ],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

Vue.prototype.$defaultListQuery = {
  page: 1,
  limit: 10,
  orderSn: null,
  receiverKeyword: null,
  status: null,
  orderType: null,
  sourceType: null,
  createTime: null,
};


Vue.use(ElementUI)
Vue.use(VueMoment)
Vue.use(VueAxios, axios)
Vue.use(Validator)

Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key]
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})

export function createApp() {
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return {
    app,
    router,
    store
  }
}
