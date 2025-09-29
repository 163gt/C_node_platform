// src/utils/request.ts
import axios from 'axios';
import router from '@/router/index';  // 引入 router
import { refUserToken } from '@/api/user';


let isRefreshing = false;  // 控制是否正在刷新 token
let refreshSubscribers = [];  // 等待的请求队列

// 创建 Axios 实例
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // 后台API根地址，改成你的后台API地址
    timeout: 10000,  // 请求超时时间，单位毫秒
    headers: {
        'Content-Type': 'application/json',  // 默认Content-Type
    },
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 在请求发送之前做一些操作，比如添加认证 Token
        const token = localStorage.getItem('token');  // 假设 token 存储在 localStorage
        if (token) {
            config.headers['Authorization'] = `${token}`; // 设置请求头
        }
        Nloading.start();
        // 处理 GET 请求的参数（添加到 URL 查询字符串中——0.19版本axios不需要手动拼接
        // if (config.method === 'get' && config.params) {
        //     const params = new URLSearchParams(config.params).toString();            
        //     config.url = `${config.url}?${params}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error); // 请求错误
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        Nloading.finish();
        if (response.status === 200) {
            return response.data; // 返回处理后的数据
        }
        if (response.status === 201) {
            return response.data; // 返回处理后的数据
        }
        return Promise.reject(response);
    },
    (error) => {
        Nloading.error();

        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 401:
                    // 401 Token 过期或未授权
                    return handleTokenRefresh(error);

                    break;
                case 404:
                    router.push('/error')
                    break;
                case 500:

                    break;

                default:
                    break;
            }
        } else {
            Nmessage.error("网络错误，请检查您的网络连接!");
            router.push('/login');
        }
        return Promise.reject(error.response ? error.response.data : error);
    }
);

export default instance;


// 处理 Token 刷新逻辑
const handleTokenRefresh = async (error) => {
    const { data } = error.response;
    // 如果后台允许刷新 Token
    if (data.allowRefresh) {
        // 如果没有正在刷新 Token
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                // 刷新 Token
                const newToken = await refreshToken();
                // 刷新成功后，重发失败的请求
                error.config.headers['Authorization'] = `${newToken}`;

                // 执行所有等待的请求
                refreshSubscribers.forEach((callback) => callback(newToken));
                refreshSubscribers = [];

                // 重新发送失败的请求
                return axios(error.config);
            } catch (refreshError) {
                // Token 刷新失败，跳转到登录页面
                Nmessage.error("刷新失败，请重新登录!")
                // 清除 token 并跳转到登录页
                localStorage.removeItem('token');
                // 使用 router.currentRoute.value.path 来判断当前路径
                const currentPath = router.currentRoute.value.path;
                if (currentPath !== '/login' && currentPath !== '/') {
                    router.push('/login');  // 使用 Vue Router 跳转
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // 如果正在刷新 Token，将当前请求加入队列
        return new Promise((resolve) => {
            refreshSubscribers.push((newToken) => {
                error.config.headers['Authorization'] = `${newToken}`;
                resolve(axios(error.config));
            });
        });
    } else {
        // Token 不能刷新，提示重新登录
        Nmessage.error(data.message)
        localStorage.removeItem('token');
        // 使用 router 的当前路径判断
        const currentPath = router.currentRoute.value.path;
        if (currentPath !== '/login' && currentPath !== '/') {
            router.push('/login');  // 使用 Vue Router 跳转
        }
        return Promise.reject(error);
    }
};


// 获取新的 token
const refreshToken = async () => {
    try {
        //调用获取新token的方法
        const { token } = await refUserToken()

        // 设置新的 token 到 localStorage
        localStorage.setItem('token', token);

        // 执行所有等待的请求
        refreshSubscribers.forEach((callback) => callback(token));
        refreshSubscribers = [];

        return token;
    } catch (error) {
        console.error('刷新 Token 失败', error);
        // 在刷新失败时，可以处理一些业务，比如退出登录等
        return Promise.reject(error);
    }
};