import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/app/amdinHome/homeMessageSelect',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/app/amdinHome/HomeMessageInsert',
    method: 'post',
    data: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/app/amdinHome/deleteHomeMessage',
    method: 'delete',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/app/amdinHome/upodateHomeMessage',
    method: 'put',
    data: obj
  })
}
export function getSIngleObj(obj) {
  return request({
    url: '/api/app/amdinHome/updateHomeMessageShow',
    method: 'get',
    params: obj
  })
}
export function getQuarterByRole() {
  return request({
    url: '/api/app/amdinHome/homeClassificationSelect',
    method: 'get'
  })
}
