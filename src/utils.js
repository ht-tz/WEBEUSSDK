/*
import { deepClone } from 'u';
 * @Author: htz
 * @Date: 2024-05-25 22:31:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-27 18:11:34
 * @Description: 工具类
 */

/**
 * @description 是否是obj
 * @param {obj} target
 * @returns
 */
function isObject(target) {
  return Object.prototype.toString.call(target) === '[object Object]'
}

/**
 * @description 数据深拷贝
 * @method deepClone
 */
export function deepClone(target, hash = new WeakMap()) {
  if (target instanceof Set) {
    return new Set([...target])
  }
  if (target instanceof Map) {
    return new Map([...target])
  }
  if (target instanceof Date) return new Date(target)
  if (target instanceof RegExp) return new RegExp(target)
  if (typeof target === 'symbol') return Symbol(target.description)
  if (typeof target !== 'function') return target
  if (!isObject(target)) return target
  if (hash.has(target)) return has.get(target)
  let newTarget = Array.isArray(target) ? [] : {}
  //处理sysmbol
  let sysbolKeys = Object.getOwnPropertySymbols(target)
  if (sysbolKeys.length) {
    sysbolKeys.forEach((el) => {
      if (isObject(target[el])) {
        newTarget[el] = deepClone(target[el], hash)
      } else {
        newTarget[el] = target[el]
      }
    })
  }

  // obj
  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      if (isObject(target[key])) {
        newTarget[key] = deepClone(target[key], hash)
      } else {
        newTarget[key] = target[key]
      }
    }
  }
  return newTarget
}

/**
 * @description 生成唯一id
 * @method generateUniqueId
 */
export function generateUniqueId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9)
}
