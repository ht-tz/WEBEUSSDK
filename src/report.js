/*
 * @Author: htz
 * @Date: 2024-05-25 22:31:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-27 18:14:05
 * @Description: 数据上报
 */
import { getCache, setCache, clearCache } from './cache'
import config from './config'
import { generateUniqueId } from './utils'
export const originalProto = XMLHttpRequest.prototype
export const originalOpen = XMLHttpRequest.prototype.open
export const originalSend = XMLHttpRequest.prototype.send

// 判断是否支持sendBeacon
export function isSupportSendBeacon() {
  return 'sendBeacon' in navigator
}

/**
 * @description 上报数据接口
 * @method report
 * @param data 上报数据
 * @returns
 */
export function report(data) {
  if (!config.url) {
    console.log('请先设置上传的url')
    return
  }
  const reportData = JSON.stringify({
    id: generateUniqueId(),
    data,
  })
  //上报方式使用图片的方式上报的
  if (config.isImageUpload) {
    imgReport(reportData)
  } else {
    // 优先使用sendBeacon的方式进行数据上报
    if (window.navigator.sendBeacon) {
      return sendBeaconReport(reportData)
    } else {
      return xhrReport(reportData)
    }
  }
}

// 图片上报
export function imgReport(data) {
  const img = new Image()
  img.src = config.url + '?data=' + encodeURIComponent(JSON.stringify(data))
}

/**
 * @description 批量上报数据
 * @param {Object} data 上报内容
 */
export function lazyReportBatch(data) {
  setCache(data)
  const dataCache = getCache
  console.log('img', dataCache, 'dataCache')

  if (dataCache.length && dataCache.length > config.batchSize) {
    report(dataCache)
    clearCache()
  }
}

//普通的ajax 发送请求
export function xhrReport(data) {
  // 利用浏览器的空闲时间期间被调用
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        const xhr = new XMLHttpRequest()
        originalOpen.call(xhr, 'POST', config.url)
        originalSend.call(xhr, JSON.stringify(data))
      },
      {
        timeout: 3000, // 3秒内没有空闲时间，则强制执行回调函数
      }
    )
  } else {
    setTimeout(() => {
      const xhr = new XMLHttpRequest()
      originalOpen.call(xhr, 'POST', config.url)
      originalSend.call(xhr, JSON.stringify(data))
    })
  }
}

/**
 * @description sendBeacon 上报数据
 * @param {上报数据} data
 */
export function sendBeaconReport(data) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        navigator.sendBeacon(config.url, JSON.stringify(data))
      },
      {
        timeout: 3000,
      }
    )
  } else {
    setTimeout(() => {
      navigator.sendBeacon(config.url, JSON.stringify(data))
    })
  }
}
