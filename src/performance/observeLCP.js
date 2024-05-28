/*
 * @Author: htz
 * @Date: 2024-05-25 22:33:56
 * @LastEditors:
 * @LastEditTime: 2024-05-28 12:33:56
 * @Description: 请填写简介
 */
import { lazyReportBatch } from '../report'
export default function observeLCP() {
  const entryHandler = (list) => {
    if (observer) {
      observer.disconnect()
    }
    for (const entry of list.getEntries()) {
      const json = entry.toJSON()
      console.log(json)
      const reportData = {
        ...json,
        type: 'performance',
        subType: entry.name,
        pageUrl: window.location.href,
      }
      // 发送数据 todo;
      lazyReportBatch(reportData)
    }
  }
  // 统计和计算lcp的时间
  const observer = new PerformanceObserver(entryHandler)
  // buffered: true 确保观察到所有paint事件
  observer.observe({ type: 'largest-contentful-paint', buffered: true })
}
