import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/ujOwner/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/ujOwner/add',
    method: 'post',
    params: obj
  })
}
export function delObj(id) {
  return request({
    url: '/api/ujOwner/' + id,
    method: 'delete'
  })
}
export function putObj(obj) {
  return request({
    url: '/api/ujOwner',
    method: 'put',
    params: obj
  })
}
export function getSIngleObj(id) {
  return request({
    url: '/api/ujOwner/' + id,
    method: 'get'
  })
}
export function getOwnerObj(obj) {
  return request({
    url: '/api/ujRoomOwner/getOwnerVoList',
    method: 'get',
    params: obj
  })
}
export function arealistList() {
  return request({
    url: '/api/ujQuarters/getQuarterListByCondition',
    method: 'get'
  })
}
export function ujRoomOwnerBind(obj) {
  return request({
    url: '/api/ujRoomOwner',
    method: 'post',
    params: obj
  })
}

export function ujRoomOwnerDel(id) {
  return request({
    url: '/api/ujRoomOwner/' + id,
    method: 'delete'
  })
}

export function getDoorPhoneListByQuartersId(obj) {
  return request({
    url: '/api/drDoorphone/getDoorPhoneListByQuartersId',
    method: 'get',
    params: obj
  })
}

// /ujOwner/insertFace
export function insertFace(obj) {
  return request({
    url: '/api/ujOwner/insertFace',
    method: 'get',
    params: obj
  })
}

export function getByUid(uid) {
  return request({
    url: `/api/tMagneticCard/getByUid/${uid}`,
    method: 'get'
  })
}

// /drFaceInfo/getNewFace
export function getNewFace(obj) {
  return request({
    url: '/api/drFaceInfo/getNewFace',
    method: 'get',
    params: obj
  })
}

export function bindCard(obj) {
  return request({
    url: '/api/tMagneticCard',
    method: 'post',
    params: obj
  })
}
export function drFaceInfoUpdate(obj) {
  return request({
    url: '/api/drFaceInfo',
    method: 'put',
    data: obj
  })
}




export function getSingleFaceInfo(id) {
  return request({
    url: '/api/drFaceInfo/' + id,
    method: 'get'
  })
}

export function confirmPhotoAccessControl(params) {
  return request({
    url: '/api/gateRecognitionPersion/confirmPhotoAccessControl',
    method: 'post',
    params
  })
}

export function uniformPhotos(params) {
  return request({
    url: '/api/gateRecognitionPersion/uniformPhotos',
    method: 'post',
    params
  })
}
