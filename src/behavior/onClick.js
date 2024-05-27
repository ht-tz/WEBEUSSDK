/*
 * @Author: htz
 * @Date: 2024-05-27 11:52:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-27 17:07:17
 * @Description: 点击事件数据统计
 */
import { lazyReportBatch } from '../report'

export default function sysClick(data) {
  ;['mousedown', 'touchstart'].forEach((eventType) => {
    window.addEventListener(eventType, function (e) {
      const target = e.target
      if (target.tagName) {
        const reportData = {
          //点到元素的时候才尽兴上报
          // scrollTop: document.documentElement.scrollTop,
          type: 'behavior',
          subType: 'click',
          target: target.tagName, //点击的元素名称
          startTime: e.timeStamp,
          innerHtml: target.innerHTML,
          outerHtml: target.outerHTML,
          with: target.offsetWidth,
          height: target.offsetHeight,
          eventType,
          path: e.path,
        }
        lazyReportBatch(reportData)
      }
    })
  })
}
