import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


// 导入初始化样式
import 'assets/css/global.css'
// 导入第三方字体图标库
import 'assets/fonts/iconfont.css'

Vue.config.productionTip = false

// 自行全局注册这个组件 
Vue.component('tree-table', TreeTable)
// 注册安装全局的富文本编辑组件
Vue.use(VueQuillEditor)
// 注册一个全局的时间戳过滤器
Vue.filter('dateFormat', originValue => {
  const dt = new Date(originValue)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
