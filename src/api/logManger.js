import request from '@/router/axios'

export function drDoorphoneCallLog(query) {
  return request({
    url: '/api/drDoorphoneCallLog/page',
    method: 'get',
    params: query
  })
}


export function drDoorphoneOnekeyLog(query) {
  return request({
    url: '/api/drDoorphoneOpenLog/page',
    method: 'get',
    params: query
  })
}

export function drDoorphoneCardLog(query) {
  return request({
    url: '/api/drDoorphoneCardLog/page',
    method: 'get',
    params: query
  })
}

export function drDoorphoneFaceLog(query) {
  return request({
    url: '/api/drDoorphoneFaceLog/page',
    method: 'get',
    params: query
  })
}

export function drDoorphoneInviteLog(query) {
  return request({
    url: '/api/drDoorphoneInviteLog/page',
    method: 'get',
    params: query
  })
}
