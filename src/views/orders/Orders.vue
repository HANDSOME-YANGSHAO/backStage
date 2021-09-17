<template>
  <div id="Orders">
        <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图组件 -->
    <el-card>
      
      <el-row :gutter="20">
          <el-col :span="12">
            <el-input @keyup.enter.native="search" v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="search">
              <el-button
                @click="search" 
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-col>
      </el-row>

      <!-- 商品列表  -->
      <el-table :data="orderList" border stripe style="width: 100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="order_number"  label="订单编号" width="400px">
        </el-table-column>
        <el-table-column prop="order_price"  label="订单价格">
        </el-table-column>
        <el-table-column label="是否付款">
          <template v-slot:default="scope">
            <el-tag v-if="scope.row.pay_status ==='1' "  type="success" >已付款</el-tag>
            <el-tag v-else type="danger" >未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send"  label="是否发货">
        </el-table-column>  
        <el-table-column label="下单时间">
          <template v-slot:default="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column prop="goods_weight"  width="150px" label="操作">
          <template>
            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="AddAddressDialogVisible = true"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="下单地点"
              placement="top"
            >
              <el-button
                type="success"
                icon="el-icon-location-outline"
                size="mini"
                @click="showLogisticsInfo"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页组件 -->
      <el-pagination
        :page-sizes="[1, 5, 8, 10]"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="total">
      </el-pagination>

    </el-card>

    <!-- 编辑的对话框 -->
    <AddAddress :AddAddressDialogVisible.sync="AddAddressDialogVisible" />
    <!-- 物流信息的对话框 -->
    <LogisticsInfo :LogisticsInfoDialogVisible.sync="LogisticsInfoDialogVisible"/>
  </div>

</template>

<script>
import AddAddress from "./childComps/AddAddress"
import LogisticsInfo from "./childComps/LogisticsInfo.vue"

import { getOrderList } from "network/orders.js"
export default {
  name: 'Orders',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8
      },
      total: 0,
      orderList: [],
      AddAddressDialogVisible: false,
      LogisticsInfoDialogVisible: false
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const res = await getOrderList(this.queryInfo)
      if(res.meta.status !== 200) this.$message.error('请求订单列表失败！')
      // this.$message.success('请求订单列表成功!')
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    search() {
      this.getOrderList()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showLogisticsInfo() {
      this.LogisticsInfoDialogVisible = true
    }
  },
  components: {
    AddAddress,
    LogisticsInfo
  }
}
</script>

<style lang="less" scoped>

</style>