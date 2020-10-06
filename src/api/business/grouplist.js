import request from '@/router/axios'

export function fetchList(params) {
  return request({
    url:'/api/groupbugpromotion/page',
    method:'get',
    params:params
  })
}

export function checkSuccessHandler(data) {
  return request({
    url:'/api/groupbugpromotion/checkGroupPros',
    method:'post',
    data
  });
}

export function checkFailHandler(params) {
  return request({
    url:'/api/groupbugpromotion/checkGroupProFail',
    method:'post',
    params
  });
}
