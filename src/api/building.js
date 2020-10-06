import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/ujBuilds/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/ujBuilds/add',
    method: 'post',
    params: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/ujBuilds/deleteList',
    method: 'delete',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/ujBuilds/update',
    method: 'put',
    params: obj
  })
}
export function getSIngleObj(id) {
  return request({
    url: '/api/ujBuilds/' + id,
    method: 'get'
  })
}
