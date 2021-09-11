<template>
  <div class="rights">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="权限路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level === '2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "network/rights.js";

export default {
  name: "Rights",
  data() {
    return {
      rightsList: [],
    };
  },
  created() {
    this.getRightsList("list");
  },
  methods: {
    async getRightsList(type) {
      const res = await getRightsList(type);
      if (res.meta.status !== 200) this.$message.error(res.meta.msg);
      this.rightsList = res.data;
    },
  },
};
</script>

<style lang="less" scoped></style>
