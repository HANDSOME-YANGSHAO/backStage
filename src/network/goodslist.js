import { request } from "./request";

// 商品列表数据
export function getGoodsList(queryInfo) {
  return request({
    url: '/goods',
    method: 'get',
    params: queryInfo
  })
}

// 添加加商品
export function addGoods(addGoodsForm) {
  return request({
    url: '/goods',
    method: 'post',
    data: {
      goods_name: addGoodsForm.goods_name,
      goods_price: addGoodsForm.goods_price,
      goods_number: addGoodsForm.goods_number,
      goods_weight: addGoodsForm.goods_weight,
      goods_cat: addGoodsForm.goods_cat.join(','),
      pics: addGoodsForm.pics,
      goods_introduce: addGoodsForm.goods_introduce
    }
  })
}

// 根据商品的id删除商品
export function deleteGoods(id) {
  return request({
    url: `goods/${id}`,
    method: 'delete'
  })
}

// 根据商品ID请求商品数据
export function getGoodsInfoById(id) {
  return request({
    url: `goods/${id}`,
    method: 'get'
  })
}

// 编辑商品的基本信息
export function editGoods(id, goodsForm) {
  return request({
    url: `goods/${id}`,
    method: 'put',
    data: goodsForm
  })
}