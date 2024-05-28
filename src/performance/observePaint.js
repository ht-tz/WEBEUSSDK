/*
 * @Author: htz
 * @Date: 2024-05-25 22:42:25
 * @LastEditors:
 * @LastEditTime: 2024-05-28 12:34:10
 * @Description: 请填写简介
 */
import { lazyReportBatch } from '../report'
export default function observePaint() {
  const entryHandler = (list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-paint') {
        observer.disconnect()
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
  }
  // 统计和计算fp的时间
  const observer = new PerformanceObserver(entryHandler)
  // buffered: true 确保观察到所有paint事件
  observer.observe({ type: 'paint', buffered: true })
}
