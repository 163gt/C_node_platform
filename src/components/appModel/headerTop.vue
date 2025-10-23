<template>
  <header class="headerTop headerTop_bgc">
    <div class="headerTop_logo">
      <img class="logo_img" src="../../assets/image/logo.png" alt="logo">
    </div>
    <div style="flex: 1"></div>
    <div class="headerUser">
      <NAvatar size="large" :src="userInfo.avatar" style="cursor: pointer" />
      <NDropdown :options="options" trigger="hover" @select="handleSelect" style="cursor: pointer">
        <Icon size="26" style="margin-left: 8px;cursor: pointer">
          <CaretDownCircleOutline />
        </Icon>
      </NDropdown>
    </div>
    <userInfoSet v-model:visible="visible"></userInfoSet>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, h } from "vue";
import { NIcon, useMessage } from "naive-ui";
import {
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon,
  CaretDownCircleOutline,
} from "@vicons/ionicons5";
import { Icon } from "@vicons/utils";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import userInfoSet from './userInfoSet.vue'

const message = useMessage();
const router = useRouter();
const userStore = useAuthStore();
const userInfo = ref({});
const visible = ref(false);

const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};

const handleSelect = (key) => {
  switch (key) {
    case "profile":
      message.info("选择了 个人信息");
      break;
    case "settings":
      message.info("选择了 设置");
      visible.value = true;
      break;
    case "logout":
      message.info("选择了 退出");
      userStore.removeAll();
      router.push("/login");
      break;

    default:
      break;
  }
};

const options = [
  {
    label: "个人信息",
    key: "profile",
    icon: renderIcon(UserIcon),
  },
  {
    label: "设置",
    key: "settings",
    icon: renderIcon(EditIcon),
  },
  {
    label: "退出",
    key: "logout",
    icon: renderIcon(LogoutIcon),
  },
];

onBeforeMount(() => {
  userInfo.value = JSON.parse(userStore.userInfo);
});
</script>

<style scoped>
/* 顶部模块样式 */
.headerTop {
  width: 100%;
  height: 66px;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  color: white;
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(100, 100, 100, 0.1);
  z-index: 1000;
  flex-shrink: 0;
}

.headerTop h1 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #000;
}

.headerTop_logo{
  width: 66px;
  height: 66px;
}
.logo_img{
  width: 100%;
  height: 100%;
}
.headerUser {
  width: 188px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>

