<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="box_avatar">
        <img src="~assets/img/home/homeLogo.jpeg">
      </div>  
      <!-- 登陆的表单区域 -->
      <div class="login_form">
        <el-form
          ref="loginFormRef"
          label-width="0px" 
          :model="loginForm"
          :rules="loginFormRules">
          <el-form-item prop="username">
            <el-input 
              placeholder="用户名"
              prefix-icon="iconfont icon-user" 
              v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码" 
              prefix-icon="iconfont icon-3702mima" 
              v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item class="form_buttons">
           <el-button
            @click="login"
            type="primary">登陆</el-button>
           <el-button 
            @click="resetloginForm"
            type="info">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getLogin } from 'network/login.js'

export default {
  name: 'LoginForm',
  data() {
    return {
      // 定义了表单数据存储对象
      loginForm: {
        username: '',
        password: ''
      },
      // 定义了表单数据验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入活动用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '用户名长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 定义了重置按钮方法
    resetloginForm() {
      this.$refs['loginFormRef'].resetFields()
    },
    // 定义登陆事件
    login() {
      // 登陆之前预验证(该验证函数会先对表单规则进行验证，然后把布尔类型验证结果返回，根据结果进行相关的操作)
      this.$refs['loginFormRef'].validate( async valid => {
        if( !valid ) return console.log('请正确输入登陆信息');
        const res = await getLogin({
            username: this.loginForm.username,
            password: this.loginForm.password
        })
        // $message是elementui在全局挂载的一个组件，类似于我之前自己封装的$toast，调用这个挂载的组件的方法让其显示和消失
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg)
        // 登陆成功，保存token（jwt），这里需求是关闭网页就清空token，所以保存在sessionStorage中
        //  注意:实际开发中,一般根据当前账号的userid生成当前账号自己的token名,到时候退出的时候就删除对应的token
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    height: 100%;
    background: #545c64c7;
    position: relative;
    .login_box {
      width: 450px;
      height: 300px;
      background-color: #fff;
      border-radius: 3px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .box_avatar {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    padding: 0 20px;
    .form_buttons {
      display: flex;
      justify-content: flex-end;
      button {
        width: 80px;
      }
    }
  }
</style>