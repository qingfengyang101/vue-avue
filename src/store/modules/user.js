import { getToken, setToken, removeToken } from '@/util/auth'
import { setStore, getStore } from '@/util/store'
import { validatenull } from '@/util/validate'
import {
  loginByUsername,
  mobileLogin,
  getUserInfo,
  logout,
  userMenu
} from '@/api/login'
import { GetMenu } from '@/api/menu'
import { encryption } from '@/util/util'
import Vue from 'vue'
import { Message } from 'element-ui'
Vue.prototype.$message = Message
const user = {
  state: {
    userInfo:
      getStore({
        name: 'userInfo'
      }) || {},
    permissions:
      getStore({
        name: 'permissions'
      }) || {},
    roles:
      getStore({
        name: 'roles'
      }) || [],
    menu:
      getStore({
        name: 'menu'
      }) || [],
    isInitMenu:
      getStore({
        name: 'isInitMenu'
      }) || false,
    access_token:
      getStore({
        name: 'access_token'
      }) || '',
    tenantShortName:
      getStore({
        name: 'tenantShortName'
      }) || '',
    refresh_token:
      getStore({
        name: 'refresh_token'
      }) || ''
  },
  actions: {
    // 根据用户名登录
    LoginByUsername({ commit, state, dispatch }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo.username, userInfo.password, userInfo.code)
          .then(response => {
            if (response.data.code === 200) {
              const data = response.data.data
              setToken(data.access_token)
              commit('SET_ACCESS_TOKEN', data.token)
              commit('SET_tenantShortName', data.user.nickname)
              commit('SET_USER_INFO', data.user)
              commit('CLEAR_LOCK')
              resolve()
            } else {
              reject(response.data.msg)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 根据手机号登录
    LoginByPhone({ commit, state, dispatch }, userInfo) {
      const mobile = userInfo.mobile.trim()
      return new Promise((resolve, reject) => {
        mobileLogin(mobile, userInfo.code)
          .then(response => {
            const data = response.data
            setToken(data.access_token)
            commit('SET_ACCESS_TOKEN', data.access_token)
            commit('SET_REFRESH_TOKEN', data.refresh_token)
            commit('SET_tenantShortName', data.tenantShortName)
            commit('CLEAR_LOCK')
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    GetTableData({ commit, state, dispatch }, page) {
      return new Promise((resolve, reject) => {
        // 未定义
        // getTableData(page).then(res => {
        //   const data = res.data
        //   resolve(data)
        // })
      })
    },
    GetUserInfo({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token)
          .then(response => {
            const data = response.data
            commit('SET_ROLES', data.roleCode)
            commit('SET_PERMISSIONS', data.menu)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            // 清除菜单
            commit('SET_MENU', [])
            // 清除权限
            commit('SET_PERMISSIONS', [])
            // 清除用户信息
            commit('SET_USER_INFO', {})
            commit('SET_ACCESS_TOKEN', '')
            commit('SET_REFRESH_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_tenantShortName', '')
            commit('DEL_ALL_TAG')
            // removeToken()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 注销session
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        // 清除菜单
        commit('SET_MENU', [])
        // 清除权限
        commit('SET_PERMISSIONS', [])
        // 清除用户信息
        commit('SET_USER_INFO', {})
        commit('SET_ACCESS_TOKEN', '')
        commit('SET_REFRESH_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_tenantShortName', '')
        commit('DEL_ALL_TAG')
        removeToken()
        resolve()
      })
    },
    // 获取系统菜单
    GetMenu({ commit }) {
      return new Promise(resolve => {
        userMenu().then(res => {
          const data = res.data
          data.forEach(ele => {
            ele.children.forEach(child => {
              if (!validatenull(child.component)) {
                child.path = `${ele.path}/${child.path}`
              }
            })
          })
          commit('SET_MENU', data)
          resolve(data)
        })
      })
    }
  },
  mutations: {
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token
      setStore({
        name: 'access_token',
        content: state.access_token,
        type: 'session'
      })
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
      setStore({
        name: 'menu',
        content: state.menu,
        type: 'session'
      })
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
      setStore({
        name: 'userInfo',
        content: state.userInfo,
        type: 'session'
      })
    },
    SET_REFRESH_TOKEN: (state, rfToken) => {
      state.refresh_token = rfToken
      setStore({
        name: 'refresh_token',
        content: state.refresh_token,
        type: 'session'
      })
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
      setStore({
        name: 'roles',
        content: state.roles,
        type: 'session'
      })
    },
    SET_tenantShortName: (state, tenantShortName) => {
      state.tenantShortName = tenantShortName
      setStore({
        name: 'tenantShortName',
        content: state.tenantShortName,
        type: 'session'
      })
    },
    SET_PERMISSIONS: (state, permissions) => {
      const list = {}
      for (let i = 0; i < permissions.length; i++) {
        if (permissions[i].permission) {
          list[permissions[i].permission] = true
        }
      }
      state.permissions = list
      setStore({
        name: 'permissions',
        content: state.permissions,
        type: 'session'
      })
    }
  }
}
export default user
