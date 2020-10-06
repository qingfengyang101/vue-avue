import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/ujWatchMan/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/ujWatchMan',
    method: 'post',
    params: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/ujWatchMan/deleteList',
    method: 'delete',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/ujWatchMan',
    method: 'put',
    params: obj
  })
}
export function getSIngleObj(id) {
  return request({
    url: '/api/ujWatchMan/' + id,
    method: 'get'
  })
}
export function getDoorPhoneListByQuartersId(obj) {
  return request({
    url: '/api/drDoorphone/getDoorPhoneListByQuartersId',
    method: 'get',
    params: obj
  })
}
export function insertFace(obj) {
  return request({
    url: '/api/ujOwner/insertFace',
    method: 'get',
    params: obj
  })
}
export function getNewFace(obj) {
  return request({
    url: '/api/drFaceInfo/getNewFace',
    method: 'get',
    params: obj
  })
}
// export function getAllListObj() {
//   return request({
//     url: '/api/ujQuarters/getQuarterList',
//     method: 'get'
//   })
// }
// export function getQuarterByRole() {
//   return request({
//     url: '/api/ujQuarters/getQuarterListByCondition',
//     method: 'get'
//   })
// }

// // /ujBuilds/quartes
// export function getBuildsListByquartersId(obj) {
//   return request({
//     url: '/api/ujBuilds/getBuildsListByquartersId',
//     method: 'get',
//     params: obj
//   })
// }
// // /ujUnit/getUnitListByBuildId
// export function getUnitListByBuildId(obj) {
//   return request({
//     url: '/api/ujUnit/getUnitListByBuildId',
//     method: 'get',
//     params: obj
//   })
// }
// // /ujUnit/getUnitListByBuildId
// export function getRoomListByUnitId(obj) {
//   return request({
//     url: '/api/ujRoom/getRoomListByUnitId',
//     method: 'get',
//     params: obj
//   })
// }
// // /ujUnit/getOwnerVoListByRoomId
// export function getOwnerVoListByRoomId(obj) {
//   return request({
//     url: '/api/ujOwner/getOwnerVoListByRoomId',
//     method: 'get',
//     params: obj
//   })
// }
