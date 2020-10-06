import request from '@/router/axios'

export function getVehicleList(params) {
  return request({
    url: '/api/carController/querycarinfo',
    method: 'get',
    params
  })
}

// /carController/registcardone
export function addObj(params) {
  return request({
    url: '/api/carController/registcardone',
    method: 'post',
    params
  })
}

// /carController/carDelete
export function delObj(params) {
  return request({
    url: '/api/carController/carDelete',
    method: 'delete',
    params
  })
}


// /carController/registcardone
export function updatecarinfo(data) {
  return request({
    url: '/api/carController/updatecarinfo',
    method: 'post',
    data
  })
}

