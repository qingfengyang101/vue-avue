import request from '@/router/axios'
export function selectUjQuarters(params) {
  return request({
    url: '/api/gateRecognition/selectUjQuarters',
    method: 'get',
    params: params
  })
}
export function getListObj(obj) {
  return request({
    url: '/api/gateRecognition/selectDeviceList',
    method: 'get',
    params: obj
  })
}
export function getAllListObj(obj) {
  return request({
    url: '/api/gateRecognition/selectDeviceList',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/gateRecognition/createDevice',
    method: 'post',
    params: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/gateRecognition/deleteDevice',
    method: 'delete',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/gateRecognition/updateDevice',
    method: 'put',
    params: obj
  })
}
export function deviceState(params) {
  return request({
    url: '/api/gateRecognition/deviceState',
    method: 'get',
    params: params
  })
}
export function deviceDisable(params) {
  return request({
    url: '/api/gateRecognition/deviceDisable',
    method: 'get',
    params: params
  })
}
export function deviceAble(params) {
  return request({
    url: '/api/gateRecognition/deviceEnable',
    method: 'get',
    params: params
  })
}

export function upgrade(params) {
  return request({
    url: '/api/gateRecognition/upgrade',
    method: 'get',
    params: params
  })
}
// 设备升级
export function dataProofreading(params) {
  return request({
    url: '/api/gateRecognition/dataProofreading',
    method: 'get',
    params: params
  })
}
// 设备同步
export function equipmentSynchronization(params) {
  return request({
    url: '/api/gateRecognition/equipmentSynchronization',
    method: 'get',
    params: params
  })
}
//
export function resetDevice(params) {
  return request({
    url: '/api/gateRecognition/reset',
    method: 'get',
    params: params
  })
}
//
export function selectDevicePersionList(params) {
  return request({
    url: '/api/gateRecognition/selectDevicePersionList',
    method: 'get',
    params: params
  })
}
// /gateRecognitionPersion/openRegistration
export function openRegistration(params) {
  return request({
    url: '/api/gateRecognitionPersion/openRegistration',
    method: 'get',
    params: params
  })
}
// /gateRecognitionPersion/getRegisteration
export function getRegisteration(params) {
  return request({
    url: '/api/gateRecognitionPersion/getRegisteration',
    method: 'get',
    params: params
  })
}
// /gateRecognition/cancel
export function cancel(params) {
  return request({
    url: '/api/gateRecognition/cancel',
    method: 'get',
    params: params
  })
}

// /gateRecognition/setPeople
export function setPeople(params) {
  return request({
    url: '/api/gateRecognition/setPeople',
    method: 'get',
    params: params
  })
}
// /gateRecognition/deleteSomePeople
export function deleteSomePeople(params) {
  return request({
    url: '/api/gateRecognition/deleteSomePeople',
    method: 'get',
    params: params
  })
}
