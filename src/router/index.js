import { createRouter, createWebHistory } from 'vue-router';
import { routeManager } from './asyncRoutes';

// 默认路由
const defaultRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: { title: '登录' },
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('@/views/error/index.vue'),
    hidden: true,
    meta: { title: '错误' },
  },
];

// 布局路由（静态部分）
export const asyncRoutes = [
  {
    path: '/',
    name: 'layout',
    redirect: '/index',
    component: () => import('@/components/MainLayout/index.vue'),
    hidden: false,
    children: [
      {
        path: '/index',
        name: 'index',
        component: () => import('@/views/index/index.vue'),
        hidden: false,
        meta: { title: '首页', icon: '' },
      },
    ],
  },
];

// 创建 Router 实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...defaultRoutes, ...asyncRoutes],
});

export default router;