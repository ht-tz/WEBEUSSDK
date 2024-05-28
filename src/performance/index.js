/*
 * @Author: htz
 * @Date: 2024-05-25 22:33:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-28 12:41:04
 * @Description: 请填写简介
 */
import fetch from './fetch'
import observeEntries from './observeEntries'
import observeLCP from './observeLCP'
import observeFCP from './observeFCP'
import observeLoad from './observeLoad'
import observePaint from './observePaint'
import xhr from './xhr'

export default function performance() {
  fetch()
  observeEntries()
  observeLCP()
  observeFCP()
  observeLoad()
  observePaint()
  xhr()
}
