/*
 * @Author: htz
 * @Date: 2024-05-26 17:03:25
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-27 21:51:55
 * @Description: 页面错误捕获
 */
import { lazyReportBatch } from '../report'

export default function error() {
  // 捕获资源加载失败的错误的：js css img
  window.addEventListener(
    'error',
    function (e) {
      const target = e.target
      if (target.src || target.href) {
        const url = target.src || target.href
        const reportData = {
          type: 'error',
          subType: 'resource',
          url,
          html: target.outerHTML,
          pageUrl: this.window.location.href,
          paths: e.path,
        }

        // TODO 发送消息
        lazyReportBatch(reportData)
      }
    },
    true
  )

  //捕获js错误
  window.onerror = function (message, url, lineno, colno, error) {
    const reportData = {
      type: 'error',
      subType: 'js',
      message, // 错误信息
      url,
      lineNo, //行号
      colno, //列号
      stack: error.stack, //异常的栈信息
      pageUrl: window.location.href,
      startTime: performance.now(),
    }
    //TODO发送错误信息
    lazyReportBatch(reportData)
  }

  // 捕捉promise错误， async, await
  window.addEventListener(
    'unhandledrejection',
    function (e) {
      const reportData = {
        type: 'error',
        subType: 'promise',
        stack: e.reason?.stack,
        pageUrl: window.location.href,
        startTime: e.timeStamp,
      }
      // TODO 发送消息
      lazyReportBatch(reportData)
    },
    true
  )
}
