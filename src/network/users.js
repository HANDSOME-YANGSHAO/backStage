import { request } from "./request";

// 请求用户列表
export function getUsersList(params) {
  return request({
    url: '/users',
    method: 'get',
    params: params
  })
}

// 修改用户的状态
export function userStateChange(uid, type) {
  return request({
    url: `/users/${uid}/state/${type}`,
    method: 'put'
  })
}

// 添加用户
export function addUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data: data  // 注意！！！这里添加用户，把用户的相关信息，包括密码什么的都传过去了！这里别tmd用params，会拼接在url上，不安全
                // 所以人家接口文档都只允许你传data，这里不接受params
  })
}

// 根据用户id查找用户信息
export function getUserById(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

// 根据用户id去修改用户信息
export function editUserInfo(userInfo) {
  return request({
    url: `/users/${userInfo.id}`,
    method: 'put',
    data: {
      email: userInfo.email,
      mobile: userInfo.mobile
    }
  })
}

// 根据用户id 删除用户
export function deleteUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}