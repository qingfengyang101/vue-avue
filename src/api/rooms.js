import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/ujRoom/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/ujRoom',
    method: 'post',
    params: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/ujRoom/deleteList',
    method: 'delete',
    params: obj
  })
}
export function updateObj(obj) {
  return request({
    url: '/api/ujRoom',
    method: 'put',
    params: obj
  })
}
export function getSingleObj(id) {
  return request({
    url: '/api/ujRoom/' + id,
    method: 'get'
  })
}

export function getRoomOwnerListByRoomId(params) {
  return request({
    url: '/api/ujRoom/getRoomOwnerListByRoomId',
    method: 'get',
    params
  })
}