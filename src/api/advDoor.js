import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/advInfo/page',
    method: 'get',
    params: obj
  })
}

export function getAdvDoorListObj(obj) {
  return request({
    url: '/api/advInfo/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/advInfo',
    method: 'post',
    params: obj
  })
}
export function delObj(id) {
  return request({
    url: '/api/advInfo/' + id,
    method: 'delete'
  })
}
export function putObj(obj) {
  return request({
    url: '/api/advInfo',
    method: 'put',
    params: obj
  })
}
export function getSingleObj(id) {
  return request({
    url: '/api/advInfo/' + id,
    method: 'get'
  })
}
// /advInfo/
export function getAllListObj() {
  return request({
    url: '/api/advInfo/list',
    method: 'get'
  })
}
