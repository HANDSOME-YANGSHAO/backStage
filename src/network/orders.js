import { request } from "./request";

// 按分页参数去查询订单列表
export function getOrderList(params) {
  return request({
    url: '/orders',
    method: 'get',
    params: params
  })
}

// 根据订单id去查询物流信息
export function getOrderInfoById(orderId) {
  return request({
    url: `/orders/${orderId}`,
    method: 'get'
  })
}

// 物流快递信息
export function getLogisticsInfo() {
  return request({
    url: `/kuaidi/${1106975712662}`,
    method: 'get'
  })
}