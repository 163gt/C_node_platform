<template>
  <aside class="sidebar" >
    <div v-if="!active" class="sidebar_show" @mouseenter="showActive">
      <img
        class="sidebar_show_svg"
        @click="showActive"
        src="@/assets/ArrowRight.svg"
      />
    </div>
    <NDrawer v-model:show="active" :width="268" :placement="placement">
      <NDrawerContent header-style="height:66px;">
        <template #header>
          <div class="sidebar_header_logo">
            <img src="../../assets/image/logo.png" class="sidebar_logo_img" />
          </div>
        </template>
        <div class="sidebar_router">
          <SidebarNav :filteredRoutes="sidebarRoutes" />
        </div>
      </NDrawerContent>
    </NDrawer>
  </aside>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { asyncRoutes } from "@/router/index";
import { routeManager } from "@/router/asyncRoutes"; // 引入路由管理器
import SidebarNav from "./sidebarNav.vue";
//过滤掉隐藏的路由
const sidebarRoutes = ref([]);
//侧边弹窗控制
const active = ref(false);
//侧边弹窗位置
const placement = ref("left");

const showActive = () => {
  active.value = !active.value;
};

onMounted(async () => {
  try {
    // 获取动态路由（如果已加载就直接返回，否则等待加载）
    const dynamicRoutes = await routeManager.loadDynamicRoutes();
    sidebarRoutes.value = [...asyncRoutes[0].children, ...dynamicRoutes];    
  } catch (error) {
    console.log(error, "error");
  }
});
</script>

<style scoped>
::v-deep .n-drawer-body-content-wrapper {
  padding: 0 !important;
}

/* 左侧边栏样式 */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  color: rgb(255, 255, 255);
  overflow-y: auto;
  z-index: 9999;
  height: auto;
  min-height: calc(100vh - 66px);
  display: flex;
  align-items: center;
}
.sidebar_show {
  width: 24px;
  height: 100px;
  /* overflow: visible;
  position: absolute;
  left: 20px;
  top: 0%; */
}
.sidebar_header_logo{
  width: 66px;
  height: 66px;
}
.sidebar_logo_img{
  width: 100%;
  height: 100%;
}
.sidebar_show_svg {
  width: 100%;
  height: 100%;
}
</style>