import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/sysConfig/page',
    method: 'get',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/sysConfig',
    method: 'put',
    params: obj
  })
}
