import request from '@/router/axios'
// 费率
export function getRateListObj(obj) {
  return request({
    url: '/api/tChargingRate/page',
    method: 'get',
    params: obj
  })
}

export function getRateDetailObj(obj) {
  return request({
    url: '/api/tChargingRateDetail/page',
    method: 'get',
    params: obj
  })
}
export function addRateObj(obj) {
  return request({
    url: '/api/tChargingRate',
    method: 'post',
    params: obj
  })
}

export function copyRateObj(obj) {
  return request({
    url: '/api/tChargingRate/copy',
    method: 'post',
    data: obj
  })
}


export function addRateDetailObj(obj) {
  return request({
    url: '/api/tChargingRateDetail',
    method: 'post',
    params: obj
  })
}
export function delRateObj(id) {
  return request({
    url: '/api/tChargingRate/' + id,
    method: 'delete'
  })
}

export function delRateDetailObj(id) {
  return request({
    url: '/api/tChargingRateDetail/' + id,
    method: 'delete'
  })
}
export function putRateObj(obj) {
  return request({
    url: '/api/tChargingRate/edit',
    method: 'post',
    params: obj
  })
}

export function putRateDetailObj(obj) {
  return request({
    url: '/api/tChargingRateDetail/edit',
    method: 'post',
    params: obj
  })
}
export function getRateSingleObj(id) {
  return request({
    url: '/api/tChargingRate/' + id,
    method: 'get'
  })
}
// /tChargingEquipment/getEquiInfo
export function getEquiInfo(obj) {
  return request({
    url: '/api/tChargingEquipment/getEquiInfo',
    method: 'get',
    params: obj
  })
}
export function getEquipPage(obj) {
  return request({
    url: '/api/tChargingEquipment/page',
    method: 'get',
    params: obj
  })
}
// /tChargingEquipment/
export function singleEquipment(id) {
  return request({
    url: '/api/tChargingEquipment/' + id,
    method: 'get'
  })
}

// /tChargingEquipment/edit
export function editEquipment(obj) {
  return request({
    url: '/api/tChargingEquipment/edit',
    method: 'post',
    params: obj
  })
}

// /tChargingEquipment/setTemp
export function setTemp(obj) {
  return request({
    url: '/api/tChargingEquipment/setTemp',
    method: 'post',
    params: obj
  })
}
//  /tChargingEquipment/getUpdateIpInfo
export function getUpdateIpInfo(obj) {
  return request({
    url: '/api/tChargingEquipment/getUpdateIpInfo',
    method: 'post',
    params: obj
  })
}

// /tChargingEquipment/
export function delEquipment(id) {
  return request({
    url: '/api/tChargingEquipment/' + id,
    method: 'delete'
  })
}

// setMoney

// /tRechargeRate/page
export function getMoneyListObj(obj) {
  return request({
    url: '/api/tRechargeRate/page',
    method: 'get',
    params: obj
  })
}
export function addMoneyObj(obj) {
  return request({
    url: '/api/tRechargeRate',
    method: 'post',
    params: obj
  })
}
export function delMoneyObj(id) {
  return request({
    url: '/api/tRechargeRate/' + id,
    method: 'delete'
  })
}
export function putMoneyObj(obj) {
  return request({
    url: '/api/tRechargeRate/edit',
    method: 'post',
    params: obj
  })
}

export function bindChargingRate(obj) {
  return request({
    url: '/api/tChargingEquipment/bindChargingRate',
    method: 'post',
    params: obj
  })
}

// /tChargingEquipment/
export function setEquiInfo(obj) {
  return request({
    url: '/api/tChargingEquipment/setEquiInfo',
    method: 'post',
    params: obj
  })
}


export function handleUpdateAllLoops() {
  return request({
    url: '/api/tChargingEquipment/getUpdateAllNotInLine',
    method: 'post'
  })
} 