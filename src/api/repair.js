import request from '@/router/axios'
// 查询报修
export function getListObj(obj) {
  return request({
    url: '/api/app/adminProperty/propertyAdminSelectDetail',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/ujFriendCircle',
    method: 'post',
    params: obj
  })
}

export function repairover(obj) {
  return request({
    url: '/api/app/adminProperty/repairover',
    method: 'post',
    data: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/ujFriendCircle/deleteList',
    method: 'delete',
    params: obj
  })
}
export function getSingleObj(obj) {
  return request({
    url: '/api/app/property/propertySelectDetail',
    method: 'get',
    params: obj
  })
}
// 查询分类
export function getLabelListObj(obj) {
  return request({
    url: '/api/app/adminProperty/propertyAdminSelectSortList',
    method: 'get'
  })
}
// 删除分类
export function delLabelListObj(obj) {
  return request({
    url: '/api/app/adminProperty/propertyAdminDeleteSort',
    method: 'delete',
    params: obj
  })
}
// 添加分类
export function addLabelListObj(obj) {
  return request({
    url: '/api/app/adminProperty/propertyAdminInsertSort',
    method: 'post',
    params: obj
  })
}
