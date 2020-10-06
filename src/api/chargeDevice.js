import request from '@/router/axios'

export function getListObj(obj) {
  console.log(2222)
  return request({
    url: '/api/tChargingEquipment/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/tChargingEquipment',
    method: 'post',
    params: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/tChargingEquipment',
    method: 'delete',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/tChargingEquipment/edit',
    method: 'put',
    params: obj
  })
}
export function getSingleObj(id) {
  return request({
    url: '/api/tChargingEquipment/' + id,
    method: 'get'
  })
}
