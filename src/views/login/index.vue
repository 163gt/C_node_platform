<template>
  <div class="login">
    <div class="login_bg">
      <img class="login_img" src="@/assets/image/bg.png" alt="" />
    </div>
    <div class="login_form">
      <div class="login_card">
        <h1 style="margin: 10px 0">微光后台系统v1.0</h1>
        <NForm label-placement="left" label-width="auto">
          <NFormItem path="userName">
            <NInput
              v-model:value="loginParams.userName"
              placeholder="请输入用户名"
              @keyup.enter="login"
            >
              <template #prefix>
                <Icon>
                  <LogoOctocat />
                </Icon>
              </template>
            </NInput>
          </NFormItem>
          <NFormItem path="passWord">
            <NInput
              v-model:value="loginParams.passWord"
              type="password"
              placeholder="请输入密码"
              show-password-on="click"
              :maxlength="10"
              @keyup.enter="login"
            >
              <template #prefix>
                <Icon>
                  <Key />
                </Icon>
              </template>
              <template #password-visible-icon>
                <n-icon :size="16" :component="GlassesOutline" />
              </template>
              <template #password-invisible-icon>
                <n-icon :size="16" :component="Glasses" />
              </template>
            </NInput>
          </NFormItem>
        </NForm>
        <NSpin :show="loginShow" style="width: 80%">
          <NButton @click="login" style="width: 100%" round color="#00A385"
            >登 录</NButton
          >
        </NSpin>

        <div style="margin-top: 20px">
          <span>没有账号？点击这里</span>
          <NHighlight
            style="margin-left: 10px; cursor: pointer"
            :text="text"
            :patterns="patterns"
            :highlight-style="{
              padding: '0 5px',
              borderRadius: themeVars.borderRadius,
              display: 'inline-block',
              color: '#fff',
              background: '#00A385',
              transition: `all .3s
          ${themeVars.cubicBezierEaseInOut}`,
            }"
          />
        </div>
      </div>
    </div>
    <div class="login_footerBg"></div>
    <div class="login_footerBg1"></div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { Icon } from "@vicons/utils";
import { LogoOctocat, Key, GlassesOutline, Glasses } from "@vicons/ionicons5";
import { useThemeVars } from "naive-ui";
import { ref } from "vue";
import { webLogin } from "@/api/user";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const themeVars = useThemeVars();
const userStore = useAuthStore();

const text = ref("注册");
const patterns = ref(["注册"]);
const loginParams = ref({
  userName: "",
  passWord: "",
});
const loginShow = ref(false);
const login = () => {
  loginShow.value = true;
  webLogin(loginParams.value)
    .then((res) => {
      loginShow.value = false;
      userStore.setToken(res.token);
      userStore.setUserInfo(JSON.stringify(res.data));
      router.push({ path: "/index" });
      Nmessage.success("登录成功！");
    })
    .catch((err) => {
      Nmessage.error(err.message);
      loginShow.value = false;
    });
};
</script>
<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(
    218deg,
    rgba(0, 84, 69, 0.8) 0%,
    rgba(10, 28, 54, 0.8) 50%,
    rgba(30, 54, 3, 0.8) 100%
  );
  position: relative;
}
.login_bg {
  width: 50%;
  display: flex;
  justify-content: flex-end;
}
.login_img {
  width: 70%;
  z-index: 2;
}
.login_form {
  flex: 1;
  min-width: 688px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  z-index: 2;
}
.login_card {
  width: 50%;
  padding: 20px;
  box-shadow: 1px 2px 10px rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
}
.login_footerBg {
  position: absolute;
  top: 10%;
  right: 5%;
  width: 288px;
  height: 288px;
  border-radius: 34% 66% 30% 70% / 48% 64% 36% 52%;
  background: linear-gradient(
    21deg,
    rgba(0, 99, 81, 0.5) 0%,
    rgba(62, 163, 145, 0.5) 50%,
    rgba(71, 163, 59, 0.5) 100%
  );
  z-index: 1;
}
.login_footerBg1 {
  position: absolute;
  bottom: 50px;
  left: 8%;
  width: 288px;
  height: 288px;
  border-radius: 100% 0% 26% 74% / 24% 69% 31% 76%;
  background: linear-gradient(
    21deg,
    rgba(0, 99, 81, 0.5) 0%,
    rgba(62, 163, 145, 0.5) 50%,
    rgba(71, 163, 59, 0.5) 100%
  );
  z-index: 1;
}
</style>