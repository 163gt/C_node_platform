<template>
  <div class="main-content main_body">
    <div class="main_body_content">
      <div class="header_box">
        <NInput
          v-model:value="Params.routeName"
          placeholder="菜单名称"
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
        <CButton @click="addMenuShow()" :icon="AddCircle" type="CPrimary"
          >添 加</CButton
        >
      </div>
      <n-spin size="large" :show="menuShowSpin">
        <div class="content_box">
          <NDataTable :columns="columns" :data="menuData" :bordered="true">
          </NDataTable>
        </div>
      </n-spin>
      <Pagination
        v-model="Params"
        :total="total"
        @update:modelValue="PaginationUpdate"
      />
    </div>

    <NDrawer v-model:show="menuShow" width="40%">
      <n-drawer-content :title="menuStatus.title">
        <n-form ref="formRef" :model="menuForm" :rules="menuRules">
          <n-form-item path="parentComponent">
            <template #label>
              <div style="display: flex; align-items: center">
                <span>上级菜单</span>
                <n-popover trigger="hover">
                  <template #trigger>
                    <Icon size="18">
                      <HelpCircle />
                    </Icon>
                  </template>
                  <span>选择后在该菜单下展示，不选为一级菜单</span>
                </n-popover>
              </div>
            </template>
            <n-tree-select
              :options="parentComponentOption"
              :default-value="menuForm.parentComponent"
              clearable
              label-field="title"
              key-field="path"
              @update:value="treeUpdateValue"
            />
          </n-form-item>
          <n-form-item label="菜单名称" path="title">
            <n-input
              v-model:value="menuForm.title"
              placeholder="请输入菜单名称"
            ></n-input>
          </n-form-item>
          <n-form-item path="name">
            <template #label>
              <div style="display: flex; align-items: center">
                <span>路由名称</span>
                <n-popover trigger="hover">
                  <template #trigger>
                    <Icon size="18">
                      <HelpCircle />
                    </Icon>
                  </template>
                  <span>路由的name，唯一名称</span>
                </n-popover>
              </div>
            </template>
            <n-input
              v-model:value="menuForm.name"
              placeholder="请输入路由名称"
            ></n-input>
          </n-form-item>
          <n-form-item path="path">
            <template #label>
              <div style="display: flex; align-items: center">
                <span>菜单地址</span>
                <n-popover trigger="hover">
                  <template #trigger>
                    <Icon size="18">
                      <HelpCircle />
                    </Icon>
                  </template>
                  <span>页面地址</span>
                </n-popover>
              </div>
            </template>
            <n-input
              v-model:value="menuForm.path"
              placeholder="请输入菜单地址"
            ></n-input>
          </n-form-item>
          <n-form-item label="是否隐藏菜单" path="hidden">
            <n-switch
              :checked-value="true"
              :unchecked-value="false"
              v-model:value="menuForm.hidden"
            ></n-switch>
          </n-form-item>
          <n-form-item path="component">
            <template #label>
              <div style="display: flex; align-items: center">
                <span>组件路径</span>
                <n-popover trigger="hover">
                  <template #trigger>
                    <Icon size="18">
                      <HelpCircle />
                    </Icon>
                  </template>
                  <span>component渲染菜单，非终极菜单请勿填写</span>
                </n-popover>
              </div>
            </template>
            <n-input
              v-model:value="menuForm.component"
              placeholder="请输入组件路径"
            ></n-input>
          </n-form-item>

          <n-form-item label="排序" path="sorting">
            <n-input-number
              v-model:value="menuForm.sorting"
              :min="1"
              placeholder="请输入排序"
            />
          </n-form-item>
          <n-form-item label="状态" path="status">
            <n-switch
              :checked-value="1"
              :unchecked-value="2"
              v-model:value="menuForm.status"
            ></n-switch>
          </n-form-item>
          <n-form-item>
            <template #label>
              <div style="display: flex; align-items: center">
                <span>组件缓存</span>
                <n-popover trigger="hover">
                  <template #trigger>
                    <Icon size="18">
                      <HelpCircle />
                    </Icon>
                  </template>
                  <span
                    >页面组件配置name属性，与路由名称相符即自动缓存，最大10个</span
                  >
                </n-popover>
              </div>
            </template>
          </n-form-item>
        </n-form>
        <template #footer>
          <n-spin :show="menuShowSpin">
            <div style="display: flex">
              <CButton @click="setMenuInfo" :icon="AddCircle" type="CPrimary">{{
                menuStatus.btn === 1 ? "添 加" : "修 改"
              }}</CButton>
              <CButton @click="closeMenuShow" :icon="ReturnDownBackOutline"
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
import { ref, onMounted, h, watch } from "vue";
import {
  getTreeRoutersList,
  getRoutersList,
  addMenuRouter,
  updateMenuRouter,
} from "@/api/routes";
import { NTag, NButton } from "naive-ui";
import { Icon } from "@vicons/utils";
import {
  FlashOutline,
  HelpCircle,
  SearchCircle,
  AddCircle,
  ReturnDownBackOutline,
} from "@vicons/ionicons5";
import Pagination from "@/components/table/pagination.vue";
import DictTag from "@/components/dictTag/dictTag.vue";

