import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/drDoorphoneVersion/page',
    method: 'get',
    params: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/api/drDoorphoneVersion',
    method: 'put',
    params: obj
  })
}


export function updateStatus(obj) {
  return request({
    url: '/api/drDoorphoneVersion/updateStatus',
    method: 'post',
    params: obj
  })
}
