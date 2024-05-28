# [window.onerror 和window.addEventListener('error')的区别](https://segmentfault.com/a/1190000023259434)

全局处理js运行时未处理异常的时候，常用到window.onerror，有时候会用到window.addEventListener('error',function(event){}),这二者到底有什么区别呢？

#### window.onerror

window.onerror是一个全局变量，默认值为null。当有js运行时错误触发时，window会触发error事件，并执行window.onerror()。onerror可以接受多个参数。

```javascript
window.onerror = function(message, source, lineno, colno, error) { ... }

函数参数：

*   message：错误信息（字符串）。可用于HTML onerror=""处理程序中的event。
*   source：发生错误的脚本URL（字符串）
*   lineno：发生错误的行号（数字）
*   colno：发生错误的列号（数字）
*   error：Error对象

若该函数返回true，则阻止执行默认事件处理函数，如异常信息不会在console中打印。没有返回值或者返回值为false的时候，异常信息会在console中打印
```

#### addEventListener('error')

监听js运行时错误事件，会比window.onerror先触发，与onerror的功能大体类似，不过事件回调函数传参只有一个保存所有错误信息的参数，不能阻止默认事件处理函数的执行，但可以全局捕获资源加载异常的错误

```javascript
window.addEventListener('error', function(event) { ... })

当资源（如img或script）加载失败，加载资源的元素会触发一个Event接口的error事件，并执行该元素上的onerror()处理函数。这些error事件不会向上冒泡到window，但可以在捕获阶段被捕获
因此如果要全局监听资源加载错误，需要在捕获阶段捕获事件
//图片加载失败使用默认图片，依旧加载失败超过三次使用base64图片
window.addEventListener('error',function(e){
    let target = e.target, // 当前dom节点
        tagName = target.tagName,
        count = Number(target.dataset.count ) || 0, // 以失败的次数，默认为0
        max= 3; // 总失败次数，此时设定为3
    // 当前异常是由图片加载异常引起的
    if( tagName.toUpperCase() === 'IMG' ){
        if(count >= max){
            target.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//AK3/ALYH+5hX6FV5N4Y/5GHwx/vyf+iJa9ZrysPhoYVShDZu/potDmwWFhhIzhT2bv6aLQ//Z';
        }else{
            target.dataset.count = count + 1;
            target.src = '//xxx/default.jpg';
        }
    }
},true)
```