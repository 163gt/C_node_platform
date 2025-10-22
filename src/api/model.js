import request from '@/utils/request'

/**
 * 创建apiKey密钥管理
 * @param {*} params 
 * @returns 
 */
export function addApiKey(data) {
  return request({
    url: '/addApiKey',
    method: 'post',
    data
  })
}

/**
 * 查询apiKey密钥管理列表
 */
export function getApiKeyList(params) {
  return request({
    url: '/queryApiKey',
    method: 'get',
    params
  })
}