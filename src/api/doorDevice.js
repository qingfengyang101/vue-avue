import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/drDoorphone/page',
    method: 'get',
    params: obj
  })
}
export function getDoorListObj(obj) {
  return request({
    url: '/api/drDoorphone/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/drDoorphone',
    method: 'post',
    params: obj
  })
}
export function delObj(id) {
  return request({
    url: '/api/drDoorphone/' + id,
    method: 'delete'
  })
}
export function putObj(obj) {
  return request({
    url: '/api/drDoorphone',
    method: 'put',
    params: obj
  })
}
export function getSingleObj(id) {
  return request({
    url: '/api/drDoorphone/' + id,
    method: 'get'
  })
}
// /drDoorphone/updateStatus
export function updateStatus(obj) {
  return request({
    url: '/api/drDoorphone/updateStatus',
    method: 'get',
    params: obj
  })
}
// /drYunzhixun/list
export function drYunzhixunList(obj) {
  return request({
    url: '/api/drYunzhixun/list',
    method: 'get',
    params: obj
  })
}
