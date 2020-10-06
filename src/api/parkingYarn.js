import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/carController/selectAllParkingLot',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/carController/parkinfo',
    method: 'post',
    params: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/carController/deleteParkingLot',
    method: 'delete',
    params: obj
  })
}

export function getUpdateDeviceByParkId(obj) {
  return request({
    url: '/api/carController/getUpdateDeviceByParkId',
    method: 'post',
    params: obj
  })
}


// /carController/selectParkingLotDropdownBox
export function selectParkingLotDropdownBox() {
  return request({
    url: '/api/carController/selectParkingLotDropdownBox',
    method: 'get'
  })
}
// /carController/selectParkingLotLogLat

export function selectParkingLotLogLat() {
  return request({
    url: '/api/carController/selectParkingLotLogLat',
    method: 'get'
  })
}

export function selectSingleParkingLot(obj) {
  return request({
    url: '/api/carController/selectParkingLotOne',
    method: 'get',
    params: obj
  })
}

export function queryinnercar(obj) {
  return request({
    url: '/api/carController/queryinnercar',
    method: 'get',
    params: obj
  })
}

export function selectCarDevice() {
  return request({
    url: '/api/carController/selectCarDevice',
    method: 'get'
  })
}
