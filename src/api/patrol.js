import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/ujWatchRecord/page',
    method: 'get',
    params: obj
  })
}
export function getQuarterByRole(obj) {
  return request({
    url: '/api/ujQuarters/getQuarterList',
    method: 'get',
    params: obj
  })
}
// excelExport
export function excelExport(params) {
  return request({
    url: '/api/ujWatchRecord/excelExport',
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/vnd.ms-excel'
    },
    params
  })
}
