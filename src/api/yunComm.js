import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/drYunzhixun/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/drYunzhixun',
    method: 'post',
    params: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/drYunzhixun/deleteList',
    method: 'delete',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/drYunzhixun',
    method: 'put',
    params: obj
  })
}
export function getSingleObj(id) {
  return request({
    url: '/api/drYunzhixun/' + id,
    method: 'get'
  })
}
