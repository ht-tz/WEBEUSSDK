/*
 * @Author: htz
 * @Date: 2024-05-25 22:42:25
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-28 14:56:29
 * @Description:  页面资源加载时间统计
 */
import { lazyReportBatch } from '../report'

export default function observeEntries() {
  if (document.readyState === 'complete') {
    observerEvent()
  } else {
    const onLoad = () => {
      observerEvent()
      window.removeEventListener('load', onLoad, true)
    }
    window.addEventListener('load', onLoad, true)
  }
}

export function observerEvent() {
  const entryHandler = (list) => {
    const data = list.getEntries()
    for (let entry of data) {
      if (observer) {
        observer.disconnect()
      }

      const reportData = {
        name: entry.name, //资源的名
        type: 'performance', //类型
        subType: entry.entryType, //子类型
        sourceType: entry.initiatorType, // 资源类型
        duration: entry.duration, // 加载时间
        dns: entry.domainLookupEnd - entry.domainLookupStart, // DNS 解析时间
        tcp: entry.connectEnd - entry.connectStart, // TCP 连接时间
        redirect: entry.redirectEnd - entry.redirectStart, // 重定向时间
        ttfb: entry.responseStart, // 首字节时间
        protocol: entry.nextHopProtocol, // 请求协议
        responseBodySize: entry.encodedBodySize, // 响应内容大小
        responseHeaderSize: entry.transferSize - entry.encodedBodySize, // 响应头部大小
        transferSize: entry.transferSize, // 内容传输大小
        resourceSize: entry.decodedBodySize, // 资源解压后大小
        startTime: entry.startTime, // 开始时间
      }

      console.error('entrys', reportData)

      //TODO 数据上报
      lazyReportBatch(reportData)
    }
  }

  let observer = new PerformanceObserver(entryHandler)
  observer.observe({ type: ['resource'], buffered: true })
}
