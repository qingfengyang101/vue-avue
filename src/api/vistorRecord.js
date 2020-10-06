//
import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/visitorController/selectHisrtoy',
    method: 'post',
    params: obj
  })
}
