import router from './index';
import { useAuthStore } from "@/stores/authStore";
import { routeStore } from "@/stores/routeStore";
import { routeManager } from './asyncRoutes';

let isDynamicRoutesLoaded = false;

export function setupRouterGuard() {
  const authStore = useAuthStore();
  const routeStores = routeStore();

  router.beforeEach(async (to, from, next) => {
    Nloading.start();
    const token = authStore.getToken();
    routeStores.setRouteStatus(false);    
    routeStores.addKeepAliveRoutes(to)
    // 如果用户有 token
    if (token) {
      // 如果访问的是登录页，重定向到首页
      if (to.path === '/login') {
        routeStores.removeAllKeepAliveRoutes()
        return next('/index');
      }

      // 如果路由已经加载过动态路由，不重复加载
      if (!isDynamicRoutesLoaded) {
        try {
          const dynamicRoutes = await routeManager.loadDynamicRoutes();
          // 添加路由到 router
          addNestedRoutes('layout', dynamicRoutes);

          isDynamicRoutesLoaded = true;
          return next({ ...to, replace: true });  // 重定向到当前路由以确保动态路由已加载
        } catch (error) {
          console.error('加载动态路由失败:', error);
          authStore.removeAll()
          routeStores.removeAllKeepAliveRoutes()
          return next('/login');
        }
      }

      // 动态路由已加载，直接进入页面
      next();
    } else {
      // 如果没有 token，跳转到登录页
      if (to.path === '/login') {
        routeStores.removeAllKeepAliveRoutes()
        return next();
      }
      return next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
  });

  // 路由跳转后执行的操作
  router.afterEach(() => {
    routeStores.setRouteStatus(true)
    Nloading.finish();
  });

  // 清理动态路由状态，退出登录时重置
  authStore.$subscribe(() => {
    if (!authStore.getToken()) {
      routeManager.clearRoutes()
      isDynamicRoutesLoaded = false;  // 清空动态路由加载标记
    }
  });
}

// 递归添加路由到 router
function addNestedRoutes(parentName, routes) {
  routes.forEach(route => {
    const routeToAdd = {
      ...route,
      children: undefined,  // 防止递归嵌套的路由添加 children 字段
    };

    // 检查路由是否已经存在，避免重复添加
    if (!router.hasRoute(route.name)) {
      router.addRoute(parentName, routeToAdd);
    }

    // 如果有子路由，递归添加
    if (route.children && route.children.length > 0) {
      addNestedRoutes(route.name, route.children);
    }
  });
}
