<template>
  <div class="main-content main_body">
    <div class="main_body_content">
      <div class="header_box">
        <NInput
          v-model:value="modelParams.modelKeyName"
          placeholder="密钥名称"
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
      <n-spin size="large" :show="apiKeySpin">
        <div class="content_box">
          <NDataTable
            :columns="columns"
            :data="modelApiKeyTable"
            :bordered="true"
          >
          </NDataTable>
        </div>
      </n-spin>
      <Pagination
        v-model="modelParams"
        :total="total"
        @update:modelValue="PaginationUpdate"
      />
    </div>
    <NDrawer v-model:show="modelShowModal" width="40%">
      <n-drawer-content :title="showTag === 1 ? '添加密钥' : '密钥信息'">
        <n-form ref="formRef" :model="modelKeyForm" :rules="modelKeyRules">
          <n-form-item path="modelKeyName">
            <template #label>
              <div style="display: flex; align-items: center">
                <span>密钥名称</span>
                <n-popover trigger="hover">
                  <template #trigger>
                    <Icon size="18">
                      <HelpCircle />
                    </Icon>
                  </template>
                  <span>和平台模型名称保持一致，如：hunyuan-lite</span>
                </n-popover>
              </div>
            </template>
            <n-input
              v-model:value="modelKeyForm.modelKeyName"
              placeholder="请输入密钥名称"
            ></n-input>
          </n-form-item>
          <n-form-item path="apiKeyValue">
            <template #label>
              <div style="display: flex; align-items: center">
                <span>密钥值</span>
                <n-popover trigger="hover">
                  <template #trigger>
                    <Icon size="18">
                      <HelpCircle />
                    </Icon>
                  </template>
                  <span>后台创建获取的apiKey</span>
                </n-popover>
              </div>
            </template>
            <n-input
              v-model:value="modelKeyForm.apiKeyValue"
              placeholder="请输入密钥值"
            ></n-input>
          </n-form-item>
          <n-form-item path="baseUrl">
            <template #label>
              <div style="display: flex; align-items: center">
                <span>模型地址</span>
                <n-popover trigger="hover">
                  <template #trigger>
                    <Icon size="18">
                      <HelpCircle />
                    </Icon>
                  </template>
                  <span
                    >模型的请求地址，如混元的请求地址：https://api.hunyuan.cloud.tencent.com/v1</span
                  >
                </n-popover>
              </div>
            </template>
            <n-input
              v-model:value="modelKeyForm.baseUrl"
              placeholder="请输入模型地址"
            ></n-input>
          </n-form-item>
          <n-form-item label="密钥描述" path="apiKeyDesc">
            <n-input
              v-model:value="modelKeyForm.apiKeyDesc"
              placeholder="请输入密钥描述"
              type="textarea"
              :autosize="{
                minRows: 3,
              }"
            ></n-input>
          </n-form-item>
          <n-form-item label="是否启用" path="status">
            <n-switch
              :checked-value="1"
              :unchecked-value="2"
              v-model:value="modelKeyForm.status"
            ></n-switch>
          </n-form-item>
        </n-form>
        <template #footer>
          <n-spin :show="modelKeySpin">
            <div style="display: flex">
              <div style="flex: 1; display: flex">
                <CButton
                  @click="setuserInfo"
                  :icon="AddCircle"
                  type="CPrimary"
                  >{{ showTag === 1 ? "添 加" : "修 改" }}</CButton
                >
                <CButton @click="closeuserShow" :icon="ReturnDownBackOutline"
                  >取 消</CButton
                >
              </div>
            </div>
          </n-spin>
        </template>
      </n-drawer-content>
    </NDrawer>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, h } from "vue";
import { addApiKey, getApiKeyList } from "@/api/model";
import { Icon } from "@vicons/utils";
import {
  FlashOutline,
  HelpCircle,
  SearchCircle,
  AddCircle,
  ReturnDownBackOutline,
} from "@vicons/ionicons5";
import { NButton } from "naive-ui";
import DictTag from "@/components/dictTag/dictTag.vue";
import Pagination from "@/components/table/pagination.vue";

const formRef = ref(null);
const modelShowModal = ref(false);
const modelKeySpin = ref(false);
const showTag = ref(1);
//模型列表查询参数
const modelParams = ref({
  modelKeyName: "",
  page: 1,
  pageSize: 10,
});
const total = ref(0);
const defaultModelKeyForm = {
  modelKeyName: "",
  apiKeyValue: "",
  baseUrl: "",
  apiKeyDesc: "",
  status: 1,
};
//模型密钥表单
const modelKeyForm = ref({ ...defaultModelKeyForm });
const modelKeyRules = ref({
  modelKeyName: { required: true, message: "请输入密钥名称", trigger: "blur" },
  apiKeyValue: { required: true, message: "请输入密钥值", trigger: "blur" },
  baseUrl: { required: true, message: "请输入模型地址", trigger: "blur" },
});

const modelApiKeyTable = ref([]);
const apiKeySpin = ref(false);
const columns = ref([
  {
    title: "序号",
    key: "id",
    render: (_, index) => {
      return `${index + 1}`;
    },
  },
  { title: "密钥名称", key: "modelKeyName" },
  { title: "模型地址", key: "baseUrl" },
  {
    title: "是否启用",
    key: "status",
    render(row) {
      return h(DictTag, {
        dictionaryCode: "model_status",
        value: row.status,
        type: row.status === 1 ? "success" : "error",
        round: true,
      });
    },
  },
  {
    title: "操作",
    key: "action",
    render(row) {
      return h(
        NButton,
        {
          round: true,
          quaternary: true,
          circle: true,
          type: "info",
          onClick: () => addModelShow(row),
        },
        { default: () => "编辑" }
      );
    },
  },
]);

//重置表单
const resetModelKeyForm = () => {
  modelKeyForm.value = { ...defaultModelKeyForm };
};
const PaginationUpdate = (newValue) => {
  modelParams.value = newValue;
  search();
};
//搜索
const search = () => {
    getApiKey(modelParams.value)
};

const closeuserShow = () => {
  resetModelKeyForm();
  modelShowModal.value = false;
};
//添加key
const addModelShow = (item) => {
  if (item) {
    modelKeyForm.value = item;
    showTag.value = 2;
    modelShowModal.value = true;
  } else {
    showTag.value = 1;
    modelShowModal.value = true;
  }
};
//添加或修改密钥
const setuserInfo = (e) => {
  e.preventDefault();
  modelKeySpin.value = true;
  formRef.value?.validate((errors) => {
    if (!errors) {
      if (showTag.value === 1) {
        //添加密钥
        addApiKey(modelKeyForm.value)
          .then((res) => {
            modelKeySpin.value = false;
            Nmessage.success("添加密钥成功");
            closeuserShow();
            search();
          })
          .catch((err) => {
            modelKeySpin.value = false;
            Nmessage.error(err.message);
          });
      } else if (showTag.value === 2) {
      }
    } else {
      modelKeySpin.value = false;
      Nmessage.error("参数校验失败");
    }
  });
};

//获取密钥列表
const getApiKey = (data) => {
  apiKeySpin.value = true;
  getApiKeyList(data)
    .then((res) => {
      modelApiKeyTable.value = res.data;
      total.value = res.total;
      apiKeySpin.value = false;
    })
    .catch((err) => {
      Nmessage.error(err.message);
    });
};

//监听modelShowModal
watch(modelShowModal, (newValue, oldValue) => {
  if (!newValue) {
    resetModelKeyForm();
  }
});

onMounted(() => {
  getApiKey(modelParams.value);
});
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