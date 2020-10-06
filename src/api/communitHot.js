import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/app/communitHotspotsAdminController/adminSelectCommunitHostList',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/app/communitHotspotsAdminController/adminInsertCommunitHost',
    method: 'post',
    data: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/app/communitHotspotsAdminController/adminDeleteCommunitHost',
    method: 'delete',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/app/communitHotspotsAdminController/adminUpdateCommunitHost',
    method: 'put',
    data: obj
  })
}
export function getSingleObj(obj) {
  return request({
    url:
      '/api/app/communitHotspotsAdminController/adminSelectCommnuitHostDetail',
    method: 'get',
    params: obj
  })
}
