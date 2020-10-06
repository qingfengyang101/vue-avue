import request from '@/router/axios'
export function policy() {
  return request({
    url:'/aliyun/oss/policy',
    method:'get',
  })
}
