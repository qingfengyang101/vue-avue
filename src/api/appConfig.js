import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/appPushConfig/page',
    method: 'get',
    params: obj
  })
}

export function addObj(obj) {
  return request({
    url: '/api/appPushConfig',
    method: 'post',
    params: obj
  })
}

export function delObj(id) {
  return request({
    url: '/api/appPushConfig/' + id,
    method: 'delete'
  })
}
