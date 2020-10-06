import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/admin/goodsCats/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/admin/goodsCats',
    method: 'post',
    params: obj
  })
}
export function delObj(id) {
  return request({
    url: '/api/admin/goodsCats/' + id,
    method: 'delete'
  })
}
export function putObj(obj) {
  return request({
    url: '/api/admin/goodsCats/edit',
    method: 'post',
    params: obj
  })
}
export function getSIngleObj(id) {
  return request({
    url: '/api/admin/goodsCats/' + id,
    method: 'get'
  })
}
// /admin/goodsCats/getChildCats
export function getChildCats(obj) {
  return request({
    url: '/admin/goodsCats/getChildCats',
    method: 'get',
    params: obj
  })
}
