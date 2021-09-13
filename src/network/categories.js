import { request } from "./request";

// 获取商品分类列表
export function getCateList(queryInfo) {
  return request({
    url: '/categories',
    method: 'get',
    params: queryInfo
  })
}

// 添加分类
export function addCate(data) {
  return request({
    url: '/categories',
    method: 'post',
    data: data
  })
}

// 根据id查询分类信息
export function getCateById(id) {
  return request({
    url: `categories/${id}`,
    method: 'get'
  })
}

// 根据id提交编辑信息
export function editCateById(id, cat_name) {
  return request({
    url: `categories/${id}`,
    method: 'put',
    data: {
      cat_name
    }
  })
}

// 根据分类id删除分类
export function deleteCateById(id) {
  return request({
    url: `categories/${id}`,
    method: 'delete'
  })
}