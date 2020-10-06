import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/ujWatchManDept/page',
    method: 'get',
    params: obj
  })
}

export function getManDeptListObj(obj) {
  return request({
    url: '/api/ujWatchManDept/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/ujWatchManDept',
    method: 'post',
    params: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/ujWatchManDept/deleteList',
    method: 'delete',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/ujWatchManDept',
    method: 'put',
    params: obj
  })
}
