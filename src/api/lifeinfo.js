import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/ujLifeServiceInfo/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/ujLifeServiceInfo',
    method: 'post',
    params: obj
  })
}
export function delObj(id) {
  return request({
    url: '/api/ujLifeServiceInfo/' + id,
    method: 'delete'
  })
}
export function putObj(obj) {
  return request({
    url: '/api/ujLifeServiceInfo',
    method: 'put',
    params: obj
  })
}
export function getSIngleObj(id) {
  return request({
    url: '/api/ujLifeServiceInfo/' + id,
    method: 'get'
  })
}
export function getAllListObj() {
  return request({
    url: '/api/ujQuarters/getQuarterList',
    method: 'get'
  })
}
export function getcategoryList() {
  return request({
    url: '/api/ujLifeServiceCategory/list',
    method: 'get'
  })
}
