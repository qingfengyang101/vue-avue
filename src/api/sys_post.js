import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/sysPost/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/sysPost/addPost',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/sysPost/' + id,
    method: 'get'
  })
}

export function delObj(str) {
  return request({
    url: '/admin/sysPost/' + str,
    method: 'delete'
  })
}
export function putObj(obj) {
  return request({
    url: '/admin/sysPost/',
    method: 'put',
    data: obj
  })
}
