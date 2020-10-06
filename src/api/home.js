import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/app/amdinHome/homeClassificationSelect',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/app/amdinHome/homeClassification',
    method: 'post',
    params: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/app/amdinHome/deleteHomeClassification',
    method: 'delete',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/app/amdinHome/updateHomeClassification',
    method: 'put',
    params: obj
  })
}
export function getSIngleObj(id) {
  return request({
    url: '/api/ujQuarters/' + id,
    method: 'get'
  })
}
export function getAllListObj() {
  return request({
    url: '/api/ujQuarters/getQuarterList',
    method: 'get'
  })
}
export function getQuarterByRole() {
  return request({
    url: '/api/ujQuarters/getQuarterListByCondition',
    method: 'get'
  })
}
