import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/tChargingLine/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/tChargingLine',
    method: 'post',
    params: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/tChargingLine/deleteList',
    method: 'delete',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/tChargingLine',
    method: 'put',
    params: obj
  })
}
export function getSingleObj(id) {
  return request({
    url: '/api/tChargingLine/' + id,
    method: 'get'
  })
}
// /tChargingLine/updateLines
export function updateLines(obj) {
  return request({
    url: '/api/tChargingLine/updateLines',
    method: 'get',
    params: obj
  })
}
