import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/securityDeviceController/securitySelectList',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/securityDeviceController/securityInsert',
    method: 'post',
    params: obj
  })
}
export function bingObj(obj) {
  return request({
    url: '/api/securityDeviceController/securityBinding',
    method: 'post',
    params: obj
  })
}
export function getfacilityList(obj) {
  return request({
    url: '/api/securityDeviceController/ujUser',
    method: 'get',
    params: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/securityDeviceController/deleteDevice',
    method: 'delete',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/securityDeviceController/updateDevice',
    method: 'post',
    params: obj
  })
}
export function putbingObj(obj) {
  return request({
    url: '/api/securityDeviceController/updateDevicePower',
    method: 'post',
    params: obj
  })
}
export function getSIngleObj(id) {
  return request({
    url: '/api/admin/goodsCats/' + id,
    method: 'get'
  })
}
// /admin/goodsCats/getChildCats
export function getChildCats(obj) {
  return request({
    url: '/api/securityDeviceController/selectDeviceForUser',
    method: 'get',
    params: obj
  })
}
export function getLabelListObj(obj) {
  return request({
    url: '/api/securityDeviceController/menuList',
    method: 'get',
    params: obj
  })
}
