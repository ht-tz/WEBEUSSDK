/*
 * @Author: htz
 * @Date: 2024-05-25 22:33:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-27 18:09:00
 * @Description:  请求时间计算
 */

import { lazyReportBatch } from '../report'

const orginalFetch = window.fetch
function overwriteFetech() {
  window.fetch = function (url, options) {
    const startTime = Date.now()
    const reportData = {
      type: 'performance',
      subType: 'fetch',
      url: url,
      startTime: startTime,
      method: options.method,
    }
    return orginalFetch(url, options)
      .then((res) => {
        const endTime = Date.now()
        reportData.endTime = endTime
        reportData.duration = endTime - startTime
        const data = res.clone()
        reportData.success = data.ok
        reportData.status = data.status
        //TODO 数据上报
        lazyReportBatch(reportData)

        return res
      })
      .catch((err) => {
        const endTime = Date.now()
        reportData.endTime = endTime
        reportData.duration = endTime - startTime
        reportData.success = false
        reportData.status = 0

        //TODO  上报数据
        lazyReportBatch(reportData)
      })
  }
}

/**
 * @description 请求
 * @method fetch
 */
export default function fetch() {
  overwriteFetech()
}
