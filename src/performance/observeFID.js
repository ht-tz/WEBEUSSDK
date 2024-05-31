/*
 * @Author: htz
 * @Date: 2024-05-31 17:22:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-31 19:01:28
 * @Description: FID 首次输入延迟  100ms 之内是可以接受的
 */
import { lazyReportBatch } from '../report'
export default function observeFID() {
  const entryHandler = (list) => {
    let entries = list.getEntries()
    let first = entries[0]
      let fisrtDelay = first.processingStart - first.startTime
      console.log(fisrtDelay,'fids')
    observer.disconnect()
    const reportData = {
      type: 'performance',
      subType: 'FID',
      duration: first.duration,
      pageUrl: window.location.href,
    }
    lazyReportBatch(reportData)
  }
  const observer = new PerformanceObserver(entryHandler)
  observer.observe({type: 'first-input', buffered: true})
}

//mfid去最厚一个最长的耗时任务
