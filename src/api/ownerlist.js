import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/wyDoorOwner/page',
    method: 'get',
    params: obj
  })
}
