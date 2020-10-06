import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/besproduct/page',
    method: 'get',
    params: obj
  })
}


export function fetchProductAttrList(val, params) {
  return request({
    url: `/api/besproduct/list/${val}`,
    method: 'get',
    params
  })
}

export function getBrandObj(obj) {
    return request({
      url: '/api/besproduct/brand/list',
      method: 'get',
      params: obj
    })
}

export function getProductCateList(obj) {
  return request({
    url: '/api/besproduct/list/withChildren',
    method: 'get',
    params: obj
  })
}

export function getSKUObj(val, params) {
  return request({
    url: `/api/sku/${val}`,
    method: 'get',
    params
  })
}


export function updatePublishStatus(data) {
  return request({
    url:'/api/besproduct/update/onsaleStatus',
    method:'post',
    data
  })
}

export function updateJFrate(data) {
  return request({
    url:'/api/besproduct/update/JFrate ',
    method:'post',
    data
  })
}


export function updateDeleteStatus(data) {
  return request({
    url:'/api/besproduct/update/deleteStatus',
    method:'post',
    data
  })
}


export function updateRecommendStatus(data) {
  return request({
    url:'/api/besproduct/update/recommendStatus',
    method:'post',
    data
  })
}




// export function updateDeleteStatus(params) {
//   return request({
//     url:'/product/update/deleteStatus',
//     method:'post',
//     params:params
//   })
// }

export function updateNewStatus(params) {
  return request({
    url:'/product/update/newStatus',
    method:'post',
    params:params
  })
}



export function createProduct(data) {
  return request({
    url:'/product/create',
    method:'post',
    data:data
  })
}

export function updateProduct(id,data) {
  return request({
    url:'/product/update/'+id,
    method:'post',
    data:data
  })
}

export function getProduct(id) {
  return request({
    url:'/product/updateInfo/'+id,
    method:'get',
  })
}

