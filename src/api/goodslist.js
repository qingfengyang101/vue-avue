import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/admin/goods/page',
    method: 'get',
    params: obj
  })
}
export function getgoodsList(obj) {
  return request({
    url: '/api/admin/goodsCats/getGoodsCatsTree',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/admin/goods',
    method: 'post',
    data: obj
  })
}
export function delObj(id) {
  return request({
    url: '/api/admin/goods/' + id,
    method: 'delete'
  })
}
export function putObj(obj) {
  return request({
    url: '/api/admin/goods/edit',
    method: 'post',
    data: obj
  })
}
export function getSingleObj(id) {
  return request({
    url: '/api/admin/goods/' + id,
    method: 'get'
  })
}
