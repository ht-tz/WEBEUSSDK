/*
 * @Author: htz
 * @Date: 2024-05-27 11:52:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-27 12:05:58
 * @Description: pv数据统计
 */

import { lazyReportBatch } from '../report'
import { generateUniqueId } from '../utils'

/**
 * @description pv数据统计
 * @method pv
 */
export default function pv() {
  const resportData = {
    type: 'beheavior',
    subType: 'pv',
    startTime: performance.now(),
    pageUrl: window.location.href,
    referrer: document.referrer, // 从哪里跳转过来的URI
    uuid: generateUniqueId(),
  }

  lazyReportBatch(resportData)
}
