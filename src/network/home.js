import { request } from "./request";

// 请求首页左侧菜单列表
export function getMenuList() {
  return request({
    url: '/menus',
    method: 'get'
  })
}