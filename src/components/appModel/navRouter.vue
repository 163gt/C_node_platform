<template>
  <div class="navRouter">
    <div class="navRouter_box">
      <div
        class="tab"
        v-for="(item, index) in keepAliveRoute.keepAliveRoutes"
        :key="index"
        :class="[
          item.path === activeTab ? 'tab_active' : '',
          hoverTab === item.path ? 'tab_hover' : '',
        ]"
        @click="setActiveTab(item)"
        @contextmenu="handleRightClick($event, item)"
        @mouseenter="hoverTab = item.path"
        @mouseleave="hoverTab = null"
      >
        <span class="tab-title">{{ item.meta.title }}</span>
        <Icon
          v-show="keepAliveRoute.keepAliveRoutes.length > 1"
          size="18"
          class="tab-icon"
          @click.native="deleteKeepAliveRoute(item, $event)"
        >
          <RemoveCircle />
        </Icon>
        <!-- 右键窗口 -->
        <!-- <div
          v-if="isMenuVisible"
          @mouseleave="isMenuVisible = false"
          :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }"
          class="context_menu"
        >
          <p
            v-for="(tool, index) in navTool"
            :key="index"
            @click="keepNavTool(tool.id)"
          >
            {{ tool.name }}
          </p>
        </div> -->
      </div>
      <div class="navRefresh">
        <n-popover
          arrow-style="background:var(--green--levelTwo)"
          style="background: var(--green--levelTwo)"
          trigger="hover"
          placement="left"
        >
          <template #trigger>
            <Icon size="28" @click="keepNavTool(1)">
              <RefreshCircleOutline :class="{ rotating: isRotating }" />
            </Icon>
          </template>
          <span>刷新页面</span>
        </n-popover>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { routeStore } from "@/stores/routeStore";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@vicons/utils";
import { BackspaceOutline, RefreshCircleOutline,RemoveCircle } from "@vicons/ionicons5";

// 引入 Pinia store
const keepAliveRoute = routeStore(); // 从 Pinia 中获取 store 实例
const route = useRoute();
const router = useRouter();

const navTool = ref([
  { name: "刷新", id: 1 },
  { name: "关闭其他", id: 2 },
]);
// 控制旋转状态
const isRotating = ref(false);
// 活动 Tab
const activeTab = ref(
  keepAliveRoute.keepAliveRoutes.length > 0
    ? keepAliveRoute.keepAliveRoutes[0].path
    : ""
);
//聚焦tab
const hoverTab = ref(null);

//右键菜单
const isMenuVisible = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const toolItem = ref(null);
// 删除 KeepAlive 路由
const deleteKeepAliveRoute = (item, event) => {
  event.stopPropagation(); // 阻止冒泡
  keepAliveRoute.removeKeepAliveRoutes(item); // 从 Pinia store 中删除
  setActiveTab(
    keepAliveRoute.keepAliveRoutes[keepAliveRoute.keepAliveRoutes.length - 1]
  );
};

// 右键菜单
const handleRightClick = (event, item) => {
  // // 阻止默认右键菜单
  event.preventDefault();
  // // 获取右键点击的位置
  // menuPosition.value.x = event.clientX;
  // menuPosition.value.y = event.clientY;
  // //缓存item
  // toolItem.value = item;
  // // 创建右键菜单
  // isMenuVisible.value = true; // 显示自定义右键菜单
};

//右键功能点击
const keepNavTool = async (id) => {
  switch (id) {
    case 1:
      // 开始旋转
      isRotating.value = true;
      keepAliveRoute.setRouteStatus(false);
      keepAliveRoute.deleteIncludeRoutes(route);
      await nextTick();
      setTimeout(() => {
        keepAliveRoute.setRouteStatus(true);
        keepAliveRoute.addIncludeRoutes(route);
        isRotating.value = false;
      }, 500);
      isMenuVisible.value = false;
      break;
    case 2:
      keepAliveRoute.setRouteStatus(false);
      keepAliveRoute.removeOthersKeepAliveRoutes(toolItem.value);
      await nextTick();
      setTimeout(() => {
        keepAliveRoute.setRouteStatus(true);
      }, 500);
      isMenuVisible.value = false;
      break;
    default:
      break;
  }
};
// 设置活动 Tab
const setActiveTab = async (item) => {
  activeTab.value = item.path;
  router.push({
    path: item.path,
    query: item.query || {},
    params: item.params || {},
  });
};

