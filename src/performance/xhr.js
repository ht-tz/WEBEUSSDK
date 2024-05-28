/*
 * @Author: htz
 * @Date: 2024-05-25 22:42:56
 * @LastEditors:
 * @LastEditTime: 2024-05-27 18:11:03
 * @Description: ajax请求
 */
export const originalPhoto = XMLHttpRequest.prototype

export const originalSend = XMLHttpRequest.send
export const originalOpen = XMLHttpRequest.open

function overwriteOpenAndSend() {
  originalPhoto.open = function newOpen(...args) {
    this.url = args[1]
    this.method = args[0]
    originalOpen.apply(this, args)
  }
  originalPhoto.send = function newSend(...args) {
    this.startTime = Date.now()
    const onLoaded = () => {
      this.endTime = Date.now()
      this.duration = this.endTime - this.startTime

      const { url, method, startTime, endTime, duration, status } = this
      console.log(`${method} ${url} ${status} ${duration}ms`)
      const reportData = {
        status,
        duration,
        startTime,
        endTime,
        url,
        method: method.toUpperCase(),
        type: 'performance',
        success: status >= 200 && status < 300,
        subType: 'xhr',
      }

      // 上报数据
      lazydReportBatch(reportData)
      this.removeEventListener('loadend', onLoaded, true)
    }

    //loadend 事件总是在一个资源被加载之后触发
    this.addEventListener('loadend', onLoaded, true)
    orginalSend.apply(this, args)
  }
}

export default function xhr() {
  overwriteOpenAndSend()
}
