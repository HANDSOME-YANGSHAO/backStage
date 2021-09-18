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
// 导入富文本编辑器组插件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


Vue.config.productionTip = false

// 自行全局注册这个组件 
Vue.component('tree-table', TreeTable)
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
// 注册安装全局的富文本编辑组件
Vue.use(VueQuillEditor)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
