// src/stores/authStore.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || '',  // 从 localStorage 中获取 token，如果没有则为空字符串
        userInfo: localStorage.getItem('userInfo') || ''
    }),
    actions: {
        // 设置 token 并保存到 localStorage
        setToken(token) {
            this.token = token
            localStorage.setItem('token', token)  // 同步到 localStorage
        },
        setUserInfo(info) {
            this.userInfo = info
            localStorage.setItem('userInfo', info)  // 同步到 localStorage
        },
        // 获取 token
        getToken() {
            this.token = localStorage.getItem('token')
            return this.token
        },
        getUserInfo() {
            this.userInfo = localStorage.getItem('userInfo')
            return this.userInfo
        },
        // 删除 token 并清除 localStorage 中的 token
        removeAll() {
            this.token = ''
            localStorage.removeItem('token')
            this.userInfo = ''
            localStorage.removeItem('userInfo')
        }
    }
})
