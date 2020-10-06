import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/gateRecognitionPersion/selectPersonDeviceList',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/gateRecognitionPersion/personnelInput',
    method: 'post',
    params: obj
  })
}
export function delObj(params) {
  return request({
    url: '/api/gateRecognitionPersion/deletePersion',
    method: 'delete',
    params
  })
}
export function putObj(obj) {
  return request({
    url: '/api/gateRecognitionPersion/insertFace',
    method: 'put',
    params: obj
  })
}
export function getSIngleObj(params) {
  return request({
    url: '/api/gateRecognitionPersion/selectPersionSingle',
    method: 'get',
    params
  })
}
// /gateRecognition/selectUjQuarters
export function selectUjQuarters() {
  return request({
    url: '/api/gateRecognition/selectUjQuarters',
    method: 'get'
  })
}
export function selectDeviceList(obj) {
  return request({
    url: '/api/gateRecognition/selectDeviceList',
    method: 'get',
    params: obj
  })
}

export function selectPowerList(obj) {
  return request({
    url: '/api/gateRecognitionPersion/selectPowerList',
    method: 'get',
    params: obj
  })
}
// /gateRecognition/setPeople
export function setPeople(params) {
  return request({
    url: '/api/gateRecognitionPersion/peopleSetDevice',
    method: 'get',
    params: params
  })
}

// /gateRecognition/setPeople
export function saleRightOfEquipment(params) {
  return request({
    url: '/api/gateRecognitionPersion/saleRightOfEquipments',
    method: 'get',
    params: params
  })
}
// /gateRecognitionPersion/selectPerson
export function selectPerson(params) {
  return request({
    url: '/api/gateRecognitionPersion/selectPerson',
    method: 'get',
    params: params
  })
}

// selectImageIdByImageUrl
export function selectImageIdByImageUrl(params) {
  return request({
    url: '/api/gateRecognitionPersion/selectImageIdByImageUrl',
    method: 'get',
    params: params
  })
}

// deleteFace
export function deleteFace(params) {
  return request({
    url: '/api/gateRecognitionPersion/deleteFace',
    method: 'delete',
    params: params
  })
}

// selectFace
export function selectFace(params) {
  return request({
    url: '/api/gateRecognitionPersion/selectFace',
    method: 'get',
    params: params
  })
}

// /personAndPicRegister
export function personAndPicRegister(params) {
  return request({
    url: '/api/gateRecognitionPersion/personAndPicRegister',
    method: 'post',
    params: params
  })
}
