<template>
  <div id="welcome">
    <el-tooltip class="item" effect="dark" content="收起卡片" placement="left">
      <el-button @click="collapse" v-if="isShow" type="success" icon="el-icon-arrow-down" circle></el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="打开卡片" placement="left">
      <el-button @click="collapse" v-if="!isShow" type="warning" icon="el-icon-arrow-right" circle></el-button>
    </el-tooltip>

    <el-card v-show="isShow" class="about">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>欢迎</el-breadcrumb-item>
      </el-breadcrumb>
      <h1>个人网站介绍：</h1>
      <p>本网站主要是记录自己平时的学习成果，也是自己的项目demo首次上线，后面等自己技术再成熟一点，想要手动搭建一个自己个人博客，在下面是我的代码仓库，掘金文章，其它的小项目以及个人联系方式，本网站还比较粗糙，我会持续维护嗒，欢迎互相交流学习，如果有什么好的建议也欢迎批评和指正！</p>
      <el-alert
        title="提示：要打开右下方supermll项目，点击进去之后切换到控制台,然后切换成移动端展示，再刷新一次方可正常显示"
        type="warning">
      </el-alert>
    </el-card>

    <el-card class="info" v-show="isShow">
      <Info class="info_icons"/>
      <el-divider>看这里！</el-divider>
    </el-card>

  </div>
</template>

<script>
import Info from "./Info"
export default {
  name: "Welcome",
  data() {
    return {
      isShow: true
    }
  },
  components: {
    Info
  },
  methods: {
    collapse() {
      this.isShow = !this.isShow
      if(this.isShow) {
        
      }
    }
  }
}
</script>

<style lang="less" scoped>
#welcome {
  background: url(~assets/img/common/e.gif);
  background-size:cover;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.info {
  position: absolute;
  height: 130px;
  right: 20px;
  bottom: 40px;
  .info_icons {
    margin-top: 10px;
    position: relative;
    z-index: 10;
  }
}
.about {
  top: 10%;
  margin: 10px;
  height: 55%;
  position: relative;
}
.el-alert {
  position: absolute;
  width: 95%;
  height: 20%;
  bottom: 10px;
}
.el-button {
  position: absolute;
  top: 10px;
  right: 10px
}
</style>
