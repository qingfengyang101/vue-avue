import request from '@/router/axios'
// 费率
export function getListObj(obj) {
  return request({
    url: '/api/app/getPaymentRecords',
    method: 'get',
    params: obj
  })
}


// 统计
export function payCensus(obj) {
  return request({
    url: '/api/tMagneticCard/payCensus',
    method: 'post',
    params: obj
  })
}
