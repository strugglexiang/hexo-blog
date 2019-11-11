---
title: "彻底认清JS中的this"
date: 2019-11-11 19:37:29
categories: JavaScript
tags:
---


# 前言
有关`JavaScript`中的`this`，网络上充斥着大量的知识文章，日常编码和面试时也时常涉及相关的知识。本篇就来梳理一下和`this`相关的知识点，夯实基础。
<!-- more -->

# 目录
- [this的指向问题](#this的指向问题)
  - [全局执行环境](#全局执行环境)
  - [作为对象属性调用](#作为对象属性调用)
  - [call、apply、bind的作用](#call、apply、bind的作用)
  - [new操作符](#new操作符)
  - [箭头函数](#箭头函数)
- [如何修改this的指向](#如何修改this的指向)
  - [通过变量_this提前缓存](#通过变量_this提前缓存)
  - [call方法](#call方法)
  - [apply方法](#apply方法)
  - [bind方法](#bind方法)
  - [箭头函数](#箭头函数)
  - [new操作符](#new操作符)
- [用原生方法实现call、apply、bind、new操作符](#用原生方法实现call、apply、bind、new操作符)
  - [myCall](#myCall)
  - [myApply](#myApply)
  - [myBind](#myBind)
  - [myNew](#myNew)
- [总结](#总结)

# this的指向问题
`this`到底指向什么？在大多数情况下， 是取决于函数是如何调用的。

## 全局执行环境
在非严格模式下，全局执行环境中的`this`指向全局对象（window、self、global）；在严格模式下，全局执行环境中的`this`为`undefined`
```js
// 非严格模式
(function() {
    return this
})() === window
// => true
```
```js
// 全局使用严格模式
'use strict';
(function() {
    return this
})() === undefined 
// => true
```
```js
// 特定函数内部使用严格模式
(function() {
    'use strict'
    return this
})() === undefined
// => true
```

## 作为对象属性调用
当函数作为对象的一个属性调用时，**该函数内部的this指向最后调用它的那个对象**。

例：
```js
var a = 20
var obj = {
    a: 10,
    fn: function() {
        console.log(this.a)
    }
}
obj.fn() // => 10

var fn2 = obj.fn
fn2() // =>  20
```
`obj.fn()`相当于`window.obj.fn()`，最后是由`obj`调用的，所以this就指向obj;`fn2()`相当于`window.fn2()`，所以this指向window。


## call、apply、bind的作用
我们经常使用`call、apply、bind`3个方法来指定函数内部`this`。
```js
var a = 20
var obj = {
    a:  10
}
function fn(...args) {
    console.log(this.a, args)
}

fn.call(obj, 1, 2) // 10 [1, 2]
fn.apply(obj, [1, 2]) //10 [1, 2]
fn.bind(obj, 1, 2)() // 10 [1, 2]
```
可见看到，函数fn内部的`this`全部绑定在`obj`对象上了。

其中，`call、apply`的作用是**指定函数内部this并执行函数**，不同点在于`call`方法接受依次分开的参数，`apply`方法接受一个参数数组。`bind`方法不同于前面二者，它的作用是**生成一个函数体相同的新函数，并指定好新函数内部的this和部分参数**。

## new操作符
我们知道，new操作符的实质是生成一个新的实例对象，被new操作的函数称为构造函数。构造函数中的`this`永远指向它新生成的这个实例对象。
```js
function people(name) {
    this.name = name
}
var instance = new people('Bob')
console.log(instance) // {name: "Bob"}
```
可以看到，`name`属性被附加到`instance`上了。

## 箭头函数
* 普通函数在运行时才会确认this的指向。
* 箭头函数在编译时就确认了this的指向，此时this指向它外层的作用域。

> 箭头函数不会创建自己的this,它只会从自己的作用域链的上一层继承this。

例：
```js
var a = 20
var fn = () => {
    console.log(this.a)
}
var obj = {
    a: 10
}
obj.fn = fn

var f = obj.fn

fn() //20
obj.fn() //20
window.obj.fn() //20
f() //20
```
可以看到，不论`this`如何调用，它永远固定在外层的作用域，此时为window。


有时候，箭头函数外层作用域的this是不确定的。
例：
```js
var a = 20
var obj = {
    a: 10,
    fn: function() {
        (() => {
            console.log(this.a)
        })()
    }
}

var f = obj.fn

obj.fn() // 10
f() //20
```
上述示例，fn内部有一个箭头函数自执行，这个箭头函数的`this`指向外层作用域fn，也就是说，fn的this指向什么，箭头函数的this就指向什么。`obj.fn()`运行时，fn的`this为obj`，所以箭头函数的this也为obj；`window.f`运行时，fn的this为`window`，此时箭头函数的this也为`window`。

# 如何修改this的指向
如果需要人为的修改this的指向，有以下几种方法：

* 提前用变量缓存this
* 使用call
* 使用apply
* 使用bind
* 箭头函数
* new操作符

## 通过变量_this提前缓存
这个方法常常使用到，通过一个变量（例如_this）手动缓存this，当需要使用到时用缓存的变量替换`this`。

```js
var a = 10
var obj =  {
    a: 20,
    fn: function() {
        var _this = this
        setTimeout(function() {
            console.log(this.a, _this.a)
        }, 100)
    }
}
obj.fn() // 10 20
```
`obj.fn`中的this指向obj，`window.setTimeout`中的this指向window。


## call方法
`call`方法的作用是指定函数内部的this并立即调用函数。

```js
var a = 10
var obj = {
    a: 20,
    fn() {
        console.log(this.a)
    }
}

var fn = obj.fn
fn() // => window.fn  => window.a => 10
obj.fn() // obj.fn => obj.a  => 20 
obj.fn.call({ a: 30})  // this指向传入的对象 { a: 30 }  => 30
```

注意： 
1. 若`call`方法的第一个参数是**null**、**undefined**或不传，则非严格模式下`this`指向全局
2. 第一个参数传入原始类型的值，原始值将被转为包装对象，如**1**将被转为**Number**对象，这个对象的[[PrimitiveValue]]值为1

```js
(function() {
    console.log(this) // => Window
}).call(null)


(function() {
    console.log(this)  // => Number {1}
}).call(1)

```


## apply方法
`apply`方法和`call`方法的作用是一样的，都是指定函数内部的`this`并立即执行。不同的是`call`依次接收参数，`apply`接收一个数组
作为函数的参数。

```js
var obj = { hello: 'world' };
(function(a, b, c) {
    console.log(this, a, b, c) // => {hello: "world"}hello: "world"__proto__: Object 1 2 3
}).apply(obj, [1, 2, 3])
```

## bind方法
`bind`方法简单来说就是创建一个与原函数内容一致的新函数，并指定新函数中的`this`和部分参数。

```js
var a = 10
function fn(...args) {
    console.log(this.a, args) // => 20 [1, 2, "hello"]
}
fn.bind({ a: 20 }, 1, 2)('hello')
```
可以看到，新生成的函数内部在运行前绑定了`this`，并提前预存了参数`1, 2`

## 箭头函数
箭头函数中的`this`指向它外层作用域，可以利用这一点改变`this`的指向。

```js
var a = 10
var obj = {
    a: 20,
    fn: function() {
        setTimeout(function() {
            console.log(this.a) // Window.a =>  10
        }, 100)
    }
}
obj.fn()
```

```js
var a = 10
var obj = {
    a: 20,
    fn: function() {
        setTimeout(() => {
            console.log(this.a) 
        }, 100)
    }
}

var fn = obj.fn
obj.fn() // fn中的this指向obj => 箭头函数中的this指向fn中this => 20
fn() // fn中的this指向Window => 箭头函数中的this指向fn中this => 10
```

## new操作符
使用`new`操作符生成一个新的对象，被`new`的函数中的`this`永远指向这个新对象。


# 用原生方法实现call、apply、bind、new操作符
## myCall
伪代码：
* 将`mycall`定义在`Function.prototype`上，使任何函数能够直接调用。
* `mycall`中的`this`指向调用`mycall`的原函数，将这个原函数缓存为`mycall第一个参数`的临时属性。
* 原函数作为对象的方法调用。
* 删除临时属性。

```js
Function.prototype.mycall = function(ctx) {
    ctx.fn = this
    ctx.fn()
    delete ctx.fn
}
```
这样，简单的`mycall`就已经写完了，接下来进行优化

**1、参数传递问题**
```js
Function.prototype.mycall = function(ctx, ...args) {
    ctx.fn = this
    var result = ctx.fn(...args)
    delete ctx.fn
    return result
}
```

**2、临时属性fn可能和ctx已有的属性冲突**
```js
Function.prototype.mycall = function(ctx, ...args) {
    const fn = Symbol('fn')
    ctx[fn] = this
    let result = ctx[fn](...args)
    delete ctx.fn
    return result
}
```

**3、检测传入的ctx是否对为对象**
```js
Function.prototype.mycall = function(ctx, ...args) {
    // 当 ctx 是对象的时候默认设置为 ctx；如果为 null 则设置为 window 否则为空对象
    ctx = typeof ctx === 'object' ? ctx || window : {}
    const fn = Symbol('fn')
    ctx[fn] = this
    let result = ctx[fn](...args)
    delete ctx[fn]
    return result
}
```

**4、检测是否为对象可以使用Object方法，删除属性可以使用Reflect.deleteProperty**
```js
Function.prototype.mycall = function(ctx, ...args) {
    // 当 ctx 是对象的时候默认设置为 ctx；如果为 null 则设置为 window 否则为空对象
    ctx = ctx ? Object(ctx) : window 
    const fn = Symbol('fn')
    ctx[fn] = this
    let result = ctx[fn](...args)
    Reflect.deleteProperty(ctx, fn)
    return result 
}
```

最终来测验一下:
```js
Function.prototype.mycall = function(ctx, ...args) {
    ctx = ctx ? Object(ctx) : window 
    const fn = Symbol('fn')
    ctx[fn] = this
    let result = ctx[fn](...args)
    Reflect.deleteProperty(ctx, fn)
    return result 
}

{
    (function() {
        console.log(this, arguments)
    }).mycall({ h: 'hello' }, '123')
}
```

## myApply
`myApply`和`mycall`的实现方法大同小异，只是参数处理有所不同

```js
Function.prototype.myApply = function(ctx, args) {
    ctx = ctx ? Object(ctx) : window 
    const fn = Symbol('fn')
    ctx[fn] = this
    let result = ctx[fn](...args)
    Reflect.deleteProperty(ctx, fn)
    return result 
}
```

## myBind
伪代码：
1. 将`mybind`定义在`Function.prototype`上
2. 返回值为函数，函数体调用原函数并绑定this

```js
Function.prototype.myBind = function(ctx) {
    return () => {
        this.call(ctx)
    }
}
```

优化：

**1、参数传递**
```js
Function.prototype.myBind = function(ctx, ...args1) {
    return (...args2) => {
        this.call(ctx, ...args1, ...args2)
    }
}
```


**2、bind生成的函数可能被new调用，这个时候需要忽略传入的this但保留预存的参数**
```js
// 例
obj = {
    name: '西红柿'
}
function food(type) {
    this.type = type
    console.log(this.type, this.name) // 蔬菜 undefined
}
food.prototype.price = 12

let a = food.bind(obj, '蔬菜')
new a()
```
虽然bind绑定了函数中的this为obj，但是new操作符重新将this的指向改为生成的实例对象，同时还保留了预存的参数‘蔬菜’, 因此我们还需进一步改造。

```js
Function.prototype.myBind = function(ctx, ...args1) {
    let _this = this
    const fn =  function(...args2) {
        return _this.call(this instanceof fn ? this : ctx, ...args1, ...args2)
    }
    return fn
}
```

此时，`this`的指向问题解决了，但是如果被new操作符调用，新生成的实例并未继承于原函数的函数原型，我们需要指定原型
```js
Function.prototype.myBind = function(ctx, ...args1) {
    let _this = this
    const fn =  function(...args2) {
        return _this.call(this instanceof fn ? this : ctx, ...args1, ...args2)
    }
    fn.prototype = this.prototype
    return fn
}
```
直接赋值指定函数原型，改变bind后的函数的原型也意味着同时改变了原函数的函数原型，可以做进一步处理
```js
Function.prototype.myBind = function(ctx, ...args1) {
    let _this = this
    function temp() {}
    const fn =  function(...args2) {
        return _this.call(this instanceof fn ? this : ctx, ...args1, ...args2)
    }
    temp.prototype = this.prototype
    fn.prototype = new temp()
    return fn
}
```

测试
```js
Function.prototype.myBind = function(ctx, ...args1) {
    let _this = this
    function temp() {}
    const fn =  function(...args2) {
        return _this.call(this instanceof fn ? this : ctx, ...args1, ...args2)
    }
    temp.prototype = this.prototype
    fn.prototype = new temp()
    return fn
}
//
function food(type) {
    this.type = type
    console.log(this.type, this.name) //=> 蔬菜 undefined
}
food.prototype.price = 12
//
obj = {
    name: '西红柿'
}
let a = food.myBind(obj, '蔬菜')
a.prototype.price = 13

let b = new a()
console.log(b, b.price) // => fn {type: "蔬菜"} 13
console.log(food.prototype.price) // =>  12
```

## myNew
伪代码：new操作符主要做作用
1. 创建新对象
2. 给新对象绑定原型
3. 绑定this并执行函数
4. 返回新对象

```js
let myNew = function(constructor, ...args) {
    var obj = {}
    obj.__proto__ = constructor.prototype
    constructor.call(obj, ...args)
    return obj
}


function person(name, age) {
    this.name = name
    this.age = age
}

console.log(myNew(person, 'Bob', 12))
```



# 总结
# 参考
本篇不是无本之沫，参考：   
<https://cnodejs.org/topic/5c813fd490c14711cc8cb5ae>   
<https://juejin.im/post/59bfe84351882531b730bac2#heading-10>   
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions>   
