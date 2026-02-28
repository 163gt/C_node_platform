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
        <div>创建模型信息</div>
      </template>
      <div style="width: 100%; height: auto">
        <n-form ref="formRef" :model="modelForm" :rules="modelRules">
          <n-form-item label="模型绑定" path="modelBind">
            <n-select
              v-model:value="modelForm.modelBind"
              placeholder="请绑定使用模型"
              :options="bindModelList"
            />
          </n-form-item>
          <n-form-item path="modelName">
            <template #label>
              <div style="display: flex; align-items: center">
                <span>模型名称</span>
                <n-popover trigger="hover">
                  <template #trigger>
                    <Icon size="18">
                      <HelpCircle />
                    </Icon>
                  </template>
                  <span>自定义密钥名称,如：混元——hunyuan-lite</span>
                </n-popover>
              </div>
            </template>
            <n-input
              v-model:value="modelForm.modelName"
              placeholder="请输入模型名称"
            />
          </n-form-item>
        </n-form>
      </div>
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
import { Icon } from "@vicons/utils";
import {
  FlashOutline,
  HelpCircle,
  SearchCircle,
  AddCircle,
  ReturnDownBackOutline,
} from "@vicons/ionicons5";

const modelShowModal = ref(false);
const showTag = ref(1);

//模型列表查询参数
const modelParams = ref({
  modelName: "",
  page: 1,
  pageSize: 10,
});

const modelForm = ref({
  modelName: "",
  modelDesc: "",
});
const modelRules = ref([]);
const bindModelList = ref([]);

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
