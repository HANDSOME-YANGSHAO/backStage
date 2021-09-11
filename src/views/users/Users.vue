<template>
  <div class="users">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片组件 -->
    <el-card>
      <!-- 这一行用栅栏布局实现搜索功能 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- table组件 -->
      <el-table stripe border :data="userList">
        <el-table-column type="index" label="序号" width="60px"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange($event)"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 8]"
        :page-size="queryInfo.pagesize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </el-card>

    <!-- 添加成员的对话窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="添加用户"
      @close="addFormClose"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <!-- 主题区域 （自定义在这个区域添加内容）-->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑的对话窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="编辑用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <!-- 主题区域 （自定义在这个区域添加内容）-->
      <el-form
        ref="editFormRef"
        label-width="70px"
        :rules="addFormRules"
        :model="editForm"
      >
        <el-form-item label="用户">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="editDialogClose">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      @close="setRoleDialogClose"
      :close-on-click-modal="false"
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
    >
      <div>
        <p>用户名：{{this.userInfo.username}}</p>
        <p>当前角色：{{this.userInfo.role_name}}</p>
        <p>分配角色
            <el-select v-model="selectedRoleId" placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
          </el-select>
        </p>
      </div>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsersList,
  userStateChange,
  addUser,
  getUserById,
  editUserInfo,
  deleteUser,
  setRole
} from "network/users.js";
import { getRoleList } from 'network/role.js'
export default {
  name: "Users",
  data() {
    var checkEmail = (rule, value, callback) => {
      const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (emailReg.test(value)) return callback();
      callback(new Error("请输入正确的邮箱"));
    };
    var checkMobile = (rule, value, callback) => {
      const phoneReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      if (phoneReg.test(value)) return callback();
      callback(new Error("请输入正确的手机号码"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 8,
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "请输入长度为3到12个字符的信息",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "请输入长度为6到15个字符的信息",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      editDialogVisible: false,
      editForm: {},
      setRoleDialogVisible: false,
      userInfo: {},
      roleList: [],
      selectedRoleId: ''
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    // 根据当前页面的参数去请求用户的数据
    async getUsersList() {
      const params = this.queryInfo;
      const res = await getUsersList(params);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // 这个请求会在users这个界面频繁用到，请求成功就不做消息提示了
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 改变用户的状态请求(el-switch 这个组件监听状态更改)
    async userStateChange(userInfo) {
      const res = await userStateChange(userInfo.id, userInfo.mg_state);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
    },

    // 监听这个组件的当页数量变化，一旦变化了就让组件的页面参数发生变化，并获取最新得数据
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize;
      this.getUsersList();
    },
    // 监听这个组件的页数变化，一旦变化就让组件的页面参数发生变化，并获取最新得数据
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUsersList();
    },
    addFormClose() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        // 这里表单预验证方法里面的回调函数会传进一个布尔值表明预验证的结果，这个回调函数会在预验证结束时候执行，并根据验证成功与否
        // 实现对应的逻辑
        if (!valid) return;
        // 验证成功，把用户数据请求过去
        const res = await addUser(this.addForm);
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success("用户添加成功!");
        this.getUsersList();
        this.addDialogVisible = false;
      });
    },
    async showEditDialog(id) {
      const res = await getUserById(id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
      this.editDialogVisible = false;
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const res = await editUserInfo(this.editForm);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.editDialogVisible = false;
        this.getUsersList();
        this.$message.success(res.meta.msg);
      });
    },
    // 根据id删除用户
    async deleteUser(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消删除");
      const res = await deleteUser(id);
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getUsersList();
      this.$message.success(res.meta.msg);
    },
    // 打开设置角色的对话框
    async showSetRoleDialog(userInfo) {
      this.userInfo = userInfo
      const res = await getRoleList();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg); 
      this.roleList = res.data
      this.setRoleDialogVisible = true
    },
    // 点击确定，给用户分配角色
    async setRole() {
      if(!this.selectedRoleId) return this.$message.error('请选择要分配的角色！')
      const res = await setRole(this.userInfo.id, this.selectedRoleId)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUsersList()
      this.setRoleDialogVisible = false
    },
    // 关闭分配角色对话框
    setRoleDialogClose() {
      this.selectedRoleId = ''
      this.userInfo = ''
    }
  },
};
</script>

<style lang="less" scoped></style>
