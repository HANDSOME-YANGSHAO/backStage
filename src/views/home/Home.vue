<template>
  <div id="home">
    <h1>主页</h1>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    logout() {
      // 清除当前账号的token，理论上应该是每个账号都有自己对应的token，然后清除也是清除当前账号的token
      // 清除当前账号比如会用window.sessionStorage.removeItem(),清除当前账号对应的token
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped></style>
