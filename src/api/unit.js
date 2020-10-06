import request from '@/router/axios'
export function getListObj(obj) {
  return request({
    url: '/api/ujUnit/page',
    method: 'get',
    params: obj
  })
}
export function getBuildingListByVillageObj(obj) {
  return request({
    url: '/api/ujBuilds/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/ujUnit',
    method: 'post',
    params: obj
  })
}

export function updateObj(obj) {
  return request({
    url: '/api/ujUnit',
    method: 'put',
    params: obj
  })
}

export function delObj(obj) {
  return request({
    url: '/api/ujUnit/deleteList',
    method: 'delete',
    params: obj
  })
}

// export function delObj(obj) {
//   return request({
//     url: '/ujUnit',
//     method: 'delete',
//     params: obj
//   })
// }

export function getSingleObj(id) {
  return request({
    url: '/api/ujUnit/' + id,
    method: 'get'
  })
}
