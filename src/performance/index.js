/*
 * @Author: htz
 * @Date: 2024-05-25 22:33:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-27 18:08:36
 * @Description: 请填写简介
 */
import fetch from './fetch'
import observerEntries from './observeEntries'
import observerLCP from './observeLCP'
import observerFCP from './observeFCP'
import observerLoad from './observeLoad'
import observerPaint from './observePaint'
import xhr from './xhr'

export default function performance() {
  fetch()
  observerEntries()
  observerLCP()
  observerFCP()
  observerLoad()
  observerPaint()
  xhr()
}
