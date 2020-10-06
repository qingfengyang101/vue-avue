import request from '@/router/axios'


export function fetchList(params) {
    return request({
        url: '/api/stDeliverController/page',
        method: 'get',
        params
    })
}