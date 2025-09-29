import { getTreeRoutersList } from '@/api/routes';

// 路由管理器单例
class RouteManager {
    constructor() {
        this.dynamicRoutes = null;
        this.isLoading = false;
        this.pendingCallbacks = [];
    }

    // 处理路由数据（通用方法）
    processRoutes(routes) {
        return routes.map((route) => {
            if (!route) return null;

            const oldrouters = route.component && route.component.length > 0 ? route.component : null;
            const parts = oldrouters != null ? oldrouters.split('/').filter(Boolean) : null;

            const newRoute = {
                ...route,
                meta: {
                    title: route.title || '',
                    ...route.meta,
                },
            };            
            if (parts != null) {
                newRoute.component = () => import(`@/views/${parts[0]}/${parts[1]}.vue`);
            }else{
                delete newRoute.component;
            }

            if (route.children && route.children.length > 0) {
                newRoute.children = this.processRoutes(route.children);
            } else {
                delete newRoute.children;
            }
            delete newRoute.title;
            return newRoute;
        }).filter(route => route !== null);
    }

    // 加载动态路由（只加载一次）
    async loadDynamicRoutes() {        
        // 如果正在加载，等待完成
        if (this.isLoading) {
            return new Promise((resolve) => {
                this.pendingCallbacks.push(resolve);
            });
        }

        // 如果已经加载过，直接返回
        if (this.dynamicRoutes !== null) {
            return this.dynamicRoutes;
        }

        try {
            this.isLoading = true;

            const response = await getTreeRoutersList({type:2});
            this.dynamicRoutes = this.processRoutes(response.data);

            // 解析所有等待的回调
            this.pendingCallbacks.forEach(callback => callback(this.dynamicRoutes));
            this.pendingCallbacks = [];

            return this.dynamicRoutes;
        } catch (error) {
            console.error('加载动态路由失败:', error);
            return error;
        } finally {
            this.isLoading = false;
        }
    }

    // 获取动态路由（不触发加载）
    getDynamicRoutes() {
        return this.dynamicRoutes;
    }

    // 清空路由缓存（用于退出登录等场景）
    clearRoutes() {
        this.dynamicRoutes = null;
    }
}

// 导出单例实例
export const routeManager = new RouteManager();