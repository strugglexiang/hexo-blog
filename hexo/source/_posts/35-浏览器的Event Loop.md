---
title: 浏览器的Event Loop
date: 2020-05-19 10:51:50
categories:
    - JavaScript
tags:
---


# 浏览器的Event Loop
Event Loop是JavaScript运行时的异步处理机制。学习Event Loop，就得深入了解JS引擎的内部运行过程，理解起来有一些难度。JS可以运行在浏览器中，也可以运行在Node.js中，Event Loop在这两种环境下的运行机制有明显的区别。本篇是自己对浏览器环境下Event Loop的学习笔记。

<!-- more -->

# JS是单线程运行的
JS是单线程的，一个任务的执行需要等待上一个任务的完成，也就是说任务需要排队。如果上一个任务的执行时间过长，就会造成阻塞。如果是cpu计算导致的阻塞也就算了，但是大部分情况是CPU是闲着的，任务无法快速执行完成是因为要等待I/O设备。JavaScript语言的设计者意识到，CPU完全可以挂起等待中的任务，执行后面的任务，当挂起的任务准备继续后再就绪执行该任务。于是，JS中便有了同步任务和异步任务。

* 同步任务：在时间是上顺序执行的任务。
* 异步任务：任务分为两个步骤，在时间上不连续执行。

# 执行栈(Excution Context Stack)
JS中的任何代码都在**执行上下文（Excution Context Stack）**中运行。在JS代码执行前，首先会创建一个全局执行上下文，然后再运行我们书写的代码。当某个函数调用时，就会创建该函数的执行上下文，然后再执行该函数的函数过程。事实上，JS最开始会执行一个main函数，全局执行上下文也就是main函数的执行上下文。

函数多了，就会有多个执行上下文，为了管理这些执行下上下文，JS引擎创建了执行上下文栈来对此进行管理。

**执行上下文栈**可以看做是一个**存储函数调用的栈结构**，遵循先进后出的原则。

以代码运行过程为例：
```js
function foo() {}

function bar() {
    foo()
}
console.log(bar())
```
![](https://source.strugglexiang.xyz/20_5_18_1.png)

* 浏览器再开始执行全局代码之前，先执行main函数，创建全局执行上下文，将全局执行上下文压入栈的顶部。
* 每当进入一个函数的执行，就会创建该函数的执行上下文，将其压入栈的顶部。函数执行完后，当前函数的执行上下文就会出栈，等待垃圾回收。
* 浏览器的JS引擎总是访问栈顶的执行上下文
* 全局执行上下文只有一个，它在浏览器关闭时出栈


# 任务队列(task queue)
从上我们知道，JS的运行过程就是往执行栈中放入函数的过程。但是，并不是所有的函数都一开始就会放入栈中执行，当遇见异步代码时，异步代码将会被挂起并在需要执行的时候将其放入**任务队列（task queue）**，当栈中的代码运行完毕，也就是执行栈中只有全局执行上下文时，JS就会读取任务队列中的任务，将其放入执行栈执行。

任务队列遵循先进先出的原则，先入队的任务会先执行。

因此，整个JS的执行可分为以下4步：
1. 所有的同步任务放入执行栈中执行
2. 遇见异步代码，将其挂起，在需要的时候将其放入任务队列。
3. 栈中所有同步代码执行完毕，读取任务队列的任务放入执行栈执行。
4. 重复以上步骤

这样的过程是一直循环执行的，我们将其称之为**Event Loop**。

## task和microtask
任务队列中的任务根据任务源的不同，分为task（宏任务）和microtask（微任务）

task，也叫macrotask，它的任务来源如下：
* script代码
* setTimeout/setInterval
* I/O（一般是指xhr）
* UI交互（DOM点击事件等）

microtask，在ES6中也叫做job，它的来源如下：
* Promise的then与catch（then和catch本身的代码不是job，注册的回调才是job）
* MutationObserver

这里存在一个误区，有些认为宏任务就是同步任务，微任务就是异步任务。这是错误的。

同步和异步是从时间的执行上划分，而task和microtask仅仅是从任务来源划分，这是两个不同维度，并没有关联。


## 任务队列执行的细节
要注意，任务队列并不仅仅只有一个。

一次**Event Loop**循环有一个或多个task queue，其中的task的执行顺序是由入队时间决定的，先入队的先执行。

一次**Event Loop**循环只有一个microtask queue。

一次**Event Loop**循环会不断重复以下步骤：
1. 取出task queue中的队头任务（一个）放入执行栈。
2. 执行栈执行task的同步代码，将异步代码根据任务源放入任务队列中。
3. 依次执行microtask队列中的所有任务。
4. 浏览器UI更新渲染（只是有可能发生）
5. 开启下一轮Event loop，回到第一步。

用伪代码说明执行过程就是：  
> 一个宏任务，所有微任务，一个宏任务，所有微任务
>
> 微任务队列执行完毕，有可能会渲染更新。

```js
// Event Loop循环
while(task queue不为空) {
    (task queue).shift()
    执行所有微任务()
}
```

# 图解Event Loop及代码分析
以图解的形式介绍Event Loop会更加直观明了，再加上代码分析，大概就差不多掌握了Event Loop中的大部分细节。 

![](https://source.strugglexiang.xyz/20_5_18_2.jpg)

有如下代码，你能正确分析打印过程吗？
```js
setTimeout(() => { console.log('setTimeout1') }, 0)
setTimeout(() => { 
    console.log('setTimeout2') 
    Promise.resolve().then(() => {
        console.log('promise2')
        Promise.resolve().then(() => {
            console.log('promise3')
        })
    })
    console.log('hello')
}, 0)
setTimeout(() => { console.log('setTimeout3') }, 0)
Promise.resolve().then(() => {
    console.log('promise1')
})
```
执行结果如下
```
promise1
setTimeout1
setTimeout2
hello
promise2
promise3
setTimeout3
```

分析： 
* 代码由上往下执行，执行一个宏任务（也就是同步的JS代码），发现没有同步代码，将setTimeout1、setTimeout2、setTimeout3放入task queue，将Promise1放入microtask queue
* 执行所有的微任务，输出Promise1，清空微任务队列
* 将setTimeout1的回调函数从宏任务队列中拿出放入执行栈中运行，输出setTimeout1
* 微任务队列为空，执行下一个宏任务setTimeout2
* 首先输出setTimeout2，然后发现Promise2，将其放入微任务队列，然后输出hello
* 执行所有的微任务，也就是执行Promise2，先输出promise2，再将promise3放入微任务队列
* Promise2执行完后，微任务队列不为空，执行Promise3，输出promise3
* 再取出一个宏任务setTimeout3执行

JS代码始终以下执行顺序：
> 一个宏任务
>
> 所有微任务
>
> 有可能视图渲染
>
> 一个宏任务
>
> 所有微任务
>
> ...

# 渲染异步
除了宏任务队列和微任务队列，浏览器的Event Loop还有第3种异步队列RequestAnimationFrame，这与浏览器的渲染相关，本篇不做介绍，建议参考[这篇文章](https://juejin.im/post/5c32eb726fb9a049ee809e2f) 



# 参考
[阮一峰的学习笔记](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)  
[浏览器和NodeJS中不同的Event Loop](https://github.com/kaola-fed/blog/issues/234#render)  
[MDN 并发模型与事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop)  
[掘金 浏览器的 Event Loop](https://juejin.im/post/5c32eb726fb9a049ee809e2f)  
[知乎 如何理解js中的执行栈](https://zhuanlan.zhihu.com/p/59784952)