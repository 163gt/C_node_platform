<template>
  <div class="sidebarBody" v-for="(item, index) in filteredRoutes" :key="index">
    <div class="sidebarNav" v-if="!item.hidden">
      <!-- 主菜单 -->
      <router-link
        v-if="!item.children || item.children.length === 0"
        :to="item.path"
        class="sidebarNav_link"
        active-class="active"
        exact-active-class="exact-active"
      >
        <!-- <Icon size="20">
          <AirplaneSharp />
        </Icon> -->
        <div class="sidebarNav_box">
          <div class="sidebarNav_title">{{ item.meta.title }}</div>
        </div>
      </router-link>

      <div v-else class="sidebarNav_link" @click.native.prevent="toggle(item)">
        <!-- <Icon size="20">
          <AirplaneSharp />
        </Icon> -->
        <div class="sidebarNav_box">
          <div class="sidebarNav_title">{{ item.meta.title }}</div>
        </div>
        <!-- 有子菜单显示箭头 -->
        <Icon
          v-if="item.children && item.children.length > 0"
          size="16"
          :class="{ rotated: openMap[item.path] }"
        >
          <ChevronDownCircleOutline />
        </Icon>
      </div>

      <!-- 子菜单 -->
      <NSpace vertical>
        <NCollapseTransition
          :show="
            item.children && item.children.length > 0 && openMap[item.path]
          "
          class="sidebarChildren"
        >
          <SidebarNav :filtered-routes="item.children" />
        </NCollapseTransition>
      </NSpace>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted } from "vue";
import { useSidebarStore } from "@/stores/sidebar"; // 引入 store
import { Icon } from "@vicons/utils";
import { AirplaneSharp, ChevronDownCircleOutline } from "@vicons/ionicons5";

// 获取 Pinia store
const sidebarStore = useSidebarStore();
// 解构 openMap，确保它是响应式
const openMap = sidebarStore.openMap;
// props
const props = defineProps({
  filteredRoutes: {
    type: Array,
    required: true,
    default: () => [], // 保证至少是个空数组
  },
});

// 初始化 openMap
onMounted(() => {
  sidebarStore.initOpenMap(props.filteredRoutes);
});

// 点击菜单切换展开
const toggle = (item) => {
  sidebarStore.toggleOpen(item);
};
</script>

<style scoped>
.sidebarBody {
  display: flex;
  flex-direction: column; /* 垂直排列菜单项 */
  width: 100%;
  height: auto;
  overflow: hidden;
}

.sidebarNav {
  width: 100%;
}

.sidebarNav_link {
  all: unset; /* 重置 a 标签默认样式 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 46px;
  padding: 0 10px;
  box-sizing: border-box;
  cursor: pointer;
  color: inherit;
  text-decoration: none;
  border-radius: 5px;
}

.sidebarNav_link:focus,
.sidebarNav_link:active {
  outline: none;
  box-shadow: none;
}

.sidebarNav_box {
  flex: 1;
  display: flex;
  align-items: center;
  margin-left: 5px;
}

.sidebarNav_title {
  line-height: 1;
}

/* hover 背景 */
.sidebarNav_link:hover {
  background: var(--green--levelTwo);
}

/* 当前路由高亮 */
.sidebarNav_link.active {
  background: var(--green--levelTwo);
  color: var(--green--levelOne);
  border-right: 3px solid var(--green--levelOne);
}

/* 当前有子菜单的父级不显示背景 */
.sidebarNav_link.no-bg {
  background: none;
}

/* 子菜单缩进 */
.sidebarChildren {
  display: flex;
  flex-direction: column;
  padding: 0 5px;
  /* margin-left: 10px; */
  /* padding-left: 10px; */
  /* box-sizing: border-box; */
}

/* 子菜单展开箭头旋转 */
.rotated {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}
</style>
