1. 埋点监控系统负责处理哪些问题，需要怎么设计api?
2. 为什么用img的src做请求的发送，sendBeacon又是什么?
3. 在react、vue的错误边界中要怎么处理?

![image.png](https://cdn.nlark.com/yuque/0/2024/png/207857/1710986746822-e58a198d-db75-46ef-b6ea-6664de886381.png#averageHue=%23070604&clientId=u81d4be56-c062-4&from=paste&height=369&id=udcffd947&originHeight=738&originWidth=1804&originalType=binary&ratio=2&rotation=0&showTitle=false&size=148392&status=done&style=none&taskId=uc7117747-cfe1-4dcc-a9fa-fe4a64ae456&title=&width=902)

课程思路：
介绍一下功能，这个难点和亮点写到简历里面的收益，
背景，业务使用场景


#### 业务使用场景
公司开发了一个系统，老板和开发人员还有运营人员对这个系统不可预测，用户实际使用时会遇到什么问题？比如：用户浏览过那几个模块，对那块的内容更感兴趣？使用的时候页面有没有什么错误？有没有崩溃？
页面的打开时间？白屏时间？
需要我们收集数据，来开发一个监控的SDK,  收集数据，上报数据，分析数据，从而优化我们的系统，更好的服务好用户
 
:::danger
参考业界的埋点sdk的设计
神策的websdk使用
[https://www.npmjs.com/package/sa-sdk-javascript](https://www.npmjs.com/package/sa-sdk-javascript)
:::

在开始设计之前，先看一下SDK怎么使用。
```javascript
import webDataSDK from 'webDataSDK';
// 全局初始化一次
window.insSDK = new webDataSDK('productId');
<button onClick={()=>{
  window.insSDK.event('click','confirm');
  ...// 其他业务代码
}}>确认</button>
```
首先把SDK实例挂载到全局，之后在业务代码中调用，这里的新建实例时需要传入一个id，因为这个埋点监控系统往往是给多个业务去使用的，通过id去区分不同的数据来源。

首先实现实例化部分：
```javascript
class webDataSDK {
  constructor(productId){
    this.productId = productId;
  }
}
```
#### 数据发送
数据发送是一个最基础的api，后面的功能都要基于此进行。通常这种前后端分离的场景会使用AJAX的方式发送数据，但是这里使用图片的src属性。原因有两点：

1. 没有跨域的限制，像srcipt标签、img标签都可以直接发送跨域的GET请求，不用做特殊处理。
2. 兼容性好，一些静态页面可能禁用了脚本，这时script标签就不能使用了。

但要注意，这个图片不是用来展示的，我们的目的是去「传递数据」，只是借助img标签的的src属性，在其url后面拼接上参数，服务端收到再去解析。
```javascript
class webDataSDK {
  constructor(productId){
    this.productId = productId;
  }
  send(baseURL,query={}){
    query.productId = this.productId;
    let queryStr = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
    let img = new Image();
    img.src = `${baseURL}?${queryStr}`
  }
}
```
> img标签的优点是不需要将其append到文档，只需设置src属性便能成功发起请求。

通常请求的这个url会是一张1X1px的GIF图片 
这里查阅了一些资料并测试了：
1.同样大小，不同格式的的图片中GIF大小是最小的，所以选择返回一张GIF，这样对性能的损耗更小。
2.如果返回204，会走到img的onerror事件，并抛出一个全局错误;  如果返回200和一个空对象会有一个CORB的告
#### 更优雅的web beacon
```javascript
Navigator.sendBeacon(url,data)
```
相较于图片的src，这种方式的更有优势：

- 不会和主要业务代码抢占资源，而是在浏览器空闲时去做发送。
- 并且在页面卸载时也能保证请求成功发送，不阻塞页面刷新和跳转。

现在的埋点监控工具通常会优先使用sendBeacon，但由于浏览器兼容性，还是需要用图片的src兜底。
#### 用户行为监控
实现用户行为监控的api。
```javascript
class webDataSDK {
  constructor(productId){
    this.productId = productId;
  }
  // 数据发送
  send(baseURL,query={}){
    query.productId = this.productId;
    let queryStr = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
    let img = new Image();
    img.src = `${baseURL}?${queryStr}`
  }
   // 自定义事件
  event(key, val={}) {
    let eventURL = 'http://demo/'
    this.send(eventURL,{event:key,...val})
  }
  // pv曝光
  pv() {
    this.event('pv')
  }
}
```
#### 页面性能监控
页面的性能数据可以通过performance.timing这个API获取到，获取的数据是单位为毫秒的时间戳
![image.png](https://cdn.nlark.com/yuque/0/2024/png/207857/1710318627373-7c900e73-37b2-4245-92fd-42b6f38e0cf5.png#averageHue=%23b7b8b7&clientId=u31c615c6-c8f6-4&from=paste&height=543&id=u7e50339e&originHeight=1086&originWidth=1580&originalType=binary&ratio=2&rotation=0&showTitle=false&size=551765&status=done&style=none&taskId=ua587bb32-5e3c-4037-8ebf-f5124febb61&title=&width=790)
![](https://cdn.nlark.com/yuque/0/2024/gif/207857/1710318658193-a28c452c-7ac2-4cbc-b048-3c1624a12c7a.gif#averageHue=%23000000&clientId=u31c615c6-c8f6-4&from=paste&id=u38f11e5f&originHeight=1&originWidth=1&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ub2058dec-c536-41fd-b6cb-99288f8d9ba&title=)上面的不需要全部了解，但比较关键的数据有下面几个，根据它们可以计算出FP/DCL/Load等关键事件的时间点：

1. 页面首次渲染时间：FP(firstPaint)=domLoading-navigationStart。
2. DOM加载完成：DCL(DOMContentEventLoad)=domContentLoadedEventEnd-navigationStart。
3. 图片、样式等外链资源加载完成：L(Load)=loadEventEnd-navigationStart。

上面的数值可以跟performance面板里的结果对应。
回到SDK，我们只用实现一个上传所有性能数据的api就可以了：
```javascript
class webDataSDK {
  constructor(productId){
    this.productId = productId;
    // 初始化自动调用性能上报
    this.initPerformance()
  }
  // 数据发送
  send(baseURL,query={}){
    query.productId = this.productId;
    let queryStr = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
    let img = new Image();
    img.src = `${baseURL}?${queryStr}`
  }
   // 自定义事件
  event(key, val={}) {
    let eventURL = 'http://demo/'
    this.send(eventURL,{event:key,...val})
  }
  // pv曝光
  pv() {
    this.event('pv')
  },
   // 性能上报
  initPerformance(){
    let performanceURL = 'http://performance/'
    this.send(performanceURL,performance.timing)
  }
}
```
 
#### 错误告警监控
错误报警监控分为JS原生错误和React/Vue的组件错误的处理。
#### JS原生错误

![](https://cdn.nlark.com/yuque/0/2024/jpeg/207857/1710384228282-f7290886-9b06-407e-8a60-cae19c3fcfde.jpeg)

除了try catch中捕获住的错误，我们还需要上报没有被捕获住的错误——通过error事件和unhandledrejection事件去监听。
#### error
error事件是用来监听DOM操作错误DOMException和JS错误告警的，具体来说，JS错误分为下面8类：

1. **InternalError: **内部错误，比如如递归爆栈。
2. RangeError: 范围错误，比如new Array(-1)。【运行错误】-- 数组范围错误
```json
Uncaught RangeError: Invalid array
```

3. EvalError: 使用eval()时错误。【运行错误】
4. **ReferenceError: **引用错误，比如使用未定义变量。【运行错误】--变量引用错误
```json
Uncaught ReferenceError: xxx is not defined
```

5. **SyntaxError: **语法错误，比如var a = 。【语法错误】 【运行错误】
```json
Uncaught SyntaxError: Invalid or unexpected token

```

6. **TypeError:** 类型错误，比如[1,2].split('.')。【运行错误】-  数据类型错误
```json
Uncaught TypeError: xxx is not a function
```

7. **URIError:** 给 encodeURI或 decodeURl()传递的参数无效，比如decodeURI('%2')。
```json
当使用encodeURI或者decodeURI报错的时候会出现这个错误 
```

8. **Error:** 上面7种错误的基类，通常是开发者抛出。

也就是说，代码运行时发生的上述8类错误，都可以被检测到。
#### unhandledrejection
Promise内部抛出的错误是无法被error捕获到的，这时需要用unhandledrejection事件。

#### 错误捕获方式

1. **try-catch语句**
```javascript
try {
  // 可能会抛出异常的代码
} catch (error) {
  // 处理异常的代码
}

```
> try-catch语句可以用来捕获JavaScript代码中的语法错误和运行时错误。当代码块中的语句抛出异常时，程序会跳转到catch语句块，并执行相应的处理逻辑。
> 注意：try-catch语句适用于**同步代码**的错误捕获，如果代码块中存在**异步代码**，try-catch语句无法捕获异步代码中的错误。

 

2. **window.onerror**

捕获全局JS异常，包括同步和异步代码中的错误
```javascript
window.onerror = function(message, source, lineno, colno, error) {
  // 处理错误的代码
}
```
> window.onerror是一个全局的错误处理函数，可以用来捕获未被try-catch捕获的运行时错误。当JavaScript代码执行发生异常时，会自动触发window.onerror函数，并传递相应的错误信息。

3. **window.addEventListener("error")**

捕获静态资源加载错误

- 可以捕获，图片、script、css加载的错误，
- 不可以捕获，new Image错误和fetch错误
```javascript
window.addEventListener('error', function (event) {
  // 处理错误
});

```
> window提供的可以监听window对象上的error事件，与window.onerror不同，error事件监听器可以在页面中的任何元素上注册，以捕获特定元素中发生的错误。


```javascript
class webDataSDK {
  constructor(productId){
    this.productId = productId;
    // 初始化自动调用性能上报
    this.initPerformance();
    // 初始化错误监控
    this.initError();
  }
  // 数据发送
  send(baseURL,query={}){
    query.productId = this.productId;
    let queryStr = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
    let img = new Image();
    img.src = `${baseURL}?${queryStr}`
  }
   // 自定义事件
  event(key, val={}) {
    let eventURL = 'http://demo/'
    this.send(eventURL,{event:key,...val})
  }
  // pv曝光
  pv() {
    this.event('pv')
  },
   // 性能上报
  initPerformance(){
    let performanceURL = 'http://performance/'
    this.send(performanceURL,performance.timing)
  }
  // 自定义错误上报
  error(err, etraInfo={}) {
    const errorURL = 'http://error/'
    const { message, stack } = err;
    this.send(errorURL, { message, stack, ...etraInfo})
  }
  // 初始化错误监控
  initError(){
    window.addEventListener('error', event=>{
      this.error(error);
    })
    window.addEventListener('unhandledrejection', event=>{
      this.error(new Error(event.reason), { type: 'unhandledrejection'})
    })
  }
}
```
#### React/Vue组件错误
成熟的框架库都会有错误处理机制，React和Vue也不例外。
以[vue3](https://so.csdn.net/so/search?q=vue3&spm=1001.2101.3001.7020)提供了errorHandler，
指定一个处理函数，来处理组件渲染函数和侦听器执行期间抛出的未捕获错误。这个处理函数被调用时，可获取错误信息和相应的应用实例。
```javascript
// 在main.ts 中设置全局错误捕获
Vue.config.errorHandler = (err, vm, info) => {
  console.log('[全局异常]', err, vm, info)
}
err.message
err.stack
```
错误内容
```javascript
[全局异常] ReferenceError: dawei is not defined
    at asset-mgmt.vue:241:15
    at callWithErrorHandling (runtime-core.esm-bundler.js:155:22)
    at callWithAsyncErrorHandling (runtime-core.esm-bundler.js:164:21)
    at hook.__weh.hook.__weh (runtime-core.esm-bundler.js:2667:29)
    at flushPostFlushCbs (runtime-core.esm-bundler.js:356:32)
    at flushJobs (runtime-core.esm-bundler.js:401:9) VueInstance mounted hook

```
### 上报方式需要注意的内容
**利用Image对象上报**
**优势**

- 需要注意在拼接参数的时候，需要使用 encodeURIComponent 对值进行转移否则将 location.href 这类url作为值时会造成错误
- 相比PNG/JPG，gif的体积可以达到最小，采用1*1像素透明色来上报，不存储色彩空间数据，
```javascript
//使用方式
 (new Image()).src='http:xxxxx'  //上报路径  
 
//示例
function parseJsonToString(dataJson) {
  if (!dataJson ) { dataJson = {} }
  var dataArr = Object.keys(dataJson).map(function(key) { return key + '=' + encodeURIComponent(dataJson[key]) })
  return dataArr.join('&')
}

const logGif = (params) => {
  const upload = parseJsonToString(params)
  const img = new Image(1,1)
  img.src = 'https://view-error?' + upload
}

```
**Navigator.sendBeacon**
```javascript
navigator.sendBeacon(url, data);
- url：表示 data 将要被发送到的网络地址；
- data：将要发送的 ArrayBufferView 或 Blob, DOMString 或者 FormData 类型的数据。
- 返回值：当用户代理成功把数据加入传输队列时，sendBeacon() 方法将会返回 true，否则返回 false。

```
> sendBeacon并不像XMLHttpRequest一样可以直接指定Content-Type，且不支持application/json等常见格式。data的数据类型必须是 ArrayBufferView 或 Blob, DOMString 或者 FormData 类型的
> 

```javascript
// 请求数据string，自动设置Content-Type 为 text/plain
const reportData = (url, data) => {
  navigator.sendBeacon(url, data);
};

// Blob一般手动设置其MIME type，一般设置为 application/x-www-form-urlencoded
const reportData = (url, data) => {
  const blob = new Blob([JSON.stringify(data), {
    type: 'application/x-www-form-urlencoded',
  }]);
  navigator.sendBeacon(url, blob);
};

// 可以直接创建一个新的Formdata，请求头自动设置Content-Type为multipart/form-data
const reportData = (url, data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    let value = data[key];
    if (typeof value !== 'string') {
      // formData只能append string 或 Blob
      value = JSON.stringify(value);
    }
    formData.append(key, value);
  });
  navigator.sendBeacon(url, formData);
};


```
### 开源的平台
```json
一些常见的错误捕获库
- Sentry：一个流行的开源错误捕获和上报库，提供了完整的错误上报和跟踪功能。
- Bugsnag：另一个常用的错误捕获和上报库，提供了实时错误通知和可视化分析等功能。
- Raygun：一个专业的错误监测和分析平台，提供了多种编程语言的错误监测和分析功能。

```
集中式日志平台可以帮助我们集中管理和分析前端错误。开发人员只需要将错误信息上报到集中式日志平台，即可实现错误信息的集中管理和分析，但是需要开发人员自己搭建或者使用第三方的集中式日志平台
> 一些用于错误上报和分析的专业的监控系统，例如New Relic、AppDynamics和Datadog等。

捕获错误，上报错误，分析错误，解决错误

![](https://cdn.nlark.com/yuque/0/2024/jpeg/207857/1710321883826-a5dd6544-1926-4a13-b5d8-8f78392a7394.jpeg)
```javascript
//捕获错误
try {
  // 可能会抛出异常的代码
} catch (error) {
  // 处理异常的代码
  handleError(error); // 处理错误
}

function handleError(error) {
  // 上报错误
  reportError(error);
  // 处理错误
  switch(error.type) {
    case 'SyntaxError':
      // 处理语法错误
      break;
    case 'ReferenceError':
      // 处理引用错误
      break;
    case 'TypeError':
      // 处理类型错误
      break;
    default:
      // 其他错误
      break;
  }
  // 解决错误
  fixError(error);
}


```
:::danger

- 1）使用try-catch语句捕获前端错误。
- 2）在catch语句块中调用了handleError函数进行错误处理。（_在handleError函数中，我们首先将错误信息上报到指定的服务器。_）
- 3）根据错误类型进行处理。（_例如处理语法错误、引用错误、类型错误等等。最后，我们使用fixError函数对错误进行修复。_）
:::


### 上报哪些数据
![image.png](https://cdn.nlark.com/yuque/0/2024/png/207857/1710471299208-bd8a0c4b-7b75-420e-ad1f-0c2993e6bd23.png#averageHue=%23fcfcfc&clientId=u2f7a36d2-8dfe-4&from=paste&height=438&id=u860152e4&originHeight=420&originWidth=432&originalType=binary&ratio=2&rotation=0&showTitle=false&size=30856&status=done&style=none&taskId=ub00127fe-88f9-4d5f-8ee9-b8140106780&title=&width=451)
:::danger
其中核心的应该是错误栈，其实我们定位错误最主要的就是错误栈。
错误堆栈中包含了绝大多数调试有关的信息。其中包括了异常位置（行号，列号），异常信息
:::
#### 上报方式
 上报就是要将捕获的异常信息发送到后端。最常用的方式首推动态创建标签方式。因为这种方式无需加载任何通讯库，而且页面是无需刷新的。
目前包括百度统计 Google统计都是基于这个原理做的埋点数据上报。
```javascript
new Image().src = 'http://localhost:9001/monitor/error?info=' + xxxxxx

```
#### 上报数据序列化
```javascript
window.addEventListener('error', args => {
  console.log(
    'error event:', args
  );
  uploadError(args)
  return true;
}, true); // 注意第二个参数是true 捕获阶段

function uploadError({
    lineno,
    colno,
    error: {
      stack
    },
    timeStamp,
    message,
    filename
  }) {
    // 过滤
    const info = {
      lineno,
      colno,
      stack,
      timeStamp,
      message,
      filename
    }
    // const str = new Buffer(JSON.stringify(info)).toString("base64");
  	const str = window.btoa(JSON.stringify(info))
    const host = 'http://localhost:9001/monitor/error'
    new Image().src = `${host}?info=${str}`
}
大概分成以下三步：
将异常数据从属性中解构出来存入一个JSON对象
将JSON对象转换为字符串
将字符串转换为Base64

```
