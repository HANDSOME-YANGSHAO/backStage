import { request } from "./request";

// 获取图表配置项
export function getChartOption() {
  return request({
    url: `reports/type/1`,
    method: 'get'
  })
}