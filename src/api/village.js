import request from '@/router/axios'

export function getListObj(obj) {
  return request({
    url: '/api/ujQuarters/page',
    method: 'get',
    params: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/api/ujQuarters/add',
    method: 'post',
    params: obj
  })
}
export function delObj(obj) {
  return request({
    url: '/api/ujQuarters/deleteList',
    method: 'delete',
    params: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/api/ujQuarters/update',
    method: 'put',
    params: obj
  })
}
export function getSIngleObj(id) {
  return request({
    url: '/api/ujQuarters/' + id,
    method: 'get'
  })
}
export function getAllListObj() {
  return request({
    url: '/api/ujQuarters/getQuarterList',
    method: 'get'
  })
}
export function getQuarterByRole() {
  return request({
    url: '/api/ujQuarters/getQuarterListByCondition',
    method: 'get'
  })
}

// /ujBuilds/quartes
export function getBuildsListByquartersId(obj) {
  return request({
    url: '/api/ujBuilds/getBuildsListByquartersId',
    method: 'get',
    params: obj
  })
}
// /ujUnit/getUnitListByBuildId
export function getUnitListByBuildId(obj) {
  return request({
    url: '/api/ujUnit/getUnitListByBuildId',
    method: 'get',
    params: obj
  })
}
// /ujUnit/getUnitListByBuildId
export function getRoomListByUnitId(obj) {
  return request({
    url: '/api/ujRoom/getRoomListByUnitId',
    method: 'get',
    params: obj
  })
}
// /ujUnit/getOwnerVoListByRoomId
export function getOwnerVoListByRoomId(obj) {
  return request({
    url: '/api/ujOwner/getOwnerVoListByRoomId',
    method: 'get',
    params: obj
  })
}

function guess(num) {
  if (num === 6) {
    return 0
  }
  if (num > 6) {
    return -1
  } else {
    return 1
  }
}


var search = function(nums, target) {
  let left = 0;
  let right = nums.length - 1
  while(left <= right) {
      let mid = Math.ceil((left + right) / 2)
      if (nums[mid] === target) {
          return mid
      }
      console.log(nums[mid])
      
      if (nums[mid] > nums[left]) {
        if (nums[mid] < target) {
          left = mid + 1
        } else {
          right = mid - 1
        }
      } else {
        if (nums[mid] < target) {
          right = mid - 1
        } else {


          
          left = mid + 1
        }
      }
  }
  
 // return -1;
};

var nums = [4,5,6,7,0,1,2]
search(nums, 0)