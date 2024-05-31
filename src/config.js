/*
 * @Author: htz
 * @Date: 2024-04-24 08:24:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-28 23:27:38
 * @Description:SDk上报传递一些参数
 */
const config = {
  url: 'http://127.0.0.1:8080/api',
  projectName: 'eyesdk',
  appId: '123456',
  userId: '123456',
  isImageUpload: false, // 是否选择图片上传
  batchSize: 5,
}
export function setConfig(options) {
  for (const key in config) {
    if (options[key]) {
      config[key] = options[key]
    }
  }
}
export default config
