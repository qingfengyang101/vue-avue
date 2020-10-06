import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/drIdcard/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/drIdcard',
    method: 'post',
    params: obj
  })
}
export function delObj(id) {
  return request({
    url: '/api/drIdcard/' + id,
    method: 'delete'
  })
}
export function putObj(obj) {
  return request({
    url: '/api/drIdcard',
    method: 'put',
    params: obj
  })
}
export function bindOwnerObj(obj) {
  return request({
    url: '/api/drIdcard/bindOwner',
    method: 'put',
    params: obj
  })
}
export function getSingleObj(id) {
  return request({
    url: '/api/drIdcard/' + id,
    method: 'get'
  })
}


export function grantAuth(obj) {
  return request({
    url: '/api/drIdcard/grantAuth',
    method: 'post',
    params: obj
  })
}

export function cancelAuth(obj) {
  return request({
    url: '/api/drIdcard/cancelAuth',
    method: 'post',
    params: obj
  })
}


export function unbindOwner(obj) {
  return request({
    url: '/api/drIdcard/unbindOwner',
    method: 'post',
    params: obj
  })
}
