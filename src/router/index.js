import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: { name: '登录' },
    component: () => import('../views/login/login')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "about" */ '../views/test/test.vue')
  },
  {
    path: '/',
    name: 'home',
    redirect: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/home/home.vue'),
    children: [
      {
        path: '/index',
        name: 'index',
        component: () => import(/* webpackChunkName: "about" */ '../views/index/index.vue')
      },
      {
        path: '/chat',
        name: 'chat',
        component: () => import(/* webpackChunkName: "about" */ '../views/chat/chat.vue')
      },
      {
        path: '/img',
        name: 'img',
        component: () => import(/* webpackChunkName: "about" */ '../views/img/img.vue')
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 当if条件都成立时, next("/index")跳转到index页面, 此时的router.beforeEach并没有结束, 需要调用next()作为跳出出口,否则会发生死循环
router.beforeEach((to, from, next) => {
  let user = sessionStorage.getItem('user');
  if (to.path != '/login' && !user) {
      next('/login');
  } else {
      if (to.path == '/login' && user) {
          next('/index'); 
      } else {
          // 必须调用next(), 否则死循环
          next(); 
      }
  }
});

export default router
