<template>
  <div id="welcome">
    <span class="title">欢迎光临~</span>
  </div>
</template>

<script>
export default {
  name: 'Welcome'
}
</script>

<style lang="less" scoped>
  #welcome {
    position: relative;
    background: url("~assets/img/login/bg9.jpg") no-repeat;
    background-size:100% 100%;
    width: 100%;
    height: 100%;
    color: rgb(44, 40, 40);
    .title {
      font-size: 100px;
      line-height: 100px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -80%);
    }
  }
</style>