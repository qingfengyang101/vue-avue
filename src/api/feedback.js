import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/admin/opinion/page',
    method: 'get',
    params: obj
  })
}


export function reply(id, data) {
  return request({
    url: `/admin/opinion/reply/${id}`,
    method: 'post',
    data
  })
}