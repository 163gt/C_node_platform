<template>
  <div class="main-content main_body">
    <div class="main_body_content">
      <div class="header_box">
        <div class="header_boxs">
          <div class="header_box_title">
            字典名称：<span>{{ DictItemParams.dictionaryName }}</span>
          </div>
          <div class="header_box_title">
            字典编号：<span>{{ DictItemParams.dictionaryCode }}</span>
          </div>
        </div>
        <div class="header_boxs">
          <NInput
            v-model:value="DictItemParams.label"
            placeholder="标签名称"
            style="width: 288px"
            class="header_box_item"
          >
            <template #prefix>
              <n-icon :component="FlashOutline" />
            </template>
          </NInput>
          <CButton @click="addDictShow()" :icon="AddCircle" type="CPrimary"
            >添 加</CButton
          >
        </div>
      </div>
      <n-spin size="large" :show="DictItemListSpin">
        <div class="content_box">
          <NDataTable
            :columns="columns"
            :data="DictItemdata"
            :bordered="true"
            :row-props="DictRowProps"
          >
          </NDataTable>
        </div>
      </n-spin>
      <Pagination
        v-model="DictItemParams"
        :total="total"
        @update:modelValue="PaginationUpdate"
      />
    </div>
    <NDrawer v-model:show="dictStatus.dictShow" width="40%">
      <n-drawer-content :title="dictStatus.title">
        <n-form ref="formRef" :model="dictForm" :rules="dictRules">
          <n-form-item label="字典编码" path="dictionaryCode">
            <n-input
              v-model:value="dictForm.dictionaryCode"
              disabled
              placeholder="字典编码"
            />
          </n-form-item>
          <n-form-item label="标签名称" path="label">
            <n-input
              v-model:value="dictForm.label"
              placeholder="请输入标签名称"
            ></n-input>
          </n-form-item>
          <n-form-item label="标签键值" path="value">
            <n-input
              v-model:value="dictForm.value"
              type="Number"
              placeholder="请输入标签键值"
            ></n-input>
          </n-form-item>
          <n-form-item label="状态" path="status">
            <n-switch
              :checked-value="1"
              :unchecked-value="2"
              v-model:value="dictForm.status"
            ></n-switch>
          </n-form-item>
        </n-form>
        <template #footer>
          <n-spin :show="DictItemListSpin">
            <div style="display: flex">
              <CButton @click="setdictInfo" :icon="AddCircle" type="CPrimary">{{
                dictStatus.btn === 1 ? "添 加" : "修 改"
              }}</CButton>
              <CButton @click="closedictShow" :icon="ReturnDownBackOutline"
                >取 消</CButton
              >
            </div>
          </n-spin>
        </template>
      </n-drawer-content>
    </NDrawer>
  </div>
</template>
<script setup>
import { onMounted, ref, watch, h } from "vue";
import { useRoute } from "vue-router";
import { queryDictItem, createDictItem, updateDictItem } from "@/api/dict";
import Pagination from "@/components/table/pagination.vue";
import DictTag from "@/components/dictTag/dictTag.vue";
import {
  FlashOutline,
  AddCircle,
  ReturnDownBackOutline,
} from "@vicons/ionicons5";
const route = useRoute();
//校验参数ref
const formRef = ref(null);
//查询参数
const DictItemParams = ref({
  dictionaryCode: null,
  dictionaryName: null,
  page: 1,
  pageSize: 10,
  label: null,
});
//标签状态
const dictStatus = ref({
  dictShow: false,
  title: "添加标签",
  btn: 1,
});
//默认参数
const defaultForm = {
  label: "",
  dictionaryCode: null,
  value: "",
  status: 1,
};
const dictForm = ref({ ...defaultForm });
const total = ref(0);
//列表加载状态
const DictItemListSpin = ref(false);
//列表数据
const DictItemdata = ref([]);
//列表展示参数
const columns = ref([
  {
    title: "序号",
    key: "id",
    render: (_, index) => {
      return `${index + 1}`;
    },
  },
  {
    title: "标签名称",
    key: "label",
    render(row) {
      return h(
        "span",
        {
          style: { cursor: "pointer", color: "var(--text--purple)" },
          onClick: () => addDictShow(row),
        },
        { default: () => row.label }
      );
    },
  },
  {
    title: "标签键值",
    key: "value",
  },
  {
    title: "状态",
    key: "status",
    render(row) {
      return h(DictTag, {
        dictionaryCode: "sys_status",
        value: row.status,
        type: row.status === 1 ? "success" : "error",
        round: true,
      });
    },
  },
]);
//修改标签-添加标签
const setdictInfo = (e) => {
  e.preventDefault();
  DictItemListSpin.value = true;
  formRef.value?.validate((errors) => {
    if (!errors) {
      switch (dictStatus.value.btn) {
        case 1:
          createDictItem(dictForm.value)
            .then((res) => {
              DictItemListSpin.value = false;
              dictStatus.value.dictShow = false;
              getQueryDictItem();
              Nmessage.success("添加成功！");
            })
            .catch((err) => {
              Nmessage.error(err.message);
              DictItemListSpin.value = false;
            });
          break;
        case 2:
          updateDictItem(dictForm.value)
            .then((res) => {
              DictItemListSpin.value = false;
              dictStatus.value.dictShow = false;
              getQueryDictItem();
              Nmessage.success("修改成功！");
            })
            .catch((err) => {
              Nmessage.error(err.message);
              DictItemListSpin.value = false;
            });
          break;

        default:
          break;
      }
    } else {
      DictItemListSpin.value = false;
      Nmessage.error("参数校验失败");
    }
  });
};

//table行事件
const DictRowProps = (row) => {
  return {
    style: "cursor: pointer;",
    onClick: () => {
      addDictShow(row);
    },
  };
};
//分页回调
const PaginationUpdate = (newValue) => {
  DictItemParams.value = newValue;
  search();
};
//查询
const search = () => {};

//重置字典弹窗字段
const resetDictForm = () => {
  dictForm.value = { ...defaultForm };
};
//添加标签
const addDictShow = (item) => {
  dictStatus.value.dictShow = true;
  if (item) {
    dictForm.value = { ...item };
    dictStatus.value.title = "修改标签";
    dictStatus.value.btn = 2;
  } else {
    dictStatus.value.title = "添加标签";
    dictStatus.value.btn = 1;
  }
};
//获取字典标签列表
const getQueryDictItem = () => {
  queryDictItem(DictItemParams.value).then((res) => {
    DictItemdata.value = res.data;
    total.value = res.total;
  });
};

onMounted(() => {
  DictItemParams.value.dictionaryCode = route.query.dictionaryCode;
  DictItemParams.value.dictionaryName = route.query.dictionaryName;
  defaultForm.dictionaryCode = route.query.dictionaryCode;
  dictForm.value.dictionaryCode = route.query.dictionaryCode;
  getQueryDictItem();
});

watch(
  () => dictForm.value,
  (newValue) => {
    // 如果是有效数字字符串，则转换为数字类型
    if (/^\d+$/.test(newValue.value)) {
      newValue.value = Number(newValue.value);
    }
  },
  { deep: true }
);
watch(
  () => dictStatus.value.dictShow,
  (newValue) => {
    if (!newValue) {
      resetDictForm();
    }
  }
);
</script>
<style scoped>
.header_box {
  width: 100%;
  height: auto;
  padding: 8px;
}
.header_boxs {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  padding: 8px;
}
.header_box_title {
  font-size: 1rem;
  margin-right: 16px;
}
.header_box_title span {
  font-weight: bold;
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