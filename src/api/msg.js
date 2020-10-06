import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/admin/ujmessage/msgsendlog',
    method: 'get',
    params: obj
  })
}

export function addObj(obj) {
  return request({
    url: '/api/admin/ujmessage/addNewMsg',
    method: 'post',
    params: obj
  })
}

