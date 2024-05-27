import performance from './performance/index'
import error from './error/index'
import behavior from './behavior/index'
import { setConfig } from './config'
import { lazyReportBatch } from './report'

//版本
window.__webEyeSDK__ = {
  version: '0.0.1',
}
//针对vue的错误捕获机制
export function install(Vue, options) {
  if (__webEyeSDK__.vue) return

  __webEyeSDK__.vue = true

  setConfig(options)
  const handler = Vue.config.errorHandler
  Vue.config.errorHandler = function (err, vm, info) {
    // 上报具体的错误信息
    const reportData = {
      info,
      error: err.stack,
      subType: 'vue',
      type: 'error',
      startTime: window.performance.now(), //高精度时间戳测量短时间间隔的精确时间。
      pageUrl: window.localtion.href,
    }

    if (handler) {
      handler.call(this, err, vm, info)
    }
  }
}

//react 错误数据处理
export function errorBoundary(err, info) {
  if (__webEyeSDK__.react) return
  __webEyeSDK__.react = true
  // 上报错误信息
  reportData = {
    error: err?.stack,
    info,
    subType: 'react',
    type: 'error',
    startTime: window.performance.now(), //高精度时间戳测量短时间间隔的精确时间。
    pageUrl: window.localtion.href,
  }
  //上报数据错误信息TDDO
}

export function init(options) {
  setConfig(options)
}

export default {
  install,
  errorBoundary,
  performance,
  error,
  behavior,
  init,
}
