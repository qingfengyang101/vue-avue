import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/admin/ujPicture/picSelectList',
    method: 'get',
    params: obj
  })
}

//
export function addObj(obj) {
  return request({
    url: '/api/admin/ujPicture',
    method: 'post',
    params: obj
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/ujPicture/' + id,
    method: 'delete'
  })
}
export function editObj(obj) {
  return request({
    url: '/api/admin/ujPicture/edit',
    method: 'post',
    params: obj
  })
}
