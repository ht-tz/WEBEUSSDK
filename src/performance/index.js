/*
 * @Author: htz
 * @Date: 2024-05-25 22:33:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-31 19:04:30
 * @Description:  性能导出函数
 */
import fetch from './fetch'
import observeEntries from './observeEntries'
import observeLCP from './observeLCP'
import observeFCP from './observeFCP'
import observeLoad from './observeLoad'
import observePaint from './observePaint'
import observeFID from './observeFID'
import xhr from './xhr'

export default function performance() {
  fetch()
  observeEntries()
  observeLCP()
  observeFCP()
  observeLoad()
  observePaint()
  observeFID()
  xhr()
}
