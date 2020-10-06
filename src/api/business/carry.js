import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/merchantDrawFlowController/page',
    method: 'get',
    params: obj
  })
}

export function checkbes(obj) {
    return request({
      url: '/api/merchantDrawFlowController',
      method: 'put',
      params: obj
    })
}
  