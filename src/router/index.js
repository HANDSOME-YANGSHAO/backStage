import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ 'views/login/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ 'views/home/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ 'views/home/childComps/Welcome.vue')

const users = () => import(/* webpackChunkName: "users_roles_rights" */ 'views/users/Users.vue')
const rights = () => import(/* webpackChunkName: "users_roles_rights" */ 'views/power/Rights.vue')
const roles = () => import(/* webpackChunkName: "users_roles_rights" */ 'views/power/Roles.vue')

const categories = () => import(/* webpackChunkName: "categories_params" */ 'views/goodsmanage/Categories.vue')
const params = () => import(/* webpackChunkName: "categories_params" */ 'views/goodsmanage/Params.vue')

const goods = () => import(/* webpackChunkName: "goods_add" */ 'views/goodsmanage/goodslist/GoodsList.vue')
const add = () => import(/* webpackChunkName: "goods_add" */ 'views/goodsmanage/goodslist/childComps/AddGoods.vue')

const orders = () => import(/* webpackChunkName: "orders_reports" */ 'views/orders/Orders.vue')
const reports = () => import(/* webpackChunkName: "orders_reports" */ 'views/reports/Reports.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
    // component: () => import('views/login/Login.vue') 
  },
  {
    path: '/home',
    component: Home,
    // component: () => import('views/home/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
        // component: () => import('views/home/childComps/Welcome.vue')
      },
      {
        path: '/users',
        component: users
        // component: () => import('views/users/Users.vue')
      },
      {
        path: '/rights',
        component: rights
        // component: () => import('views/power/Rights.vue')
      },
      {
        path: '/roles',
        component: roles
        // component: () => import('views/power/Roles.vue')
      },
      {
        path: '/categories',
        component: categories
        // component: () => import('views/goodsmanage/Categories.vue')
      },
      {
        path: '/params',
        component: params
        // component: () => import('views/goodsmanage/Params.vue')
      },{
        path: '/goods',
        component: goods
        // component: () => import('views/goodsmanage/goodslist/GoodsList.vue')
      },{
        path: '/goods/add',
        component: add
        // component: () => import('views/goodsmanage/goodslist/childComps/AddGoods.vue')
      },{
        path: '/orders',
        component: orders
        // component: () => import('views/orders/Orders.vue')
      },{
        path: '/reports',
        component: reports
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
