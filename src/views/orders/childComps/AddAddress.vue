<template>
    <el-dialog
    :close-on-click-modal="false"
    title="订单地址"
    :visible.sync="AddAddressDialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-form 
      ref="AddAddressFormRef" 
      :model="AddAddressForm"
      :rules="AddAddressFormRules"
      label-width="80px">
      <el-form-item label="省市区" prop="Address1">
        <el-cascader
          v-model="selectedKeys"
          :options="cityData"
          :props="selectedProps"
          @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="Address2">
        <el-input v-model="AddAddressForm.Address2">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// 引入中国省市区嵌套的对象
import cityData from "common/citydata.js"
export default {
  name: 'AddAddress',
  props: {
    AddAddressDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      AddAddressForm: {},
      AddAddressFormRules: {
        Address1: [
          {required: true, message: '请输入地区!', trigger: 'blur'}
        ],
        Address2: [
          {required: true, message: '请输入详细地址!', trigger: 'blur'}
        ]
      },
      cityData,
      selectedProps: {
        value: 'value',
        label: 'label',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectedKeys: []
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:AddAddressDialogVisible', false)
      this.$refs.AddAddressFormRef.resetFields()
      this.selectedKeys = []
    },
    handleChange() {
      console.log(this.selectedKeys)
    }
  }
}
</script>

<style lang="less" scoped>

</style>