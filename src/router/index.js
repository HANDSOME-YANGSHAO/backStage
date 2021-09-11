import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('views/login/Login.vue') // 懒加载
  },
  {
    path: '/home',
    component: () => import('views/home/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('views/home/childComps/Welcome.vue')
      },
      {
        path: '/users',
        component: () => import('views/users/Users.vue')
      },
      {
        path: '/rights',
        component: () => import('views/power/Rights.vue')
      },
      {
        path: '/roles',
        component: () => import('views/power/Roles.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach( (to, from, next) => {
  // 1.去登陆界面放行
  if(to.path === '/login') return next()

  // 2.去非登陆界面，判断你是否有相关的权限，有权限就放行
  const token = window.sessionStorage.getItem('token')
    //  2.1 如果token不存在就跳去登陆界面
  if(!token) return next('/login')
    //  2.2 存在就放行(但其实理论上还要对token是否正确进行验证，不然随随便便创造一个token就进去了，
    //  所以开发中可能还会在这里去发送请求去验证token的正确与否，正确了就放行，不正确同样跳转到登陆界面)
  next()
  
})

export default router
