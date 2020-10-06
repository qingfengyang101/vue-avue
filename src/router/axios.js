/**
 *
 * http配置
 *
 */

import axios from 'axios'
import store from '../store'
import router from '../router/router'
import { getToken } from '@/util/auth'
import { Message } from 'element-ui'
import errorCode from '@/const/errorCode'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// 超时时间
axios.defaults.timeout = 20000
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
NProgress.configure({ showSpinner: false }) // NProgress Configuration
// HTTPrequest拦截
axios.interceptors.request.use(
  config => {
    NProgress.start() // start progress bar
    if (store.getters.access_token) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// HTTPresponse拦截
axios.interceptors.response.use(
  data => {
    NProgress.done()
    const errCode = data.data.code
    const errMsg = data.data.msg
    if (parseInt(errCode) === 1000001 || parseInt(errCode) === 1000002) {
      Message({
        message: errorCode[errCode] || errorCode['default'],
        type: 'error'
      })
      store.dispatch('FedLogOut').then(() => {
        router.push({ path: '/login' })
      })
      return Promise.reject(new Error(errorCode[errCode]))
    } else if (parseInt(errCode) === 1000003) {
      Message({
        message: errorCode['default'],
        type: 'error'
      })
      return Promise.reject(new Error(errorCode[errCode]))
    } else if (parseInt(errCode) === 479) {
      Message({
        message: errMsg,
        type: 'error'
      })
      return Promise.reject(new Error(errorCode[errCode]))
    }
    return data
  },
  error => {
    NProgress.done()
    const errMsg = error.toString()
    const code = errMsg.substr(errMsg.indexOf('code') + 5)
    Message({
      message: errorCode[code] || errorCode['default'],
      type: 'error'
    })
    if (
      parseInt(code) === 1000001 ||
      parseInt(code) === 1000002 ||
      parseInt(code) === 401 ||
      parseInt(code) === 479
    ) {
      store.dispatch('FedLogOut').then(() => {
        router.push({ path: '/login' })
      })
    }

    return Promise.reject(new Error(error))
  }
)

export default axios
