import request from '@/router/axios'
export function getCarIn(params) {
  return request({
    url: '/api/carController/selectCarInLog',
    method: 'get',
    params
  })
}

export function getCarOut(params) {
  return request({
    url: '/api/carController/selectCarOutList',
    method: 'get',
    params
  })
}
// /app/carapp/selectChargeMessage.
export function chargeLogList(params) {
  return request({
    url: '/api/carController/chargeLogList',
    method: 'get',
    params
  })
}
// /carController/excelExport
export function excelExport(params) {
  return request({
    url: '/api/carController/excelExport',
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/vnd.ms-excel'
    },
    params
  })
}
