import request from '@/utils/request'

/**
 * 获取字典类型列表
 * @param {*} params 
 * @returns 
 */
export function getDictList(params) {
  return request({
    url: '/queryDictionaryType',
    method: 'get',
    params
  })
}

/**
 * 创建字典类型
 * @param {*} data 
 * @returns 
 */
export function createDictType(data) {
  return request({
    url: '/createDictionaryType',
    method: 'post',
    data
  })
}

/**
 * 修改字典类型
 * @param {*} data 
 * @returns 
 */
export function updateDictType(data) {
  return request({
    url: '/updateDictionaryType',
    method: 'post',
    data
  })
}

/**
 * 创建字典标签
 * @param {*} data 
 * @returns 
 */
export function createDictItem(data) {
  return request({
    url: '/createDictionaryItem',
    method: 'post',
    data
  })
}

/**
 * 修改字典标签
 * @param {*} data 
 * @returns 
 */
export function updateDictItem(data) {
  return request({
    url: '/updateDictionaryItem',
    method: 'post',
    data
  })
}

/**
 * 查询字典标签
 * @param {*} params 
 * @returns 
 */
export function queryDictItem(params) {
  return request({
    url: '/queryDictionaryItem',
    method: 'get',
    params
  })
}