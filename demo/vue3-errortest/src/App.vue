<!--
 * @Author: htz
 * @Date: 2024-05-28 14:59:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-28 15:08:17
 * @Description: 请填写简介clicl
-->
<script setup>
import HelloWorld from './components/HelloWorld.vue'

const jsErr = () => {
  console.log(a)
  let num = new Number(123.789)
  console.log(num.toFixed(-1))
}
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <button @click="jsErr">模拟模拟错误</button>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
