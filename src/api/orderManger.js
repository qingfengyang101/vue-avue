import request from '@/router/axios'
// 费率
export function getListObj(obj) {
  return request({
    url: '/api/tChargeOrder/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/tChargeOrder',
    method: 'post',
    params: obj
  })
}
export function delObj(id) {
  return request({
    url: '/api/tChargeOrder/' + id,
    method: 'delete'
  })
}
export function putObj(obj) {
  return request({
    url: '/api/tChargeOrder/edit',
    method: 'put',
    params: obj
  })
}
export function getSingleObj(id) {
  return request({
    url: '/api/tChargeOrder/' + id,
    method: 'get'
  })
}
export function syfx(params) {
  return request({
    url: '/api/tChargeOrder/syfx',
    method: 'get',
    params
  })
}

export function quarter() {
  return request({
    url: '/api/ujQuarters/getQuarterListByCondition',
    method: 'get'
  })
}

export function vital(params) {
  return request({
    url: '/api/tChargeOrder/vital',
    method: 'get',
    params
  })
}

export function chargeVital(params) {
  return request({
    url: '/api/tChargeOrder/ChargeVital',
    method: 'get',
    params
  })
}


export function getCheckLinePower(params) {
  return request({
    url: '/api/tChargeOrder/getCheckLinePower',
    method: 'get',
    params
  })
}

export function getBeforeChargeBalance(params) {
  return request({
    url: '/api/tChargeOrder/getBeforeChargeBalance',
    method: 'get',
    params
  })
}

export function getFinishChargeBalance(params) {
  return request({
    url: '/api/tChargeOrder/getFinishChargeBalance',
    method: 'get',
    params
  })
}

export function quarterSpecific (obj) {
  return request ({
    url: '',
    method: 'get',
    params: obj
  })
}
