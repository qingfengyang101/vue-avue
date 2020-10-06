import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/userCard/page',
    method: 'get',
    params: obj
  })
}