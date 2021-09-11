import { request } from "./request";

// 根据类型请求权限列表
export function getRightsList(type) {
  return request({
    url: `/rights/${type}`,
    method: 'get'
  })
}