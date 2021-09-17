<template>
    <el-dialog
    title="物流信息"
    :visible.sync="LogisticsInfoDialogVisible"
    width="50%"
    :before-close="handleClose"
  >
     <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in detailInfo"
        :key="index"
        :timestamp="activity.time">
        {{activity.context}}
      </el-timeline-item>
    </el-timeline>
  </el-dialog>
</template>

<script>
import { getLogisticsInfo } from "network/orders.js"

export default {
  name: 'LogisticsInfo',
  props: {
    LogisticsInfoDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    LogisticsInfoDialogVisible: {
      handler(newVal, oldVal) {
        if(newVal) {
          this.getLogisticsInfo()
        }
      }
    }
  },
  data() {
    return {
      detailInfo: []
    }
  },
  methods: {
    async getLogisticsInfo() {
      const res = await getLogisticsInfo()
      if(res.meta.status !== 200) return this.$message.error('请求物流信息失败！')
      this.detailInfo = res.data
    },
    handleClose() {
      this.$emit('update:LogisticsInfoDialogVisible', false)
    }
  }
}
</script>

<style lang="less" scoped>

</style>