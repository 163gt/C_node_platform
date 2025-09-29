<template>
  <div class="app-container" v-particle-effect>
    <!-- 顶部模块 -->
    <HeaderTop />

    <!-- 导航栏路由模块 -->
    <NavRouter />

    <div class="body-wrapper">
      <!-- 左侧栏 -->
      <AsideLeft />

      <!-- 主体容器 -->
      <main
        class="main-content"
        :style="{ overflowY: overflowStatus ? 'hidden' : 'auto' }"
      >
        <router-view v-slot="{ Component, route }">
          <Transition name="fade" mode="out-in">
            <KeepAlive :include="include" :max="10">
              <component
                v-if="routeStatus.getRouteStatus()"
                :is="Component"
                :key="computedKey(route.path)"
              />
            </KeepAlive>
          </Transition>
        </router-view>
      </main>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { routeStore } from "@/stores/routeStore";
import HeaderTop from "@/components/appModel/headerTop.vue";
import NavRouter from "@/components/appModel/navRouter.vue";
import AsideLeft from "@/components/appModel/asideLeft.vue";
const route = useRoute();
const routeStatus = routeStore();
const include = ref([]);
const exclude = ref([]);
const overflowStatus = ref(false);
const computedKey = (path) => {
  return path;
};
watch(route, (to, from) => {
  if (to) {
    overflowStatus.value = true;
    setTimeout(() => {
      overflowStatus.value = false;
    }, 0);
  }
});

// watch(
//   () => routeStatus.keepAliveRoutes, // 监听 Pinia store 中的 keepAliveRoutes
//   (newValue) => {
//     include.value = newValue.map((route) => route.name);
//     console.log(include.value,'include');
//   }
// );

watch(
  () => routeStatus.includeRoutes, // 监听 Pinia store 中的 keepAliveRoutes
  (newValue) => {
    include.value = newValue.map((route) => route);    
  },
  { deep: true } // 需要加 deep:true 来确保深度监听
);
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
/* 顶部下方整体区域 */
.body-wrapper {
  flex: 1;
  display: flex;
  /* min-height: auto; */
  min-height: calc(100vh - 102px);
  overflow: hidden;
}

/* 主内容区 */
/* .main-content {
  flex: 1;
  background: #f8f9fa;
  overflow-y: auto;
  padding: 24px;
  border: none;
} */

/* fade 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-out;
}

.fade-leave-to {
  opacity: 0;
  transform: scale(0.8) translateX(5%); /* 离开时，缩小并向右平移 */
}

.fade-leave {
  opacity: 1;
  transform: scale(1) translateX(0); /* 离开前，元素的初始状态 */
}
</style>