import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/appPushMessage/page',
    method: 'get',
    params: obj
  })
}

export function addObj(obj) {
  return request({
    url: '/api/appPushMessage',
    method: 'post',
    params: obj
  })
}

export function delObj(id) {
  return request({
    url: '/api/appPushMessage/' + id,
    method: 'delete'
  })
}

export function deleteList(obj) {
  return request({
    url: '/api/appPushMessage/deleteList',
    method: 'delete',
    params: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/api/appPushMessage',
    method: 'put',
    params: obj
  })
}


export function updateStatus(obj) {
  return request({
    url: '/api/appPushMessage/pushMsg',
    method: 'post',
    params: obj
  })
}


export function pushTestMsg(obj) {
  return request({
    url: '/api/appPushMessage/pushTestMsg',
    method: 'post',
    params: obj
  })
}

export function getUpdateRealPush(obj) {
  return request({
    url: '/api/appPushMessage/getUpdateRealPush',
    method: 'post',
    params: obj
  })
}