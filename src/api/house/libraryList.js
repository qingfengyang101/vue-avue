import request from '@/router/axios'


export function fetchList(params) {
    return request({
        url: '/api/stOrderController/page',
        method: 'get',
        params
    })
}