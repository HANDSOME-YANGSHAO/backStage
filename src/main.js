import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入初始化样式
import 'assets/css/global.css'
// 导入第三方字体图标库
import 'assets/fonts/iconfont.css'
// 导入第三方的树形表格，这种第三方的组件一般可以去github上面看源码，有教你用法，相当于是别人写好的轮子
import TreeTable from "vue-table-with-tree-grid"


Vue.config.productionTip = false

// 自行全局注册这个组件 
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