//菜单显示
const formRef = ref(null);
const menuShow = ref(false);
const menuShowSpin = ref(false);
const menuStatus = ref({
  title: "添加菜单",
  btn: 1,
});
const menuRules = ref({
  title: { required: true, message: "请输入菜单名称", trigger: "blur" },
  path: { required: true, message: "请输入菜单地址", trigger: "blur" },
});
//菜单查询参数
const Params = ref({
  routeName: "",
  page: 1,
  pageSize: 10,
});
const total = ref(0);
//默认菜单值
const defaultMenu = {
  parentComponent: "",
  title: "",
  name: "",
  path: "",
  hidden: false,
  component: "",
  sorting: 1,
  status: 1,
};
const menuForm = ref({ ...defaultMenu });
//菜单头列表
const columns = ref([
  {
    title: "序号",
    key: "id",
    render: (_, index) => {
      return `${index + 1}`;
    },
  },
  { title: "菜单名称", key: "title" },
  { title: "菜单地址", key: "path" },
  { title: "排序", key: "sorting" },
  { title: "路由名称", key: "name" },
  {
    title: "是否显示",
    key: "hidden",
    render(row) {
      return h(DictTag, {
        dictionaryCode: "sys_menu_hidden",
        value: row.hidden ? 2 : 1,
        type: row.hidden ? "error" : "success",
        round: true,
      });

      // return h(
      //   NTag,
      //   {
      //     round: true,
      //     type: row.hidden ? "error" : "success",
      //   },
      //   { default: () => (row.hidden ? "隐藏" : "显示") }
      // );
    },
  },
  { title: "路径", key: "component" },
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
          onClick: () => addMenuShow(row),
        },
        { default: () => "编辑" }
      );
    },
  },
]);
//菜单上级组件
const parentComponentOption = ref([]);
//菜单列表list
const menuData = ref([]);

const PaginationUpdate = (newValue) => {
  Params.value = newValue;
  search();
};
//更新菜单上级组件值
const treeUpdateValue = (value) => {
  menuForm.value.parentComponent = value;
};
//打开添加菜单弹窗
const addMenuShow = (item) => {
  if (item) {
    menuStatus.value.title = "修改菜单";
    menuStatus.value.btn = 2;
    menuForm.value = item;
  } else {
    menuStatus.value.title = "添加菜单";
    menuStatus.value.btn = 1;
  }
  menuShow.value = true;
};
//关闭菜单弹窗
const closeMenuShow = () => {
  menuShow.value = false;
};

//搜索
const search = () => {
  menuShowSpin.value = true;
  getMenuList();
};

//添加菜单
const setMenuInfo = (e) => {
  e.preventDefault();
  menuShowSpin.value = true;
  formRef.value?.validate((errors) => {
    if (!errors) {
      //1为添加 2为修改
      switch (menuStatus.value.btn) {
        case 1:
          addMenuRouter(menuForm.value)
            .then((res) => {
              menuShowSpin.value = false;
              menuShow.value = false;
              getMenuList();
              Nmessage.success("添加成功！");
            })
            .catch((err) => {
              Nmessage.error(err.message);
              menuShowSpin.value = false;
            });
          break;

        case 2:
          updateMenuRouter(menuForm.value)
            .then((res) => {
              menuShowSpin.value = false;
              menuShow.value = false;
              getMenuList();
              Nmessage.success("修改成功！");
            })
            .catch((err) => {
              Nmessage.error(err.message);
              menuShowSpin.value = false;
            });

          break;
        default:
          break;
      }
    } else {
      menuShowSpin.value = false;
      Nmessage.error("参数校验失败");
    }
  });
};

//获取菜单信息
const getMenuList = () => {
  //获取平铺菜单列表
  getRoutersList(Params.value).then((res) => {
    total.value = res.total;
    menuData.value = res.data;
    menuShowSpin.value = false;
  });
  //获取菜单树状
  getTreeRoutersList().then((res) => {
    parentComponentOption.value = res.data;
  });
};

//重置表单
const resetMenuForm = () => {
  menuForm.value = { ...defaultMenu };
};

onMounted(() => {
  getMenuList();
});
watch(menuShow, (newValue, oldValue) => {
  if (!newValue) {
    resetMenuForm();
    getMenuList();
  }
});
</script>
<style scoped>
/* .n-spin-container {
  width: 100%;
} */
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
