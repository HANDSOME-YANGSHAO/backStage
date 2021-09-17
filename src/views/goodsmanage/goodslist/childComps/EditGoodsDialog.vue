<template>
  <el-dialog
    title="编辑商品"
    :visible.sync="editGoodsDialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-form 
      ref="editGoodsFormRef" 
      :model="editGoodsForm"
      :rules="editGoodsFormRules"
      label-width="80px">
      <el-form-item label="商品名称" prop="goods_name" class="half">
        <el-input v-model="editGoodsForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="goods_price" class="half">
        <el-input v-model.number="editGoodsForm.goods_price"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="goods_number" class="half">
        <el-input v-model.number="editGoodsForm.goods_number"></el-input>
      </el-form-item>
      <el-form-item label="重量" prop="goods_weight" class="half">
        <el-input v-model.number="editGoodsForm.goods_weight"></el-input>
      </el-form-item>
      <el-form-item label="介绍" id="whole2">
        <!-- <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10}"
          placeholder="请输入内容"
          v-model="editGoodsForm.goods_introduce">
        </el-input> -->
        <!-- 填写商品简介的富文本编辑器 -->
        <quill-editor v-model="editGoodsForm.goods_introduce"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="editGoods">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getGoodsInfoById, editGoods } from "network/goodslist.js"
import { getCateList } from "network/categories.js";
export default {
  name: 'editGoodsDialog',
  props: {
    editGoodsDialogVisible: {
      type: Boolean,
      default() {
        return false
      }
    },
    goodsId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      editGoodsForm: { },
      editGoodsFormRules: {
        goods_name:[{required: true, message:'请输入商品名称', trigger: 'blur'}],
        goods_price:[
          {required: true, message:'请输入价格', trigger: 'blur'},
          {type: 'number', message: '请输入数字值'}
        ],
        goods_number:[
          {required: true, message:'请输入数量', trigger: 'blur'},
          {type: 'number', message: '请输入数字值'}
        ],
        goods_weight:[
          {required: true, message:'请输入商品重量', trigger: 'blur'},
          {type: 'number', message: '请输入数字值'}
        ]
      }
    }
  },
  watch: {
    goodsId: {
      handler(newId, oldId) {
        if(newId !== 0) {
          this.getGoodsInfoById(newId)
          this.cateList = [this.editGoodsForm.cat_one_id, this.editGoodsForm.cat_two_id, this.editGoodsForm.cat_three_id]
        } 
      },
      immediate: true
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const res = await getCateList();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.cateList = res.data;
    },
    async getGoodsInfoById(id) {
      const res = await getGoodsInfoById(id)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editGoodsForm = res.data
    },
    handleClose() {
      this.$emit('update:editGoodsDialogVisible', false)
    },
    editGoods() {
      this.$refs.editGoodsFormRef.validate(async valid => {
        if(!valid) return
        const res  = await editGoods(this.goodsId ,this.editGoodsForm)
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$emit('editGoods')
        this.handleClose()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  display: flex;
  flex-wrap:wrap;
  .half {
    width: 50%;
    .el-input {
      width: 80%;
    }
  }
}
#whole1 {
  width: 80% !important;
}
#whole2 {
  flex: 1;
}
.dialog-footer {
  margin-top: 150px !important;
}
/deep/ .ql-editor {
  height: 500px;
}
</style>
