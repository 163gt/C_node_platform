import request from '@/utils/request'

/**
 * 获取菜单树状
 * @returns 
 */
export function getTreeRoutersList(params) {
    return request({
        url: '/getTreeRouterList',
        method: 'get',
        params
    })
}

/**
 * 获取菜单平铺
 * @param {*} params 
 * @returns 
 */
export function getRoutersList(params) {
    return request({
        url: '/getRouterList',
        method: 'get',
        params
    })
}

/**
 * 添加菜单
 * @param {*} data 
 * @returns 
 */
export function addMenuRouter(data) {
    return request({
        url: '/createRouter',
        method: 'post',
        data
    })
}

/**
 * 修改菜单
 * @param {*} data 
 * @returns 
 */
export function updateMenuRouter(data) {
    return request({
        url: '/updateRouter',
        method: 'post',
        data
    })
}