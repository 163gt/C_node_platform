import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const routeStore = defineStore('route', {
    state: () => {
        return {
            routeStatus: true,
            keepAliveRoutes: reactive([]),//已加载菜单
            includeRoutes: reactive([]),//缓存路由
        }
    },
    actions: {
        setRouteStatus(status) {
            this.routeStatus = status
        },
        getRouteStatus() {
            return this.routeStatus
        },
        addKeepAliveRoutes(route) {
            // 1. 如果路由没有 meta.title，则不进行存储
            if (!route.meta || !route.meta.title) {
                return;
            }
            // 2. 判断路由的 path 是否已经存在
            const index = this.keepAliveRoutes.findIndex(item => item.path === route.path);

            // 如果路由已经存在，更新它
            if (index !== -1) {
                // 替换掉旧的路由
                this.keepAliveRoutes[index] = route;
            } else {
                // 如果缓存长度超过 10，移除最前面的路由
                if (this.keepAliveRoutes.length >= 10) {
                    this.keepAliveRoutes.shift();
                }
                this.addIncludeRoutes(route)
                // 将新的路由添加到数组末尾
                this.keepAliveRoutes.push(route);
            }

        },
        removeKeepAliveRoutes(route) {
            this.keepAliveRoutes = this.keepAliveRoutes.filter(item => item.path !== route.path)
            this.deleteIncludeRoutes(route)
        },
        removeOthersKeepAliveRoutes(route) {
            this.keepAliveRoutes = this.keepAliveRoutes.filter(item => item.path === route.path);
        },
        removeAllKeepAliveRoutes() {
            this.keepAliveRoutes = []
        },
        getKeepAliveRoutes() {
            return this.keepAliveRoutes
        },

        addIncludeRoutes(route) {
            this.includeRoutes.push(route.name)
        },
        deleteIncludeRoutes(route) {
            this.includeRoutes = this.includeRoutes.filter(item => item !== route.name)
        },
        getIncludeRoutes() {
            return this.includeRoutes
        },
    }
})