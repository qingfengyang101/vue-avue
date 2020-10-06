import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/tChargeConfig/page',
    method: 'get',
    params: obj
  })
}

export function addObj(obj) {
  return request({
    url: '/api/tChargeConfig',
    method: 'post',
    params: obj
  })
}

export function delObj(id) {
  return request({
    url: '/api/tChargeConfig/' + id,
    method: 'delete'
  })
}

export function deleteList(obj) {
  return request({
    url: '/api/tChargeConfig/deleteList',
    method: 'delete',
    params: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/api/tChargeConfig',
    method: 'put',
    params: obj
  })
}


export function updateStatus(obj) {
  return request({
    url: '/api/tChargeConfig/pushMsg',
    method: 'post',
    params: obj
  })
}


export function pushTestMsg(obj) {
  return request({
    url: '/api/tChargeConfig/pushTestMsg',
    method: 'post',
    params: obj
  })
}