import { createApp } from 'vue'
import App from './App.vue'
import particleEffect from './utils/directive/particleEffect'
import pinia from './stores'
import router from './router'
import { setupRouterGuard } from './router/guard'
import './styles/main.scss'
import './styles/variables.scss'
// 引入 Naive UI
import naive from 'naive-ui'
import naiveUiPlugin from "@/utils/message";  // 引入插件

//注册组件
// import DictTag from "@/components/dictTag/dictTag.vue"
import CButton from "@/components/button/CButton.vue";

const app = createApp(App)
// 全局注册组件
app.component('CButton', CButton);
// app.component('DictTag', DictTag);
// 注册全局指令_粒子效果
app.directive('particle-effect', particleEffect);

app.use(pinia)
app.use(naive)
app.use(naiveUiPlugin)
// 初始化全局路由守卫
setupRouterGuard()
app.use(router)




app.mount('#app')