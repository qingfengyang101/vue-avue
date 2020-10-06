import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/advertise/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/advertise',
    method: 'post',
    params: obj
  })
}
export function delObj(id) {
  return request({
    url: '/api/advertise/' + id,
    method: 'delete'
  })
}
export function putObj(obj) {
  return request({
    url: '/api/advertise',
    method: 'put',
    params: obj
  })
}
export function getSingleObj(id) {
  return request({
    url: '/api/advertise/' + id,
    method: 'get'
  })
}
// /advertise/sendAdMessageToDoorPhone
export function sendAdMessageToDoorPhone(params) {
  return request({
    url: '/api/advertise/sendAdMessageToDoorPhone',
    method: 'get',
    params
  })
}
