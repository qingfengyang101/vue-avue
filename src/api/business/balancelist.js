import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/merchantAccountController/page',
    method: 'get',
    params: obj
  })
}

export function updateObj(obj) {
    return request({
      url: '/api/merchantAccountController',
      method: 'put',
      params: obj
    })
}
  