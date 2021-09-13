<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图组件 -->
    <el-card>
      
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      
      <!-- table列表 -->
      <tree-table
        class="treeTable"
        :show-row-hover="false"
        show-index
        border
        :expand-type="false"
        :selection-type="false"
        :data="cateList" 
        :columns="columns">
        <!-- 是否有效列的作用域插槽 -->
        <template v-slot:isOk="scope">
          <i 
            style="color: green;"
            v-if="!scope.row.cat_deleted"
            class="el-icon-success"></i>
          <i
            style="color: red;"
            v-else
            class="el-icon-error"></i>
        </template>
        <!-- 排序作用域插槽 -->
        <template #order="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" size="mini" type="success">二级</el-tag>
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>
        <!-- 编辑作用域插槽 -->
        <template #opt="scope">
          <el-button @click="showEditCateDialog(scope.row.cat_id)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button @click="deleteCate(scope.row.cat_id)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="添加分类"
      :visible.sync="addCateDialogVisiable"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 主题区域 （自定义在这个区域添加内容）-->
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="选择分类">
          <!-- option对应数据源 -->
          <!-- props对应着选择器的配置项 -->
          <el-cascader
            clearable
            v-model="selectedKeys"
            :options="parentCateList"
            :props="selectedProps"
            @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="编辑当前分类信息"
      :visible.sync="editCateDialogVisiable"
      width="50%"
      @close="editCateDialogClose"
    >
    <!-- 主体区域 -->
      <el-form
        ref="editCateFormRef"
        :model="editCateForm"
        :rules="editCateFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
    <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import { getCateList, addCate, getCateById, editCateById, deleteCateById } from "network/categories.js"
export default {
  name: "Categories",
  data() {
    return {
      // 查询分类列表接口需要的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 分类列表
      cateList: [],
      // 分类列表的条数
      total: 0,
      // tree-table的列规定
      columns: [
        {
            label: '分类名称',
            prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 将当前列定义为模板列
          type: 'template',
          // 表示当前列使用的模板名称
          template: 'isOk'
        },
        {
          label: '排序',
          // 将当前列定义为模板列
          type: 'template',
          // 表示当前列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 将当前列定义为模板列
          type: 'template',
          // 表示当前列使用的模板名称
          template: 'opt',
          minWidth: '100px'
        }
      ],
      // 添加分类对话框显示
      addCateDialogVisiable: false,
      // 添加分类对话框内表单内容
      addCateForm: {
        // 当前所添加的分类的父id（0默认是一级分类）
        cat_pid: 0,
        cat_name: '',
        // 当前所添加的分类的等级
        cat_level: 0
      },
      // 添加分类对话框内表单的验证规则
      addCateFormRules: {
        cat_name: [
          {required: true, message: '请填写分类名称!', trigger: 'blur'}
        ]
      },
      // 2层分类列表（1级和2级别）
      parentCateList: [],
      // 选择分类得配置对象props
      selectedProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 级联选择器选中的value(props里设置的id)，存储在这里
      selectedKeys: [],
      // 编辑当前对话框的显示标志
      editCateDialogVisiable: false,
      // 编辑分类表单
      editCateForm: {},
      // 编辑分类表单验证规则
      editCateFormRules: {
        cat_name: [
          {required: true, message: '请填写分类名称!', trigger: 'blur'}
        ]
      },
      // 当前编辑中分类的id
      editId: 0
    };
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 请求分类列表信息
    async getCateList() {
      const res = await getCateList(this.queryInfo)
      if(res.meta.status !== 200) return this.$message.error('请求分类列表失败！')
      // 在保存数据的时候，建议仔细阅读接口文档，查阅返回来的数据是什么
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 当前页数发生变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 当页数据总条数发生变化
    handleCurrentChange(newPageSize) {
      this.queryInfo.pagenum = newPageSize
      this.getCateList()
    },
    // 展示添加分类的对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisiable = true
    },
    // 获取所有父级分类(两层信息，也就是一级和二级分类)信息列表
    async getParentCateList() {
      const res = await getCateList({ type:2 })
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentCateList = res.data
    },
    // 级联选择器选中分类的事件
    handleChange() {
      // 选了父级的分类
      if(this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
        this.addCateForm.cat_level = this.selectedKeys.length
      }
      // 没选父级分类默认是添加一级分类 
      else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类提交表单
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return
        const res = await addCate(this.addCateForm)
        if(res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.getCateList()
        this.$message.success('添加分类成功!')
        this.addCateDialogVisiable = false
      })
    },
    // 关闭添加分类对话框
    addCateDialogClose() {
      // 注意：调用表单对象的此方法，只会对表单对象里双向绑定的属性进行清空验证
      // 其它没有双向绑定的，需要手动清空！！算是个坑吧
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 打开编辑对话框
    async showEditCateDialog(id) {
      this.editId = id
      const res = await getCateById(id)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editCateForm = res.data
      this.editCateDialogVisiable = true
    },
    // 提交编辑分类信息
    editCate() {
      this.$refs.editCateFormRef.validate( async valid => {
      if(!valid) return
      const res = await editCateById(this.editId, this.editCateForm.cat_name)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getCateList()
      this.$message.success('编辑成功！')
      this.editCateDialogVisiable = false
      })
    },
    // 关闭编辑对话窗
    editCateDialogClose() {
      this.$refs.editCateFormRef.resetFields()
      this.editId = 0
    },
    // 删除分类
    async deleteCate(id) {
      const confirmResult = await this.$confirm('此操作将删除该分类，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult != 'confirm') return this.$message.info('取消删除')
      const res = await deleteCateById(id)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getCateList()
      this.$message.success(res.meta.msg)
    }
  },
};
</script>

<style lang="less" scoped>
  .treeTable {
    margin-top: 15px;
  }
  .el-cascader {
    width: 100%;
  }
</style>
