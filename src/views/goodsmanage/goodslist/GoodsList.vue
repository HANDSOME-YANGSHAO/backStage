<template>
  <div id="goodsList">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 首行 -->
      <el-row :gutter="20">
        <!-- 搜索行 -->
        <el-col :span="12">
          <el-input @keyup.enter.native="getGoodsList" v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="clearSearchInput">
            <el-button
              @click="search" 
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品 -->
        <el-col :span="4">
          <!-- 对话框版本 -->
          <!-- <el-button type="primary" @click="addGoodsDialogVisible = true">添加商品</el-button> -->
          <!-- 老师版本 -->
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表  -->
      <el-table :data="goodslist" border stripe style="width: 100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="goods_name"  label="商品名称" width="500px">
        </el-table-column>
        <el-table-column prop="goods_price"  label="商品价格（元）">
        </el-table-column>
        <el-table-column prop="goods_weight"  label="商品重量">
        </el-table-column>
        <el-table-column label="创建时间">
          <template v-slot:default="scope">
            {{scope.row.add_time | dateShow}}
          </template>
        </el-table-column>
        <el-table-column width="150px" label="操作">
          <template v-slot:default="scope">
            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editGoods(scope.row.goods_id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteGoods(scope.row.goods_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 编辑商品对话框 -->
    <!-- 正常版本 
        <EditGoodsDialog 
          :editGoodsDialogVisible="editGoodsDialogVisible" 
          @update:editGoodsDialogVisible="val => editGoodsDialogVisible = val"
        /> -->
    <!--语法糖版本  -->
    <EditGoodsDialog
      :goodsId="editGoodsId"
      @editGoods="getGoodsList"
      :editGoodsDialogVisible.sync="editGoodsDialogVisible"
    />
  </div>
</template>

<script>
// 接口
import { getGoodsList, deleteGoods } from "network/goodslist.js";
// 工具函数
import { formatDate } from "common/utiles.js"
// 子组件
import EditGoodsDialog from "./childComps/EditGoodsDialog"

export default {
  name: "GoodsList",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 8,
      },
      total: 0,
      goodslist: [],
      editGoodsDialogVisible: false,
      editGoodsId: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const res = await getGoodsList(this.queryInfo);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success('获取列表成功!')
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    search() {
      this.getGoodsList()
    },
    clearSearchInput() {
      this.getGoodsList()
    },
    async deleteGoods(id) {
      const confirmResult = await this.$confirm('此操作将删除该商品，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm' ) return this.$message.info('取消删除')
      const res = await deleteGoods(id)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getGoodsList()
    },
    addGoods() {
      this.$router.push('/goods/add')
    },
    editGoods(id) {
      this.editGoodsId = id
      this.editGoodsDialogVisible = true
    }
  },
  components: {
    EditGoodsDialog
  },
  filters: {
    dateShow(value) {
      let date = new Date(value * 1000);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  }
};
</script>

<style lang="less" scoped></style>
