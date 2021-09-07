<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="logo_box">
          <img src="~assets/img/home/homeLogo.jpeg" />
          <span>购物街后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container id="content">
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle" @click="toggleCollapse">
            <i v-if="isCollapse" class="el-icon-s-unfold"></i>
            <i v-if="!isCollapse" class="el-icon-s-fold"></i>
          </div>
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409EFF"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menusList" :key="item.id">
              <template slot="title">
                <i :class="iconList[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item 
                v-for="childrenItem in item.children" 
                :index="'/' + childrenItem.path" 
                @click="saveState(childrenItem)"
                :key="childrenItem.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{childrenItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getMenuList } from 'network/home.js'
export default {
  name: "Home",
  data() {
    return {
      // 组件一开始要请求左边菜单数据
      menusList: [],
      // 左侧菜单一级菜单的icon
      iconList: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 标志左侧菜单的折叠状态
      isCollapse: false,
      // 标记当前home组件激活的二级菜单 ==> 对应的页面路由路径 ==> 右侧区域对应的组件
      activePath: ''
    }
  },
  // 一旦刷新就会重新创建该组件,在home组件中，对应的每个二级菜单，应该保持它的激活状态
  // ,因为你刷新，认为就是在该页面刷新（每个二级别菜单对应着一个页面）,这里采用sessionStorage暂存那个状态，你点谁就暂存那个激活的页面路径
  created() {
    this.getMenuList()
    // el-menu如果开启了路由模式，使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
    // 所以此时我们把二级菜单的index设置为对应的路由（别忘了 /）并且菜单的每个项的index是唯一标识不可重复
    // 故 此时点击(或者激活)二级菜单，就会跳转到路径为index的路由里面去
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 清除当前账号的token，理论上应该是每个账号都有自己对应的token，然后清除也是清除当前账号的token
      // 清除当前账号比如会用window.sessionStorage.removeItem(),清除当前账号对应的token
      window.sessionStorage.clear()
      this.$router.push("/login")
    },
    async getMenuList() {
      const res = await getMenuList()
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menusList = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveState(childrenItem) {
      window.sessionStorage.setItem('activePath', '/' + childrenItem.path)
      this.activePath = '/' + childrenItem.path
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100vh;
}
.iconfont {
  margin-right: 15px;
}
.el-container {
  height: 100%;
  .el-header {
    background-color: #42484e;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
      display: flex;
      align-items: center;
      img {
        border-radius: 50%;
        width: 50px;
      }
      span {
        padding-left: 30px;
        font-size: 30px;
        color: #fff;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
    .toggle {
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      cursor: pointer;
      i {
        font-size: 25px;
      }
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #ffffff;
  }
}
#content {
  height: calc(100vh - 60px);
}
</style>
