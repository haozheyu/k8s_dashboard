import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import Vuex from '@/views/Vuex.vue'
import Resource from '@/views/Resource.vue'
import Templeton from '@/views/Templeton.vue'
import Stores from '@/views/Stores.vue'
import Images from '@/views/Images.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: true,
  },
  {
    path: '/Resource',
    name: '资源中心',
    component: Resource
  },
  {
    path: '/pod',
    name: 'pod',
    component: import('@/views/resource/Pod.vue'),
    props: true,
    meta: { title: 'pod管理' }
  },
  {
    path: '/podInfo',
    name: 'podInfo',
    component: import('@/views/resource/PodInfo.vue'),
    props: true,
    meta: { title: 'pod详情页面' }
  },
  {
    path: '/deployments',
    name: 'deployments',
    component: () => import('@/views/resource/Deployments.vue'),
    props: true,
    meta: { title: 'deployments' }
  },
  {
    path: '/webShell',
    name: 'webShell',
    component: () => import('@/views/Xterm.vue'),
    props: true,
    meta: { title: 'deployments' }
  },
  {
    path: '/statefulSets',
    name: 'statefulSets',
    component: () => import('@/views/resource/StatefulSets.vue'),
    props: true,
    meta: { title: 'statefulSets' }
  },
  {
    path: '/Stores',
    name: '存储管理',
    component: Stores
  },
  {
    path: '/Templeton',
    name: '配置管理',
    component: Templeton
  },
  {
    path: '/Images',
    name: '镜像管理',
    component: Images
  },
  {
    path: '/vuex',
    name: 'Vuex',
    component: Vuex
  },
  {
    path: '/axios',
    name: 'Axios',
    component: () => import('@/views/Axios.vue') // 懒加载 Axios 组件
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue') // 懒加载 Axios 组件
  }
]

const router: Router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(), // 带#
  routes
})

export default router
