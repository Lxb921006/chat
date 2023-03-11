import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: 'index',
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

export default router
