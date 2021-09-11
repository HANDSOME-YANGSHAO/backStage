import { request } from "./request";

// 请求角色列表
export function getRoleList() {
  return request({
    url: `/roles`,
    method: 'get'
  })
}

// 添加角色
export function addRole(data) {
  return request({
    url: `/roles`,
    method: 'post',
    data: data
  })
}

// 根据角色的ID去查询角色信息
export function getRoleById(id) {
  return request({
    url: `/roles/${id}`,
    method: 'get'
  }) 
}

// 编辑角色信息
export function editRole(data) {
  return request({
    url: `/roles/${data.roleId}`,
    method: 'put',
    data: {
      roleName: data.roleName,
      roleDesc: data.roleDesc
    }
  })
}

// 通过角色ID删除角色
export function deleteRole(id) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}

// 通过角色id和权限id删除角色的特定权限
export function deleteRight(roleId, rightId){
  return request({
    url: `/roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

// 角色授权
export function setRoleRights(roleId, rids) {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: {
      rids
    }
  })
}