// 监听路由变化，更新活动 Tab
watch(route, (newValue) => {
  if (newValue) {
    activeTab.value = newValue.path;
  }
});

// 监听 KeepAliveRoutes 数据变化
watch(
  () => keepAliveRoute.keepAliveRoutes, // 监听 Pinia store 中的 keepAliveRoutes
  (newValue) => {
    // console.log("KeepAliveRoutes updated:", newValue); // 打印更新后的值
  }
);
</script>

<style scoped>
.navRouter {
  width: 100%;
  height: 36px;
  padding: 0 0;
  font-weight: bold;
  background-color: #fff;
  z-index: 999;
  display: flex;
  position: relative;
  box-shadow: 0 2px 8px rgba(46, 46, 46, 0.1);
}
.navRouter::after,
.navRouter::before {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: -20px;
}
.navRouter::after {
  background: radial-gradient(
    circle at 100% 100%,
    transparent 20px,
    rgb(255, 255, 255) 20px
  );
}
.navRouter::before {
  right: 0px;
  background: radial-gradient(
    circle at 0 100%,
    transparent 20px,
    rgb(255, 255, 255) 20px
  );
}

.navRouter_box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
  padding: 0 40px;
  position: relative;
}
.tab-title {
  white-space: nowrap;
  margin-right: 8px;
}
/* .tab-icon:hover {
  background-color: var(--green--levelTwo);
  border-radius: 8px;
} */

.tab {
  min-width: 118px;
  height: 100%;
  display: flex;
  align-items: center;
  border-radius: 8px 8px 0 0;
  /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
  transition: all 0.3s ease;
  background-color: #fff;
  cursor: pointer;
  padding: 0 5px;
  justify-content: center;
  position: relative;
}
.tab_hover {
  position: relative;
  background-color: rgb(223, 223, 223);
  color: #4494fc;
}
.tab_hover::before,
.tab_hover::after {
  content: "";
  position: absolute;
  width: 15px;
  height: 15px;
  bottom: 0;
}
.tab_hover::after {
  right: -15px;
  background: radial-gradient(
    circle at 100% 0,
    transparent 15px,
    rgb(223, 223, 223) 15px
  );
}
.tab_hover::before {
  left: -15px;
  background: radial-gradient(
    circle at 0 0,
    transparent 15px,
    rgb(223, 223, 223) 15px
  );
}
.tab_active {
  position: relative;
  background-color: var(--green--levelTwo);
  color: var(--green--levelOne);
}
.tab_active::after,
.tab_active::before {
  content: "";
  position: absolute;
  width: 15px;
  height: 15px;
  bottom: 0;
}
.tab_active::after {
  right: -15px;
  background: radial-gradient(
    circle at 100% 0,
    transparent 15px,
    var(--green--levelTwo) 15px
  );
}
.tab_active::before {
  left: -15px;
  background: radial-gradient(
    circle at 0 0,
    transparent 15px,
    var(--green--levelTwo) 15px
  );
}

.context_menu {
  position: fixed;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1;
  width: 150px;
  height: auto;
  padding: 8px;
  border-radius: 8px;
}
.context_menu p {
  padding: 4px;
  cursor: pointer;
  border-radius: 6px;
}
.context_menu p:hover {
  background-color: var(--green--levelTwo);
}
.navRefresh {
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
  top: 0;
  right: 40px;
  cursor: pointer;
}

.rotating {
  animation: rotateAnimation 0.5s ease-in-out; /* 设置旋转动画 */
}

@keyframes rotateAnimation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
