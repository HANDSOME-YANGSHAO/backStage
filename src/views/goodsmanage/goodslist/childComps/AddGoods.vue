<template>
  <div class="AddGoods">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        :closable="false"
      ></el-alert>

      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex * 1"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 左侧tab标签 -->
      <!-- 注意：tab组件规定的子节点只允许为tab-pane 面板组件，所以里面不可以写form表单嵌套面板 -->
      <el-form
        ref="addGoodsFormRef"
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        label-position="top"
        label-width="100px"
      >
        <el-tabs
          @tab-click="tabClicked"
          :before-leave="beforeTabLeave"
          v-model="activeIndex"
          :tab-position="'left'"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="goods_price">
              <el-input v-model.number="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="goods_number">
              <el-input v-model.number="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="重量" prop="goods_weight">
              <el-input v-model.number="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="选择分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="selectedProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 每个form-item对应了当前分类的一个动态参数，每个参数下面还有一系列的属性 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData" 
              :key="item.attr_id">
              <!-- 渲染每个动态参数的属性 -->
              <el-checkbox-group
                v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(tagName , index) in item.attr_vals"
                  :key="index" 
                  :label="tagName"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData" 
              :label="item.attr_name"
              :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 注意这里的action要绑定一个绝对路径，这里输入api文档里的是相对路劲，会拼接在goods/add后面，
            应该在拼接基础地址后面 -->
            <el-upload
              :action="upLoadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handSuccess"
              :headers="headersObj"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 填写商品简介的富文本编辑器 -->
            <quill-editor v-model="addGoodsForm.goods_introduce"/>
            <!-- 添加商品的按钮 -->
            <el-button @click="addGoods" type="primary" class="addBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片 -->
    <el-dialog
      title="预览"
      :visible.sync="previewVisible"
      width="50%">
      <img class="previewImg" :src="previewPath" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { addGoods } from "network/goodslist.js";
import { getCateList } from "network/categories.js";
import { getParamsList } from "network/params.js"

export default {
  name: "AddGoods",
  data() {
    return {
      activeIndex: "0",
      addGoodsForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "分类不能为空", trigger: "blur" },
        ],
      },
      cateList: [],
      selectedProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      manyTableData: [],
      onlyTableData: [],
      // 上传URL的路劲
      upLoadURL: 'https://lianghj.top:8888/api/private/v1/upload',
      // 因为这里upload组件是自己内部会去发送ajax请求
      // 没有用到axios，就没有携带token，此时发送的请求没有权限的
      // 这里手动配置请求头
      headersObj: {
        Authorization : window.sessionStorage.getItem('token')
      },
      // 预览图片路径：根据服务器返回过来的file信息得到真实的服务器图片地址
      previewPath: '',
      baseURL: 'https://lianghj.top:8888/',
      previewVisible: false
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const res = await getCateList();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.cateList = res.data;
    },
    handleChange() {
      // 只允许选择三级分类
      if(this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    // tab组件面板切换的钩子
    beforeTabLeave(activeName, oldActiveName) {
      if(oldActiveName === '0' && this.addGoodsForm.goods_cat.length !==3) {
        this.$message.error('请先选择分类！')
        return false
      }
    },
    // 点击tab事件
    async tabClicked() {
      // 如果是去动态参数面板，就根据当前分类id获取对应分类的动态参数
      if(this.activeIndex === '1') {
        const res = await getParamsList(this.cateId, 'many')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)       
        res.data.forEach(item => {
           item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTableData = res.data
      }
      // 去商品分类静态属性面板
      if(this.activeIndex === '2') {
        const res = await getParamsList(this.cateId, 'only')
        if (res.meta.status !== 200) return this.$message.error('获取分类属性失败！')
        this.onlyTableData = res.data
      }
    },
    // 预览触发的事件
    handlePreview(file) {
      console.log(file.response)
      this.previewPath = this.baseURL + file.response.data.tmp_path
      this.previewVisible = true
    },
    // 移除触发的事件
    handleRemove(file) {
    // 在服务器那边删除成功返回了文件参数信息
      // 1.获取需要删除的图片的当前路径
      const filePath = file.response.data.tmp_path
      // 2.从当前商品表单的图片路径数组里面，找到当前删除的
      // 图片路径的索引
      const i = this.addGoodsForm.pics.findIndex(item => item === filePath)
      // 3.根据商品图片路径数组删除对应图片
      this.addGoodsForm.pics.splice(i, 1)
    },
    // 图片上传服务器成功的事件，接收响应信息，以此来判断
    handSuccess (response) {
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addGoodsForm.pics.push(picInfo)
    },
    addGoods() {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if(!valid) return this.$message.error('请输入完整商品信息！')
        // 把该商品的分类的动态参数和静态属性添加到表单里面（只取参数或属性id，以及它们的tag）
        this.manyTableData.forEach(item => {
          const newInfo ={
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo ={
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        const res = await addGoods(this.addGoodsForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.activeIndex = '6'  
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if(this.addGoodsForm.goods_cat.length === 3) return this.addGoodsForm.goods_cat[2]
    }
  }
};
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 15px;
  margin-bottom: 15px;
}
/deep/ .el-step__title {
  font-size: 13px ;
}
.el-checkbox {
  margin: 0 10px 0 5px !important;
}
.previewImg {
  width: 100%;
}
/deep/ .ql-editor {
  height: 300px;
}
.addBtn {
  margin-top: 15px;
}
</style>
