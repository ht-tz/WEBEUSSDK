import { deepClone } from './utils.js'

const cache = []

export function getCache() {
  return deepClone(cache)
}

export function setCache(data) {
  cache.push(data)
}

export function clearCache() {
  cache.length = 0
}
