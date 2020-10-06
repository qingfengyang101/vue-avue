import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/wyDoorPhone/page',
    method: 'get',
    params: obj
  })
}
