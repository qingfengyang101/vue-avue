import request from '@/router/axios'

export function getCensus(obj) {
  return request({
    url: '/api/census/Census',
    method: 'get',
    params: obj
  })
}


export function getQuarterOwner(obj) {
    return request({
        url: '/api/census/QuarterOwner',
        method: 'get',
        params: obj
    })
}


export function getAppindex(obj) {
    return request({
        url: '/api/census/Appindex',
        method: 'get',
        params: obj
    })
}


export function getSelectQuaterLT(obj) {
    return request({
        url: '/api/census/selectQuaterLT',
        method: 'get',
        params: obj
    })
}

export function getDoorcount(obj) {
  return request({
      url: '/api/census/getDoorcount',
      method: 'get',
      params: obj
  })
}


export function getShopindex(obj) {
  return request({
      url: '/api/census/Shopindex',
      method: 'get',
      params: obj
  })
}

export function getQuarterByRole() {
  return request({
    url: '/api/ujQuarters/getQuarterListByCondition',
    method: 'get'
  })
}
  
