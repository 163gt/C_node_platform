import request from '@/utils/request'

/**
 * 登录
 * @param {*} data 
 * @returns 
 */
export function webLogin(data) {
    return request({
        url: '/webLogin',
        method: 'post',
        data
    })
}

/**
 * 获取用户列表
 * @param {*} data 
 * @returns 
 */
export function UserList(params) {
    return request({
        url: '/getUserList',
        method: 'get',
        params
    })
}

/**
 * 添加用户
 * @param {*} data 
 * @returns 
 */
export function addUser(data) {
    return request({
        url: '/webCreate',
        method: 'post',
        data
    })
}

/**
 * 修改用户
 * @param {*} data 
 * @returns 
 */
export function updateUserInfo(data) { 
    return request({
        url: '/webUserUpdate',
        method: 'post',
        data
    })
}

/**
 * 删除用户
 * @param {*} params 
 * @returns 
 */
export function deleteUser(params) {
    return request({
        url: '/deleteUser',
        method: 'get',
        params
    })
}

/**
 * 刷新token
 */
export function refUserToken() {
    return request({
        url: '/refreshToken',
        method: 'post',
    })
}