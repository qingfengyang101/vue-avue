import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/ujFriendCircle/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/ujFriendCircle',
    method: 'post',
    params: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/ujFriendCircle/deleteList',
    method: 'delete',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/ujFriendCircle',
    method: 'put',
    params: obj
  })
}
export function getSingleObj(id) {
  return request({
    url: '/api/ujFriendCircle/' + id,
    method: 'get'
  })
}

export function getLabelListObj(obj) {
  return request({
    url: '/api/ujFriendCircleClassify/list',
    method: 'get'
  })
}
// /ujFriendCircleClassify/{id}
export function delLabelListObj(id) {
  return request({
    url: '/api/ujFriendCircleClassify/' + id,
    method: 'delete'
  })
}
// /ujFriendCircleClassify
export function addLabelListObj(obj) {
  return request({
    url: '/api/ujFriendCircleClassify',
    method: 'post',
    params: obj
  })
}
