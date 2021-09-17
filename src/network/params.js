import { request } from "./request";

// 根据当前分类id和参数类型获取静态参数还是动态参数列表
export function getParamsList(id, sel) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: {
      sel: sel
    }
  })
}

// 添加动态参数或者静态属性
export function addParams(id, attr_name, attr_sel) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'post',
    data: {
      attr_name: attr_name,
      attr_sel: attr_sel
    }
  })
}

// 根据 ID 查询参数（分类id，属性id）
export function getParams(id, attrId, attr_sel) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'get',
    params: {
      attr_sel: attr_sel
    }
  })
}

// 编辑提交参数
export function editParams(editForm) {
  return request({
    url: `categories/${editForm.cat_id}/attributes/${editForm.attr_id}`,
    method: 'put',
    data: {
      attr_name: editForm.attr_name,
      attr_sel: editForm.attr_sel
    }
  })
}

// 删除相关分类的动态参数或者静态属性
export function deleteParams(cat_id, attr_id) {
  return request({
    url: `categories/${cat_id}/attributes/${attr_id}`,
    method: 'delete'
  })
}

// 添加或者删除参数里的tag
export function changeTag(row) {
  return request({
    url: `categories/${row.cat_id}/attributes/${row.attr_id}`,
    method: 'put',
    data: {
      attr_name: row.attr_name,
      attr_sel: row.attr_sel,
      attr_vals: row.attr_vals.join(' ')
    }
  })
}