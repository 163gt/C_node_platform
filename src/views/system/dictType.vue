<template>
  <div class="main-content main_body">
    <div class="main_body_content">
      <div class="header_box">
        <NInput
          v-model:value="dictParams.dictionaryName"
          placeholder="字典名称"
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
        <CButton @click="addDictShow" :icon="AddCircle" type="CPrimary"
          >添 加</CButton
        >
      </div>
      <n-spin size="large" :show="DictListSpin">
        <div class="content_box">
          <NDataTable
            :columns="columns"
            :data="DictData"
            :bordered="true"
            :row-props="DictRowProps"
          >
          </NDataTable>
        </div>
      </n-spin>
      <Pagination
        v-model="dictParams"
        :total="total"
        @update:modelValue="PaginationUpdate"
      />
    </div>
    <NDrawer v-model:show="dictStatus.dictShow" width="40%">
      <n-drawer-content :title="dictStatus.title">
        <n-form ref="formRef" :model="dictForm" :rules="dictRules">
          <n-form-item label="字典名称" path="dictionaryName">
            <n-input
              v-model:value="dictForm.dictionaryName"
              placeholder="请输入字典名称"
            ></n-input>
          </n-form-item>
          <n-form-item label="字典编码" path="dictionaryCode">
            <n-input
              v-model:value="dictForm.dictionaryCode"
              placeholder="请输入字典名称"
            ></n-input>
          </n-form-item>
          <n-form-item label="字典编码" path="description">
            <n-input
              v-model:value="dictForm.description"
              type="textarea"
              placeholder="字典描述"
              :autosize="{
                minRows: 3,
              }"
            />
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
          <n-spin :show="DictShowSpin">
            <n-button
              @click="setdictInfo"
              style="margin: 0 8px"
              secondary
              type="primary"
              >{{ dictStatus.btn === 1 ? "添 加" : "修 改" }}</n-button
            >
            <n-button
              @click="closedictShow"
              style="margin: 0 8px"
              secondary
              type="warning"
              >取 消</n-button
            >
          </n-spin>
        </template>
      </n-drawer-content>
    </NDrawer>
  </div>
</template>
<script setup>
import { ref, h, onMounted, watch, reactive } from "vue";
import { FlashOutline, SearchCircle, AddCircle } from "@vicons/ionicons5";
import { NTag, NMarquee } from "naive-ui";
import { useRouter } from "vue-router";
import { getDictList, createDictType, updateDictType } from "@/api/dict";
import Pagination from "@/components/table/pagination.vue";
import DictTag from "@/components/dictTag/dictTag.vue";


const router = useRouter();
//校验参数ref
const formRef = ref(null);
//抽屉按钮动画
const DictShowSpin = ref(false);
//列表加载状态
const DictListSpin = ref(false);
//字典数据
const DictData = ref([]);
//查询参数
const dictParams = ref({
  page: 1,
  pageSize: 10,
  dictionaryName: "",
});
//抽屉状态
const dictStatus = ref({
  title: "添加字典",
  btn: 1,
  dictShow: false,
});
const defaultForm = {
  dictionaryName: "",
  dictionaryCode: "",
  description: "",
  status: 1,
};
const dictForm = ref({ ...defaultForm });

//字典总数
const total = ref(0);
const columns = ref([
  {
    title: "序号",
    key: "id",
    render: (_, index) => {
      return `${index + 1}`;
    },
  },
  {
    title: "字典名称",
    key: "dictionaryName",
    render(row) {
      return h(
        "span",
        {
          style: { cursor: "pointer", color: "var(--text--purple)" },
          onClick: () => dictDetailed(row),
        },
        { default: () => row.dictionaryName }
      );
    },
  },
  {
    title: "字典编码",
    key: "dictionaryCode",
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

      // return h(
      //   NTag,
      //   {
      //     round: true,
      //     type: row.status == 2 ? "error" : "success",
      //   },
      //   { default: () => (row.status == 2 ? "停用" : "正常") }
      // );
    },
  },
  {
    title: "字典描述",
    key: "description",
    render(row) {
      return h(
        NMarquee,
        { style: { width: "auto" } },
        { default: () => row.description }
      );
    },
  },
]);
const dictRules = ref({
  dictionaryName: {
    required: true,
    message: "请输入字典名称",
    trigger: "blur",
  },
  dictionaryCode: {
    required: true,
    message: "请输入字典编码",
    trigger: "blur",
  },
});

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
  dictParams.value = newValue;
  search();
};
//搜索
const search = () => {
  DictList();
};
//添加字典
const addDictShow = (item) => {
  dictStatus.value.dictShow = true;
  if (item) {
    dictForm.value = { ...item };
    dictStatus.value.title = "修改字典";
    dictStatus.value.btn = 2;
  } else {
    dictStatus.value.title = "添加字典";
    dictStatus.value.btn = 1;
  }
};
//跳转详情字典
const dictDetailed = (item) => {
  if (item) {
    router.push({
      path: "/system/dictItem",
      query: {
        dictionaryCode: item.dictionaryCode,
        dictionaryName: item.dictionaryName,
      },
    });
  }
};
//修改字典-添加字典
const setdictInfo = (e) => {
  e.preventDefault();
  DictShowSpin.value = true;
  formRef.value?.validate((errors) => {
    if (!errors) {
      switch (dictStatus.value.btn) {
        case 1:
          createDictType(dictForm.value)
            .then((res) => {
              DictShowSpin.value = false;
              dictStatus.value.dictShow = false;
              DictList();
              Nmessage.success("添加成功！");
            })
            .catch((err) => {
              Nmessage.error(err.message);
              DictShowSpin.value = false;
            });
          break;
        case 2:
          updateDictType(dictForm.value)
            .then((res) => {
              DictShowSpin.value = false;
              dictStatus.value.dictShow = false;
              DictList();
              Nmessage.success("修改成功！");
            })
            .catch((err) => {
              Nmessage.error(err.message);
              DictShowSpin.value = false;
            });
          break;

        default:
          break;
      }
    } else {
      DictShowSpin.value = false;
      Nmessage.error("参数校验失败");
    }
  });
};
//关闭字典弹窗
const closedictShow = () => {
  dictStatus.value.dictShow = false;
};
//重置字典弹窗字段
const resetDictForm = () => {
  dictForm.value = { ...defaultForm };
};

//获取字典列表
const DictList = () => {
  DictListSpin.value = true;
  getDictList(dictParams.value).then((res) => {
    DictData.value = res.data;
    total.value = res.total;
    DictListSpin.value = false;
  });
};

watch(
  () => dictStatus.value.dictShow,
  (newValue, oldValue) => {
    if (!newValue) {
      resetDictForm();
    }
  }
);
onMounted(() => {
  DictList();
});
</script>
<style scoped>
.header_box {
  width: 100%;
  height: auto;
  padding: 8px;
  /* background-color: #fff; */
  display: flex;
  align-items: center;
  /* box-shadow: 0 0 10px #b5b5b5; */
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