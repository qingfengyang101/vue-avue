//
import request from '@/router/axios'
export function querydevice(obj) {
  return request({
    url: '/api/carController/querydevice',
    method: 'get',
    params: obj
  })
}
export function selectCarDevice(obj) {
  return request({
    url: '/api/carController/selectCarDevice',
    method: 'get',
    params: obj
  })
}
