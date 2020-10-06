import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/applyManageCard/page',
    method: 'get',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/applyManageCard',
    method: 'put',
    params: obj
  })
}

export function delObj(id) {
    return request({
        url: '/api/applyManageCard/' + id,
        method: 'delete'
    })
}