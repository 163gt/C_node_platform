import request from '@/utils/request'

/**
 * 获取角色列表
 * @returns 
 */
export function getRoleList(params) {
    return request({
        url: '/getRoleList',
        method: 'get',
        params
    })
}


/**
 * 创建角色
 * @param {*} data 
 * @returns 
 */
export function createRoleInfo(data) {
    return request({
        url: '/createRole',
        method: 'post',
        data
    })
}

/**
 * 更新角色信息
 * @param {*} data 
 * @returns 
 */
export function updateRoleInfo(data) {
    return request({
        url: '/updateRole',
        method: 'post',
        data
    })
}