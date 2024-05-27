/*
 * @Author: htz
 * @Date: 2024-05-25 22:34:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-27 18:10:13
 * @Description:  FCP绘制时间统计统计
 */

import { lazyReportBatch } from '../report'
export default function observePaint() {
  const entryhandler = (list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        observer.disconnect()
        const json = entry.toJSON()
        console.log('first-contentful-paint:', json)
        //上报数据
        const reqportData = {
          ...json,
          type: 'performance',
          subType: entry.name,
          pageUrl: window.location.href,
        }
        //上报数据
        lazyReportBatch(reqportData)
      }
    }
  }

  // 统计和计算fp时间
  const observer = new PerformanceObserver(entryhandler)
  //buffer:true 确保观察到所有的paint事件
  observer.observe({ type: 'paintt', buffered: true })
}
