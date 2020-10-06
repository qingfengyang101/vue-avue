/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

import request from '@/router/axios'

export function roleList() {
  return request({
    url: '/admin/role/roleList',
    method: 'get'
  })
}
// 获取角色列表
export function fetchList(query) {
  return request({
    url: '/admin/sysRole/page',
    method: 'get',
    params: query
  })
}

// export function deptRoleList(deptId) {
//   return request({
//     url: '/admin/sysRole/roleList/' + deptId,
//     method: 'get'
//   })
// }

export function permissionUpd(roleId, menuIds) {
  return request({
    url: '/admin/sysRole/roleMenuUpd',
    method: 'post',
    params: {
      roleId: roleId,
      menuIds: menuIds
    }
  })
}

export function fetchRoleTree(roleName) {
  return request({
    url: '/admin/sysMenu/roleTree/' + roleName,
    method: 'get'
  })
}

export function getObj(id) {
  return request({
    url: '/admin/sysRole/' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/sysRole/',
    method: 'post',
    params: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/sysRole',
    method: 'put',
    params: obj
  })
}

export function delObj(id) {
  return request({
    url: '/admin/sysRole/' + id,
    method: 'delete'
  })
}
