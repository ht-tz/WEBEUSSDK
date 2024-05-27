/*
 * @Author: htz
 * @Date: 2024-05-27 17:24:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-27 18:00:21
 * @Description: rollup 打包
 */

const path = require('path')
const json = require('@rollup/plugin-json')
const { babel } = require('@rollup/plugin-babel')

const resolveFile = function (filePath) {
  return path.join(__dirname, filePath)
}

const plugins = [
  json({
      compact: true, //忽略生成最小紧凑代码，去除不必要的空白和缩进
  }),
  babel({
    extensions: ['js', '.ts'],
    babelHelpers: 'bundled',
    presets: [
      [
        '@babel/env',
        {
          targets: {
            browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
          },
        },
      ],
    ],
  }),
]

module.exports = [
  {
    plugins,
    input: resolveFile('../src/webEyeSDK.js'),
    output: {
      file: resolveFile('../dist/monitor.js'),
      format: 'iife',
      name: 'monitor',
      sourcemap: true,
    },
  },
  {
    plugins,
    input: resolveFile('../src/webEyeSDK.js'),
    output: {
      file: resolveFile('../dist/monitor.esm.js'),
      format: 'esm',
      name: 'monitor',
      sourcemap: true,
    },
  },
  {
    plugins,
    input: resolveFile('../src/webEyeSDK.js'),
    output: {
      file: resolveFile('../dist/monitor.cjs.js'),
      format: 'cjs',
      name: 'monitor',
      sourcemap: true,
    },
  },
]
