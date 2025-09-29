<script setup>
// 这里可以添加需要的逻辑
import { ref, onMounted, onUnmounted } from "vue";
import {
  NMessageProvider,
  NLoadingBarProvider,
  NConfigProvider,
} from "naive-ui";
</script>
<template>
  <div>
    <NConfigProvider>
      <NMessageProvider>
        <NLoadingBarProvider>
          <router-view />
        </NLoadingBarProvider>
      </NMessageProvider>
    </NConfigProvider>
  </div>
</template>

<style scoped>
</style>
