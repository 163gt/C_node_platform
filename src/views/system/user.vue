<template>
  <div class="main-content main_body">
    <div class="main_body_content">
      <div class="header_box">
        <NInput
          v-model:value="Params.userName"
          placeholder="用户名称"
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
        <CButton @click="adduserShow" :icon="AddCircle" type="CPrimary"
          >添 加</CButton
        >
      </div>
      <n-spin size="large" :show="userShowSpin">
        <div class="content_box">
          <div class="user_item">
            <div
              class="user_box"
              v-for="(item, index) in userData"
              :key="index"
              @click="seeUserInfo(item)"
            >
              <div
                :style="{
                  width: '100%',
                  height: '100%',
                  'background-image': `url(${item.avatar})`,
                  backgroundSize: 'cover',
                  filter: 'blur(8px)',
                }"
              ></div>
              <div style="position: absolute; top: 0">
                <img class="user_box_img" :src="item.avatar" />
                <div class="user_box_info">
                  <div class="user_box_info_name">
                    <div>{{ item.userName }}</div>
                  </div>
                  <div class="user_box_info_other">
                    <div>{{ item.phoneNumber }}</div>
                    <div>{{ item.createTime }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </n-spin>
      <Pagination
        v-model="Params"
        :total="total"
        @update:modelValue="PaginationUpdate"
      />
    </div>
    <NDrawer v-model:show="userShow" width="40%">
      <n-drawer-content :title="showTag === 1 ? '添加用户' : '用户信息'">
        <n-form ref="formRef" :model="userForm" :rules="userRules">
          <n-form-item label="用户头像" path="avatar">
            <UploadFile v-model="userForm.avatar" />
          </n-form-item>
          <n-form-item label="用户名称" path="userName">
            <n-input
              v-model:value="userForm.userName"
              placeholder="请输入用户名称"
            ></n-input>
          </n-form-item>

          <n-form-item label="手机号" path="phoneNumber">
            <n-input
              type="Number"
              v-model:value="userForm.phoneNumber"
              placeholder="请输入手机号"
            ></n-input>
          </n-form-item>
          <n-form-item label="角色" path="roleCode">
            <n-cascader
              v-model:value="userForm.roleCode"
              multiple
              placeholder="请选择角色信息"
              :options="rolePathOption"
              label-field="roleName"
              value-field="roleCode"
              :cascade="true"
              check-strategy="all"
              :show-path="true"
              max-tag-count="responsive"
              :allow-checking-not-loaded="false"
            />
          </n-form-item>
          <n-form-item>
            <template #label>
              <div style="display: flex; align-items: center">
                <span>用户密码</span>
                <n-popover trigger="hover">
                  <template #trigger>
                    <Icon size="18">
                      <HelpCircle />
                    </Icon>
                  </template>
                  <span
                    >新用户默认密码为：123456。需要修改密码请在个人信息页面</span
                  >
                </n-popover>
              </div>
            </template>
          </n-form-item>
        </n-form>
        <template #footer>
          <n-spin :show="userShowSpin">
            <div style="display: flex">
              <div style="flex: 1">
                <n-button
                  @click="setuserInfo"
                  style="margin: 0 8px"
                  secondary
                  type="primary"
                  >{{ showTag === 1 ? "添 加" : "修 改" }}</n-button
                >
                <n-button
                  @click="closeuserShow"
                  style="margin: 0 8px"
                  secondary
                  type="warning"
                  >取 消</n-button
                >
              </div>
              <n-popconfirm
                v-if="showTag == 2"
                @positive-click="deleteuserInfo"
                negative-text="取消"
                positive-text="确定"
              >
                <template #trigger>
                  <n-button style="margin: 0 8px" secondary type="error"
                    >删 除</n-button
                  >
                </template>
                确定删除该用户？
              </n-popconfirm>
            </div>
          </n-spin>
        </template>
      </n-drawer-content>
    </NDrawer>
  </div>
</template>
<script setup>
import { ref, onMounted, h, watch } from "vue";
import { NTag } from "naive-ui";
import { Icon } from "@vicons/utils";
import {
  FlashOutline,
  HelpCircle,
  SearchCircle,
  AddCircle,
} from "@vicons/ionicons5";
import Pagination from "@/components/table/pagination.vue";
import UploadFile from "@/components/upload/uploadFile.vue";
import { getRoleList } from "@/api/role";
import { UserList, addUser, deleteUser, updateUserInfo } from "@/api/user";
defineOptions({
  name: "system_user",
});
//用户显示
const formRef = ref(null);
const userShow = ref(false);
const userShowSpin = ref(false);
const showTag = ref(1);
const userRules = ref({
  userName: { required: true, message: "请输入用户名称", trigger: "blur" },
});
//角色列表
const rolePathOption = ref([]);
//用户查询参数
const Params = ref({
  userName: "",
  page: 1,
  pageSize: 10,
});
const total = ref(0);
//默认用户信息
const defaultuser = {
  avatar: "",
  userName: "",
  // passWord: null,
  phoneNumber: "",
  roleCode: [],
};
const userForm = ref({ ...defaultuser });
//用户列表list
const userData = ref([]);

//分页更新
const PaginationUpdate = (newValue) => {
  Params.value = newValue;
  search();
};
//打开用户弹窗
const adduserShow = () => {
  showTag.value = 1;
  userShow.value = true;
};
const seeUserInfo = (item) => {
  showTag.value = 2;
  userForm.value = { ...item };
  userShow.value = true;
};
//关闭用户弹窗
const closeuserShow = () => {
  userShow.value = false;
};

//搜索
const search = () => {
  userShowSpin.value = true;
  getuserList();
};

//添加
const setuserInfo = (e) => {
  e.preventDefault();
  userShowSpin.value = true;
  formRef.value?.validate((errors) => {
    if (!errors) {
      if (showTag.value === 1) {
        //添加用户
        addUser(userForm.value)
          .then((res) => {
            userShowSpin.value = false;
            userShow.value = false;
            getuserList();
            Nmessage.success("添加成功！");
          })
          .catch((err) => {
            Nmessage.error(err.message);
            userShowSpin.value = false;
          });
      } else if (showTag.value === 2) {
        //修改用户信息
        updateUserInfo(userForm.value)
          .then((res) => {
            userShowSpin.value = false;
            userShow.value = false;
            getuserList();
            Nmessage.success("修改成功！");
          })
          .catch((err) => {
            Nmessage.error(err.message);
            userShowSpin.value = false;
          });
      }
    } else {
      userShowSpin.value = false;
      Nmessage.error("参数校验失败");
    }
  });
};

//删除用户
const deleteuserInfo = () => {
  //删除用户
  deleteUser({ userId: userForm.value.userId })
    .then((res) => {
      Nmessage.success("删除成功！");
      userShow.value = false;
      userShowSpin.value = false;
      getuserList();
    })
    .catch((err) => {
      Nmessage.error(err.message);
      userShowSpin.value = false;
    });
};

//获取用户列表信息
const getuserList = () => {
  //获取用户列表
  UserList(Params.value).then((res) => {
    total.value = res.total;
    userData.value = res.data;
    userShowSpin.value = false;
  });
  //获取角色选项
  getRoleList().then((res) => {
    rolePathOption.value = res.data;
  });
};

//重置表单
const resetuserForm = () => {
  userForm.value = { ...defaultuser };
};

onMounted(() => {
  getuserList();
});

//监听userShow
watch(userShow, (newValue, oldValue) => {
  if (!newValue) {
    resetuserForm();
  }
});
</script>
<style scoped>
.n-spin-container {
  width: 100%;
}
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
  min-height: calc(100vh - 66px - 20vh);
  margin-top: 16px;
  margin-bottom: 30px;
}
.user_item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
.user_box {
  width: 240px;
  min-width: 188px;
  height: 368px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  margin: 5px 8px;
  position: relative;
  transition: transform 0.3s ease; /* 添加动画效果 */
  cursor: pointer;
}
.user_box:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 10px #9e9e9e;
}

.user_box_img {
  width: 100%;
  height: 240px;
  border-radius: 8px 8px 0 0;
}
.user_box_info {
  width: 100%;
  padding: 8px;
  color: #000000;
}
.user_box_info_name {
  font-size: 1.2rem;
  font-weight: bold;
}
.user_box_info_other {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
