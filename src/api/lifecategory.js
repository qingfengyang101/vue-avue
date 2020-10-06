import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/ujLifeServiceCategory/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/ujLifeServiceCategory/add',
    method: 'post',
    params: obj
  })
}
export function delObj(id) {
  return request({
    url: '/api/ujLifeServiceCategory/' + id,
    method: 'delete'
  })
}
export function putObj(obj) {
  return request({
    url: '/api/ujLifeServiceCategory',
    method: 'put',
    params: obj
  })
}
export function getSIngleObj(id) {
  return request({
    url: '/api/ujLifeServiceCategory/' + id,
    method: 'get'
  })
}
