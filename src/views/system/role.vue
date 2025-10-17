<template>
  <div class="main-content main_body">
    <div class="main_body_content">
      <div class="header_box">
        <NInput
          v-model:value="Params.roleName"
          placeholder="角色名称"
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
        <CButton @click="addroleShow()" :icon="AddCircle" type="CPrimary"
          >添 加</CButton
        >
      </div>
      <div class="content_box">
        <n-spin :show="roleShowSpin">
          <NDataTable :columns="columns" :data="roleData"> </NDataTable>
        </n-spin>
      </div>
      <Pagination
        v-model="Params"
        :total="total"
        @update:modelValue="PaginationUpdate"
      />
    </div>

    <NDrawer v-model:show="roleShow" width="40%">
      <n-drawer-content :title="roleStatus.title">
        <n-form ref="formRef" :model="roleForm" :rules="roleRules">
          <n-form-item label="角色名称" path="roleName">
            <n-input
              v-model:value="roleForm.roleName"
              placeholder="请输入角色名称"
            ></n-input>
          </n-form-item>
          <n-form-item label="角色编码" path="roleCode">
            <n-input
              v-model:value="roleForm.roleCode"
              placeholder="请输入角色地址"
            ></n-input>
          </n-form-item>
          <n-form-item label="菜单权限" path="rolePath">
            <n-cascader
              ref="cascaderInstRef"
              v-model:value="roleForm.rolePath"
              multiple
              placeholder="请选择路由"
              :options="rolePathOption"
              label-field="title"
              value-field="id"
              :cascade="true"
              check-strategy="all"
              :show-path="true"
              max-tag-count="responsive"
              :allow-checking-not-loaded="false"
            />
          </n-form-item>
          <n-form-item label="描述" path="description">
            <n-input
              v-model:value="roleForm.description"
              type="textarea"
              placeholder="角色描述"
              :autosize="{
                minRows: 3,
              }"
            />
          </n-form-item>
          <n-form-item label="状态" path="status">
            <n-switch
              :checked-value="1"
              :unchecked-value="2"
              v-model:value="roleForm.status"
            ></n-switch>
          </n-form-item>
        </n-form>
        <template #footer>
          <n-spin :show="roleShowSpin">
            <div style="display: flex">
              <CButton @click="setroleInfo" :icon="AddCircle" type="CPrimary">{{
                roleStatus.btn === 1 ? "添 加" : "修 改"
              }}</CButton>
              <CButton @click="closeroleShow" :icon="ReturnDownBackOutline"
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
import { NTag, NButton } from "naive-ui";
import Pagination from "@/components/table/pagination.vue";
import {
  FlashOutline,
  HelpCircle,
  SearchCircle,
  AddCircle,
  ReturnDownBackOutline,
} from "@vicons/ionicons5";
import { getRoleList, updateRoleInfo } from "@/api/role";
import { getTreeRoutersList } from "@/api/routes";
import DictTag from "@/components/dictTag/dictTag.vue";

const cascaderInstRef = ref(null);
//角色显示
const formRef = ref(null);
const roleShow = ref(false);
const roleShowSpin = ref(false);
const roleStatus = ref({
  title: "添加角色",
  btn: 1,
});
const roleRules = ref({
  roleName: { required: true, message: "请输入角色名称", trigger: "blur" },
  roleCode: { required: true, message: "请输入角色编码", trigger: "blur" },
});
//角色查询参数
const Params = ref({
  roleName: "",
  page: 1,
  pageSize: 10,
});
const total = ref(0);
//默认角色值
const defaultrole = {
  roleName: "",
  roleCode: "",
  rolePath: [],
  setRolePath: [], //提交的值 = rolePath
  status: 1,
  description: "",
};
const roleForm = ref({ ...defaultrole });
//角色头列表
const columns = ref([
  {
    title: "序号",
    key: "id",
    render: (_, index) => {
      return `${index + 1}`;
    },
  },
  { title: "角色名称", key: "roleName" },
  { title: "角色编码", key: "roleCode" },
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
          onClick: () => addroleShow(row),
        },
        { default: () => "编辑" }
      );
    },
  },
]);
//菜单权限
const rolePathOption = ref([]);
//角色列表list
const roleData = ref([]);

const PaginationUpdate = (newValue) => {
  Params.value = newValue;
  search();
};
//更新角色上级组件值
const treeUpdateValue = (value) => {
  roleForm.value.parentComponent = value;
};
//打开角色弹窗
const addroleShow = (item) => {
  if (item) {
    roleStatus.value.title = "修改角色";
    roleStatus.value.btn = 2;
    roleForm.value = item;
  } else {
    roleStatus.value.title = "添加角色";
    roleStatus.value.btn = 1;
  }
  roleShow.value = true;
};
//关闭角色弹窗
const closeroleShow = () => {
  roleShow.value = false;
};

//搜索
const search = () => {
  roleShowSpin.value = true;
  getroleList();
};
//重置表单
const resetRoleForm = () => {
  roleForm.value = { ...defaultrole };
};

//添加角色
const setroleInfo = (e) => {
  e.preventDefault();
  roleShowSpin.value = true;
  formRef.value?.validate((errors) => {
    if (!errors) {
      switch (roleStatus.value.btn) {
        //1 添加 2 修改
        case 1:
          addroleRouter(roleForm.value)
            .then((res) => {
              roleShowSpin.value = false;
              roleShow.value = false;
              getroleList();
              Nmessage.success("添加成功！");
            })
            .catch((err) => {
              Nmessage.error(err.message);
              roleShowSpin.value = false;
            });
          break;
        case 2:
          updateRoleInfo(roleForm.value)
            .then((res) => {
              roleShowSpin.value = false;
              roleShow.value = false;
              getroleList();
              Nmessage.success("修改成功！");
            })
            .catch((err) => {
              Nmessage.error(err.message);
              roleShowSpin.value = false;
            });
          break;
        default:
          break;
      }
    } else {
      roleShowSpin.value = false;
      Nmessage.error("参数校验失败");
    }
  });
};

//获取角色信息
const getroleList = () => {
  //获取平铺角色列表
  getRoleList(Params.value)
    .then((res) => {
      total.value = res.total;
      roleData.value = res.data;
      roleShowSpin.value = false;
    })
    .catch((err) => {
      roleShowSpin.value = false;
      Nmessage.error(err.message);
    });
  //获取路由树状
  getTreeRoutersList().then((res) => {
    rolePathOption.value = res.data;
  });
};

onMounted(() => {
  getroleList();
});

watch(roleShow, (newValue, oldValue) => {
  if (!newValue) {
    resetRoleForm();
    getroleList();
  }
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
  /* box-shadow: 0 0 10px #b5b5b5; */
}
</style>
