import { lazyReportBatch } from '../report'
export default function observeLoad() {
  window.addEventListener('pageShow', function (event) {
    //页面重绘周期内上报
    requestAnimationFrame(() => {
      let typeArr = ['load', 'DomcontentLoad']
      typeArr.forEach((type) => {
        const reportData = {
          type: 'performance',
          subType: type,
          pageUrl: window.location.href,
          startTime: performance.now() - event.timeStamp,
        }
        console.error('performanceLoad', reportData)
        // 发送数据
        lazyReportBatch(reportData)
      })
    }, true)
  })
}
