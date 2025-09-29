// naive-ui-plugin.js
import { createDiscreteApi, lightTheme, darkTheme } from "naive-ui";
import { computed, ref } from "vue";

export default {
  install(app) {
    const themeRef = ref("light");
    const configProviderPropsRef = computed(() => ({
      theme: themeRef.value === "light" ? lightTheme : darkTheme,
    }));

    const { message, loadingBar } = createDiscreteApi(
      ["message", "dialog", "notification", "loadingBar", "modal"],
      {
        configProviderProps: configProviderPropsRef,
      }
    );

    // 将 message 挂载到 Vue 实例，并暴露到 window 上
    app.config.globalProperties.$message = message;
    window.Nmessage = message;  // 让 message 可以在全局范围内访问

    // 挂载 loadingBar
    app.config.globalProperties.$loadingBar = loadingBar;
    window.Nloading = loadingBar;
  },
};
