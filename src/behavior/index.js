/*
 * @Author: htz
 * @Date: 2024-05-27 11:53:03
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-27 15:45:00
 * @Description: 事件，PV,以及页面跳转
 */
import onClick from './onClick'
import pageChange from './pageChange'
import pv from './pv'

export default function behavior() {
  onClick(), pageChange(), pv()
}
