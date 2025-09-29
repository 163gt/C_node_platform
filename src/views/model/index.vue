<template>
  <div class="main-content main_body">
    <div class="main_body_content">
      <div class="header_box">
        <NInput
          v-model:value="modelParams.modelName"
          placeholder="模型名称"
          style="width: 288px"
          class="header_box_item"
          @keyup.enter="search"
        >
          <template #prefix>
            <n-icon :component="FlashOutline" />
          </template>
        </NInput>
        <NButton
          class="header_box_item btn_purple"
          @click="search"
          ghost
          style="width: 60px; height: 40px"
          >搜 索</NButton
        >
        <NButton
          class="header_box_item btn_green"
          @click="addModelShow()"
          style="width: 60px; height: 40px"
          >添 加</NButton
        >
      </div>
      <div class="content_box">

      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { FlashOutline, HelpCircle } from "@vicons/ionicons5";

//模型列表查询参数
const modelParams = ref({
  modelName: "",
  page: 1,
  pageSize: 10,
});

//搜索
const search = () => {};
//添加模型
const addModelShow = () => {};
</script>
<style scoped>
.header_box {
  width: 100%;
  height: auto;
  padding: 8px;
  display: flex;
  align-items: center;
}
.header_box_item {
  margin-right: 8px;
  text-align: center;
  padding: 0;
}
.content_box {
  width: 100%;
  height: calc(100vh - 66px - 20vh);
  margin-top: 16px;
}
</style>
