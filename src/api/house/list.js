import request from '@/router/axios'


export function fetchList(params) {
    return request({
        url: '/api/stagemanage/page',
        method: 'post',
        params
    })
}


export function freightList(params) {
    return request({
        url: '/api/stagemanage/getDeliverListByStageId',
        method: 'get',
        params
    })
}


export function fetchAllList(params) {
    return request({
        url: '/api/stagemanage/list',
        method: 'post',
        params
    })
}


export function delObj(params) {
    return request({
        url: '/api/stagemanage/delete',
        method: 'post',
        params
    })
}