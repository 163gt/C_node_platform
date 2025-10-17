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

        <CButton @click="search" :icon="SearchCircle" type="CSuccess"
          >搜 索</CButton
        >
        <CButton @click="addModelShow()" :icon="AddCircle" type="CPrimary"
          >添 加</CButton
        >
      </div>
      <div class="content_box"></div>
    </div>
    <NModal
      v-model:show="modelShowModal"
      preset="dialog"
      title="Dialog"
      draggable
      style="width: 50%; border-radius: 8px"
    >
      <template #header>
        <div>标题</div>
      </template>
      <div>789</div>
      <template #action>
        <CButton :icon="AddCircle" type="CPrimary">添 加</CButton>
        <CButton @click="closeModal" :icon="ReturnDownBackOutline"
          >取 消</CButton
        >
      </template>
    </NModal>
  </div>
</template>
<script setup>
import { ref } from "vue";
import {
  FlashOutline,
  HelpCircle,
  SearchCircle,
  AddCircle,
  ReturnDownBackOutline,
} from "@vicons/ionicons5";

const modelShowModal = ref(false);

//模型列表查询参数
const modelParams = ref({
  modelName: "",
  page: 1,
  pageSize: 10,
});

//搜索
const search = () => {};
//添加模型
const addModelShow = (item) => {
  if (item) {
  } else {
    modelShowModal.value = true;
  }
};

const closeModal = () => {
  modelShowModal.value = false;
};
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
