import { request } from "./request";

// 登陆验证
export function getLogin(params) {
  return request({
    url: '/login',
    method: 'post',
    params: params
  })
}