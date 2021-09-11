<template>
  <div class="roles">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图 -->
    <el-card>

      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button
            @click="addRoleDialog = true"
            type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="roleList" border stripe>

        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 有几个一级权限，就有几行 -->
            <el-row
              :class="['bd-b', index1 === 0 ? 'bd-t' : '', 'center']"
              v-for=" (item1, index1) in scope.row.children" 
              :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag 
                  @close="removeRight(scope.row, item1.id)"
                  closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二、三级权限 -->
              <el-col :span="19">
                <!-- 有几个二级权限，就有几行 -->
                <el-row
                  :class="[index2 !== 0 ? 'bd-t' : '', 'center']"
                  v-for="(item2, index2) in item1.children" 
                  :key="item2.id">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag 
                      @close="removeRight(scope.row, item2.id)"
                      closable
                      type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      @close="removeRight(scope.row, item3.id)"
                      closable
                      type="warning"
                      v-for="item3 in item2.children" 
                      :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 序号列 -->
        <el-table-column
          type="index"
          label="序号"
          width="60px"
        ></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
        ></el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="300px"
        >
          <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              >编辑</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteRole(scope.row.id)"
              >删除</el-button>
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRightDialog(scope.row)"
              >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="添加角色"
      @close="addRoleFormClose"
      :visible.sync="addRoleDialog"
      width="50%">
      <el-form
        ref="addRoleFormRefs"
        :rules="addRoleFormRules"
        :model="addRoleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色的对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="编辑角色"
      @close="editRoleFormClose"
      :visible.sync="editRoleDialog"
      width="50%">
      <el-form
        ref="editRoleFormRefs"
        :rules="editRoleFormRules"
        :model="editRoleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      @close="setRightDialogClose"
      :close-on-click-modal="false"
      title="分配权限"
      :visible.sync="setRightDialog"
      width="50%">
      <!-- 对话框的主体区域 -->
      <el-tree
        ref="treeRef"
        :default-checked-keys="defTreeNodeKeys"
        :data="rightsList" 
        :props="treeProps"
        :show-checkbox="true" 
        node-key="id"
        :default-expand-all="true"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, addRole, editRole, getRoleById, deleteRole, deleteRight, setRoleRights  } from "network/role.js";
import { getRightsList } from 'network/rights.js'
export default {
  name: "Roles",
  data() {
    return {
      rightsList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认被选中的树节点，根据树节点的key值做对应
      defTreeNodeKeys: [],
      roleList: [],
      addRoleDialog: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleFormRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '请输入角色相关描述', trigger: 'blur'}
        ]
      },
      editRoleDialog: false,
      editRoleForm: {},
      editRoleFormRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '请输入角色相关描述', trigger: 'blur'}
        ]
      },
      setRightDialog: false,
      roleId: 0
    };
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleList();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.roleList = res.data;
    },
    // 添加角色(确定)
    addRole() {
      // 预验证
      this.$refs.addRoleFormRefs.validate(async valid => {
        if(!valid) return
        const res = await addRole(this.addRoleForm)
        if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.addRoleDialog = false
        this.getRoleList()
        this.$message.success(res.meta.msg)
      })
    },
    // 关闭添加角色对话框
    addRoleFormClose() {
      this.$refs.addRoleFormRefs.resetFields()
    },
    // 打开编辑角色的对话框
    async showEditDialog(id) {
      const res = await getRoleById(id)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editRoleForm = res.data
      this.editRoleDialog = true
    },
    // 关闭编辑角色对话框
    editRoleFormClose() {
      this.$refs.editRoleFormRefs.resetFields()
    },
    // 编辑角色（确定按钮）
    editRole() {
      // 预验证
      this.$refs.editRoleFormRefs.validate(async valid => {
        if(!valid) return
        const res = await editRole(this.editRoleForm)
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editRoleDialog = false
        this.getRoleList()
        this.$message.success('角色信息更改成功')
      })
    },
    // 删除角色(id)
    async deleteRole(id) {
      const confirmResult = await this.$confirm('此操作将删除该角色，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult != 'confirm') return this.$message.info('取消删除')
      const res = await deleteRole(id)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getRoleList()
      this.$message.success(res.meta.msg)
    },
    // 根据id删除该用户权限
    async removeRight(role, rightId) {
      const confirmResult = await this.$confirm('此操作将删除该角色对应权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm') return this.$message.info('取消删除')
      const res = await deleteRight(role.id, rightId)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      role.children = res.data
    },
    // 点击分配角色按钮，为指定角色分配权限
    async showSetRightDialog(role) {
      // 保存这个roleId给确定按钮用
      this.roleId = role.id
      // 显示弹框前，请求所有权限的权限树
      const res = await getRightsList("tree")
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data
      this.getLeafKeys(role, this.defTreeNodeKeys)
      this.setRightDialog = true
    },
    // 递归查询出最深的子权限，把其id放到默认权限id的数组中
    getLeafKeys(node, arr) {
      // 节点对象判断依据：没有子权限
      if(!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 关闭分配权限的对话框
    setRightDialogClose() {      
      this.defTreeNodeKeys = []
    },
    // 点击确定，给当前角色分配权限
    async allotRights() {
      // 拿到当前树组件勾选的权限key => id(一一对应,通过node-key属性设置的)
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const rids = keys.join(',')
      const res = await setRoleRights(this.roleId, rids)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRoleList()
      this.setRightDialog = false
    }
  }
};
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px
  }
  .bd-t {
    border-top: 1px solid #eee;
  }
  .bd-b {
    border-bottom: 1px solid #eee;
  } 
  .center {
    display: flex;
    align-items: center;
  }
</style>
