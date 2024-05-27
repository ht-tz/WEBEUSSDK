/*
 * @Author: htz
 * @Date: 2024-05-25 22:06:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-27 16:23:24
 * @Description:  服务端
 */

const express = require('express')
//允许跨域情趣
const cors = require('cors')
const bodyParse = require('body-parser')
const app = express()
app.use(cors())
// 解析application/x-www-form-urlencoded数据
app.use(bodyParse.urlencoded({ extended: false }))
// 解析application/json数据
app.use(bodyParse.json())
// 解析text/plain数据
app.use(bodyParse.text())

app.post('reportData', (req, res) => {
  console.log(req.body)
  res.status(200).send('ok')
})

app.listen(9000, () => {
  console.log('server is running at http://localhost:9000')
})
