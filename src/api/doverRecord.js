import request from '@/router/axios'

export function doverRecordListObj(obj) {
  return request({
    url: '/api/carController/selectHandoverRecord',
    method: 'get',
    params: obj
  })
}
