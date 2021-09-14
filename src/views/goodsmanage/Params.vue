<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示警告-->
      <el-alert
        :closable="false"
        title="注意：只允许为第三级分类设置参数！"
        type="warning"
        show-icon
      >
      </el-alert>

      <!-- 操作行 -->
      <el-row>
        <el-col>
          <span>请选择商品分类: </span>
          <!-- 分类级联选择框 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="selectedProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页标签 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加动态参数按钮 -->
          <el-button
            @click="addDialogVisible = true"
            size="mini"
            type="primary"
            :disabled="isBtnDisbaled"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>                
              </template>
            </el-table-column>
            <!-- 序号列 -->
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  >编辑</el-button
                >
                <el-button
                  @click="deleteParams(scope.row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            @click="addDialogVisible = true"
            size="mini"
            type="primary"
            :disabled="isBtnDisbaled"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 序号列 -->
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  >编辑</el-button
                >
                <el-button
                  @click="deleteParams(scope.row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      
    </el-card>

    <!-- 添加的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 添加表单 -->
      <el-form
        label-width="100px"
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 添加表单 -->
      <el-form
        label-width="100px"
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList } from "network/categories.js";
import {
  getParamsList,
  addParams,
  getParams,
  editParams,
  deleteParams,
  changeTag
} from "network/params.js";
export default {
  name: "Params",
  data() {
    return {
      // 级联选择框相关的数据
      cateList: [],
      selectedKeys: [],
      selectedProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 页标签激活项对应的名字
      activeName: "many",
      // 动态参数表格数据
      manyTableData: [],
      // 静态属性表格数据
      onlyTableData: [],
      // 添加对话框显示数据
      addDialogVisible: false,
      // 添加表单的相关数据
      addForm: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入相关信息！", trigger: "blur" },
        ],
      },
      // 修改对话框内容
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入相关信息！", trigger: "blur" },
        ],
      },

    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取分类级联框的分类列表
    async getCateList() {
      const res = await getCateList();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.cateList = res.data;
    },
    // 处理级联选择框的值改变
    handleChange() {
      this.getParamsList();
    },
    // tab页标签点击的事件
    handleClick() {
      this.getParamsList();
    },
    // 判断如果当前是三级分类则发起请求参数列表
    async getParamsList() {
      // 如果不是三级分类则不进行选择
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      // 确定是三级分类
      const res = await getParamsList(this.cateId, this.activeName);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // 对数据做预处理(方便表格扩展列展示数据)
      res.data.forEach((row) => {
        // ''.split(' ') => [''] 空字符串被用split函数用空格分隔，会被分割成一个长度唯一数组，此时也会被渲染出来
        // 但其实空参数应该啥也不渲染，所以应该让此时attr_vals为空数组，就不会渲染el-tag了（v-for）
        row.attr_vals = row.attr_vals ? row.attr_vals.split(" ") : [];
        // 为每个扩展行，添加tag提供切换标记和值
        this.$set(row, 'inputVisible', false)
        this.$set(row, 'inputValue', '')
      });
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 添加对话框关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击确定，添加参数
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const res = await addParams(
          this.cateId,
          this.addForm.attr_name,
          this.activeName
        );
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.getParamsList();
        this.$message.success(res.meta.msg);
        this.addDialogVisible = false;
      });
    },
    // 修改对话框
    async showEditDialog(attr_id) {
      const res = await getParams(this.cateId, attr_id, this.activeName);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
      this.editForm = {};
    },
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const res = await editParams(this.editForm);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.getParamsList();
        this.$message.success(res.meta.msg);
        this.editDialogVisible = false;
      });
    },
    async deleteParams(attrId) {
      const confirmResult = await this.$confirm(
        "此操作将删除该" + this.titleText + "，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") return this.$message.info("取消删除");
      const res = await deleteParams(this.cateId, attrId);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.getParamsList();
    },
    //  参数tag
    async saveAttr_vals(row) {
      const res = await changeTag(row)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(`更新成功！`)
    },
    async handleInputConfirm(row) {
      // 如果输入不合法的内容比如一群空格则返回
      if(row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 认为输入的东西是合法字符串，执行下列操作
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttr_vals(row)
    },
    showInput(row) {
      row.inputVisible = true
      // 当页面元素被重新渲染之后，会执行$nextTick函数传入的回调函数
      // 这个时候能保证input被渲染出来，然后再去聚焦，如果不这样做直接聚焦
      // 有可能inputVisible=false的时候，元素还没有被渲染出来，就去聚焦
      // 找不到input，就报错了
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttr_vals(row)
    }
  },
  computed: {
    // 判断按钮的禁用状态，选择了三级分类才能激活按钮
    isBtnDisbaled() {
      return this.selectedKeys.length !== 3;
    },
    // 当前分类的ID
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      }
    },
    // 对话框的标题
    titleText() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin: 15px 0;
}
.el-tag {
  margin: 5px 15px 5px;
}
.input-new-tag{
  width: 150px;
}
</style>
