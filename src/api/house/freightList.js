import request from '@/router/axios'


export function fetchList(params) {
    return request({
        url: '/api/omsThirdOrderController/page',
        method: 'get',
        params
    })
}