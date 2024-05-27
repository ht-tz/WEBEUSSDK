
/*
 * @Author: htz
 * @Date: 2024-05-27 11:53:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-27 15:44:00
 * @Description:  监听页面的跳转
 */

import { lazyReportBatch } from '../report'
import { generateUniqueId } from '../utils'
export default function pageChange() {
  // hash history
  let oldUrl = ''
  window.addEventListener(
    'hashchange',
    () => {
      console.error('hashchange', event)
      const newUrl = event.newURL
      const reportData = {
        from: oldUrl,
        to: newUrl,
        type: 'behavior',
        subType: 'hashchange',
        startTime: performance.now(),
        uuid: generateUniqueId(),
      }
      lazyReportBatch(reportData)
      oldUrl = newUrl
    },
    true
  )

  let from = ''
  window.addEventListener(
    'popstate',
    function (event) {
      console.log('error', event)
      const to = window.location.href
      const reportData = {
        from: from,
        to: to,
        type: 'behavior',
        subType: 'popstate',
        startTime: performance.now(),
        uuid: generateUniqueId(),
      }
      lazyReportBatch(reportData)
      from = to
    },
    true
  )
}
