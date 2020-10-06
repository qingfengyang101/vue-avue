import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/tMagneticCard/page',
    method: 'get',
    params: obj
  })
}

export function getAllUserBalance(obj) {
  return request({
    url: '/api/tMagneticCard/getAllUserBalance',
    method: 'get',
    params: obj
  })
}

export function addObj(obj) {
  return request({
    url: '/api/tMagneticCard',
    method: 'post',
    params: obj
  })
}
export function delObj(id) {
  return request({
    url: '/api/tMagneticCard/' + id,
    method: 'delete'
  })
}
export function putObj(obj) {
  return request({
    url: '/api/tMagneticCard',
    method: 'put',
    params: obj
  })
}
export function getSingleObj(id) {
  return request({
    url: '/api/tMagneticCard/' + id,
    method: 'get'
  })
}
