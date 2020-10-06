import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/appRechargeTemp/page',
    method: 'get',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/appRechargeTemp',
    method: 'put',
    params: obj
  })
}