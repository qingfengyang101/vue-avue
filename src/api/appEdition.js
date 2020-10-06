import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/appManageVersion/page',
    method: 'get',
    params: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/api/appManageVersion',
    method: 'put',
    params: obj
  })
}
