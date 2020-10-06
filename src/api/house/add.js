import request from '@/router/axios'


export function createHouse(data) {
    return request({
        url:'/api/stagemanage/add',
        method:'post',
        data
    })
}


export function getaddHouse(params) {
    return request({
        url:'/api/stagemanage/selectByid',
        method: 'get',
        params
    })
}

export function updateaddHouse(data) {
    return request({
        url:'/api/stagemanage/edit',
        method:'post',
        data
    })
}
