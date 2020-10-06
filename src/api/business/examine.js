import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/besuser/page',
    method: 'get',
    params: obj
  })
}

export function checkbes(obj) {
    return request({
      url: '/api/besuser/checkbes',
      method: 'post',
      data: obj
    })
}
  