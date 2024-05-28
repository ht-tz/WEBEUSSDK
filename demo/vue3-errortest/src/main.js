/*
 * @Author: htz
 * @Date: 2024-05-28 14:59:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-28 15:05:29
 * @Description:  vue
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import monitor from '../../../src/webEyeSDK'
const app = createApp(App)
app.use(monitor, {
  url: 'http://localhost:9000/repportData',
})
app.mount('#app')
