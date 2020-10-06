import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/gateRecognitionPersion/selectDistinguish',
    method: 'get',
    params: obj
  })
}
