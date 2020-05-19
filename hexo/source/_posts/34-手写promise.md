---
title: 手写promise
date: 2020-05-19 10:51:40
categories:
    - JavaScript
tags:
---


# 引言
Promise是解决异步编码的一种方案。手写Promise，会大大加深对Promise的理解，日常在使用Promise时也会更加得心应手。本篇尝试手写一份符合Promises/A+规范的Promise。

<!-- more -->

# Promise解决了什么问题
在Promise出现以前，主要是通过回调函数来解决异步编程问题。使用回调函数的本身没有问题，但是回调函数的多次嵌套会形成回调地狱。如：
```js
let fs = require('fs')
fs.readFile('a.txt', (err, data) => {
    fs.readFile('b.txt', (err, data) => {
        fs.readFile('c.txt', (err, data) => {

        })
    })
})
```
上述代码依次读取3个文件，层层递进。可以看到，多个异步回调嵌套在一起，代码的发展是横向的，具有很强的耦合，不论是从排版上还是排错上都很难维护。

如果使用Promise，代码将会变成纵向发展，更加符合编程的逻辑：
```js
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

readFile('a.txt')
.then((data) => {
    return readFile('b.txt')
})
.then((data) => {
    return readFile('c.txt')
})
.then((data) => {
    // ...
})
```

# 手写Promise
## Promise代码的基本结构
```js
function myPromise(actuator) {
    this.state = 'pending'
    this.value = undefined
    this.reson = undefined
    const that = this

    function resolve(value) {
    }

    function reject(reson) {
    }


}

```
* Promise内部维护一个状态，它可以取3个值：pending（等待态）、resolved（成功态）和rejected（失败态）
* value保存执行成功的结果
* reason保存执行失败的原因
* 内部提供方法resolve和reject，用于改变当前Promise的状态
* 用that缓存实例很重要，因为`this`的指向很有可能发生变化

Promise创建时，传入的执行器函数会立即执行，执行器传入两个参数resolve、reject

```js
function myPromise(actuator) {
    this.state = 'pending'
    this.value = undefined
    this.reson = undefined
    const that = this

    function resolve(value) {
    }

    function reject(reson) {
    }

    try {
        actuator(resolve, reject)
    } catch (error) {
        reject(error)
    }
}
```

`resolve`方法用于将Promise状态变成功态，`reject`方法用于用于将Promise状态变失败态。规范规定，当Promise状态为等待态时，才能改变状态
```js
function resolve(value) {
    if(that.state === 'pending') {
        that.state = 'resolved'
        that.value = value
    }
}

function reject(reson) {
    if(that.state === 'pending') {
        that.state = 'rejected'
        that.reson = reson
    }
}
```

## then方法位于原型链上
每个Promise都有一个then方法，它用于处理异步返回的结果，then方法位于原型对象上。
```js
myPromise.prototype.then = function(onFulfilled, onRejected) {
    if(this.state === 'resolved') {
        if(typeof onFulfilled === 'function') {
            onFulfilled(this.value)
        }
    }
    if(this.state === 'rejected') {
        if(typeof onRejected === 'function') {
            onRejected(this.reson) 
        }
    }
}
```
* `onFulfilled`在Promise对象变为成功态时执行
* `onRejected`在Promise对象变为失败态时执行
* 规范规定，如果传入的onFulfilled和onRejected不是函数，则不用处理

写到这里，一个简单的Promise就完成了
```js
let a = new myPromise((resolve, reject) => {
    resove(1)
})
a.then((data) => {
    console.log(data) // 1
})
```

但是此时它只能支持同步代码，不支持异步代码
```js
let a = new myPromise((resolve, reject) => {
    setTimeout(function() {
        resolve(1)
    }, 500)
})
a.then((data) => {
    console.log(data) // 不执行
})
```
此时，then方法中传入的onFulfilled并不会执行，因为then方法执行时，Promise内部的状态为`pending`。

## 支持异步
为了使Promise支持异步，当Promise内部状态为等待态时，需要将`then`方法的传入的`onFulfilled`和`onRejected`作为回调函数缓存起来，然后在内部状态改变的时候调用。回调有可能会注册多个，所以用数组缓存。

```js
function myPromise(actuator) {
    this.state = 'pending'
    this.value = undefined
    this.reson = undefined
    this.resolveCallFuncs = [] // 状态成为resolved时的回调
    this.rejectCallFuncs = [] // 状态成为reject时的回调
    // ...
}
```

`then`方法调用时，如果Promise内部状态为pending，则将传入的回调缓存起来。
```js
myPromise.prototype.then = function(onFulfilled, onRejected) {
    if(this.state === 'pending') {
        if(typeof onFulfilled === 'function') {
            this.resolveCallFuncs.push(onFulfilled)
        }
        if(typeof onRejected === 'function') {
            this.rejectCallFuncs.push(onRejected)
        }
    }
    // ....
}
```

当内部状态改变时，调用回调函数
```js
function resolve(value) {
    if(that.state === 'pending') {
        that.state = 'resolved'
        that.value = value
        that.resolveCallFuncs.forEach((fn) => fn(value))
    }
}

function reject(reson) {
    if(that.state === 'pending') {
        that.state = 'rejected'
        that.reson = reson
        that.rejectCallFuncs.forEach((fn) => fn(reson))
    }
}
```


## then方法的链式调用
Promise最强大的地方在于它的链式调用，同时也是最难实现的地方。

Promises/A+规范对链式调用有明确的定义，可以去看原文规范。这里只记录一下我对规范的理解。

何为链式调用，链式调用就是可以连续调用then方法。如下：
```js
let a = new myPromise((resove, reject) => resolve(1))
a.then().then().then()
```

链式调用具有值传递的特性，即onFulfilled或onReject方法的返回值会向下传递：

以onFulFilled回调为例  
1. `onFulfilled`返回普通类型的值，直接向下传递该值
```js
let p = new Promise((resolve, reject) => { resolve(1) })

p
.then((data) => { return 'hello' })
.then((data) => {
    console.log(data) // hello
})
```

2. `onFulfilled`没有返回值，向下传递`undefined`
```js
let p = new Promise((resolve, reject) => { resolve(1) })

p
.then((data) => {
    // 没有return语句
})
.then((data) => {
    console.log(data)  // undefined
})
```

3. `onFulfilled`返回Promise，向下传递该Promise的状态改变后的结果
```js
let p = new Promise((resolve, reject) => { resolve(1) })

p
.then((data) => {
    return new Promise((resolve, reject) => { 
        setTimeout(() => {
            resolve('hello')
        }, 1000)
    })
})
.then((data) => {
    console.log(data)  // 一秒后输出hello
})
```

4. then方法没有传入任何回调，会从上往下透传
```js
let p = new Promise((resolve, reject) => { resolve(1) })

p
.then()
.then()
.then((data) => {
    console.log(data) // 1
})
```


## 实现then方法的链式调用
为了实现链式调用，需要每个`then`方法都返回一个全新的Promise对象
```js
myPromise.prototype.then = function(onFulfilled, onRejected) {
    // ... 省略部分代码
    let promise2 = new Promise((resolve, reject) => {
        // ...
    })  
    return promise2
}
```

实现链式调用值传递的特性主要有两步：
1. 拿到then中回调方法的执行结果
2. 将该执行结果作为当前promise2内部的执行结果传递出去，即`resolve(执行结果)`或`reject(执行结果)`。这一块的逻辑比较复杂，我们将它单独抽离成一个方法`resolvePromise`

以`onFulfilled`回调为例
```js
myPromise.prototype.then = function(onFulfilled, onRejected) {
    // ... 省略部分代码
    let promise2 = new Promise((resolve, reject) => {
        // ...
        let x = onFulfilled(value)
        resolvePromise(promise2, x, resolve, reject)
    })  
    /**
     * 解析当前传入的onFulfilled的执行结果并resolve（或reject）传入的promise
     * @ { Object } promise 当前创建的promise2
     * @ { * } x onFulfilled的执行结果
     * @ { Function } resolve promise2的resolve
     * @ { Function } reject promise2的reject
     */
    function resolvePromise(promise, x, resolve, reject) {
        // ...
    }    
    return promise2
}

```

`resolvePromise`的实现如下：
```js
/**
 * 解析当前传入的onFulfilled的执行结果并resolve（或reject）传入的promise2
 * @ { Object } promise 当前创建的promise2
 * @ { * } x onFulfilled的执行结果
 * @ { Function } resolve promise2的resolve
 * @ { Function } reject promise2的reject
 */
function resolvePromise(promise, x, resolve, reject) {
    if(promise === x && x !== undefined) {
        reject(new TypeError('Promise循环引用'))
    }
    if(typeof x !== 'null' && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then
            then.call(
                x, 
                (value) => {
                    // 若value任是一个promise，则继续执行下去
                    // 将最深层的promise执行结果作为promise2执行成功的结果
                    resolvePromise(promise, value, resolve, reject)
                }, 
                (reson) => reject(reson)
            )
        } catch (error) {
            reject(error)
        }
    } else {
        // onFulfilled返回值不是promise
        resolve(x)
    }
}
```
* promise2和x不能指向同一个对象，会造成循环引用。
* 当x的为普通类型时，则resolve promise2，将onFulfilled的结果传递到promise2的then的回调中。
* 当x的类型为对象或函数时，则x可以认为是一个Promise对象或者Promise构造函数，调用x的then方法，将x的执行结果传入promise2的resolve和reject


为什么promise2和x的指向不能相同？   
这里十分晦涩。试想一下，如果它们的指向相同，则promise2的then会再次调用，然后会生成一个新的promise，这个新的promise为pending状态，它的actuator函数只是注册回调操作，然后整个整体的then结束。从头至尾，最开始的promise2永远无法resolve或reject。



为什么要递归调用resolvePromise？   
是为了处理一种极端的情况。当onFulfilled方法返回的Promise对象转为成功态或失败态时，传入的还是一个promise。这种情况下，应该继续执行下去，将最里层的执行结果传递到最开始的promise2的resolve。
```js
let p = new Promise((resolve, reject) => {
    resolve(1)
})
p.then(() => {
    return new Promsie((resolve) => {
        resolve(new Promise((resolve) => {
            resolve(2)
        }))
    })
})
```




## 最后的最后
写完上述过程，其实已经几乎完成了。还有一点就是Prmose/A+规范规定then方法是异步的，而上述then方法的代码是同步代码，我们只要在then方法的所有执行处使用setTimeout变为异步代码就行。
```js
setTimeout(() => {
    try {
        let x = onFulfilled(value);
        resolvePromise(promise2, x, resolve, reject);
    } catch (e) {
        reject(e);
    }    
}, 0)
```

然后我们可以使用开源社区提供的npm模块（promises-aplus-tests）测试我们的代码是否真的符合规则。



# 感想
经过这么多努力后，就真的完完全全掌握了promise吗？你没有想过为什么then方法里面的代码必须要求异步？如果你仔细深究下去，这其中又会引申至js的`Event loop`、**宏任务**、**微任务**、**js Engine**、**js runtime**。所以学习是一个递进的过程，学得越多，就越有敬畏之心。


```js
let cache = null;
function getValue() {
      if(cache) {
           return Promise.resolve(cache);  // 存在cache，这里为同步调用
      }
     return fetch('/api/xxx').then(r => cache = r); // 这里为异步调用
}
console.log('before getValue');
getValue.then(() => console.log('getValue'));
console.log('after getValue');

```
假设then方法里面是同步代码  
如果有缓存cache，打印：  
before getValue  
getValue  
after getValue  

// 如果没有缓存cache，打印：    
before getValue  
after getValue  
getValue   

then方法内部的调用处于黑盒中，这种不确定性很不友好，不利于编码，所有要统一设置成异步，让程序员知道执行顺序。



# 附最终代码
```js
function myPromise(actuator) {
    this.state = 'pending'
    this.value = undefined
    this.reson = undefined
    this.resolveCallFuncs = []
    this.rejectCallFuncs = []

    const that = this

    function resolve(value) {
        if(that.state === 'pending') {
            that.state = 'resolved'
            that.value = value
            that.resolveCallFuncs.forEach((fn) => fn(value))
        }
    }

    function reject(reson) {
        if(that.state === 'pending') {
            that.state = 'rejected'
            that.reson = reson
            that.rejectCallFuncs.forEach((fn) => fn(reson))
        }
    }

    try {
        actuator(resolve, reject)
    } catch (error) {
        reject(error)
    }
}

// 简易版的then方法
// myPromise.prototype.then = function(onFulfilled, onRejected) {
//     if(this.state === 'pending') {
//         if(typeof onFulfilled === 'function') {
//             this.resolveCallFuncs.push(onFulfilled)
//         }
//         if(typeof onRejected === 'function') {
//             this.rejectCallFuncs.push(onRejected)
//         }
//     }
//     if(this.state === 'resolved') {
//         if(typeof onFulfilled === 'function') {
//             onFulfilled(this.value)
//         }
//     }
//     if(this.state === 'rejected') {
//         if(typeof onRejected === 'function') {
//             onRejected(this.reson) 
//         }
//     }
// }


// 实现链式调用的then方法
myPromise.prototype.then = function(onFulfilled, onRejected) {
    let promise2 
    let that = this
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function(val) { return val }
    onRejected = typeof onRejected === 'function' ? onRejected : function(err) { throw err } 

    if(that.state === 'pending') {
        promise2 = new myPromise((resolve, reject) => {
            that.resolveCallFuncs.push(function() {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(that.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0)
            })
        })
    }

    if(that.state === 'resolved') {
        promise2 = new myPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onFulfilled(that.value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (error) {
                    reject(error)
                }
            }, 0)
        })
    }

    if(that.state === 'rejected') {
        promise2 = new myPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onRejected(that.reson)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (error) {
                    reject(error)
                }
            }, 0)
        })  
    }

    /**
     * 解析当前传入的onFulfilled的执行结果并resolve（或reject）传入的promise
     * @ { Object } promise 当前创建的promise2
     * @ { * } x onFulfilled的执行结果
     * @ { Function } resolve promise2的resolve
     * @ { Function } reject promise2的reject
     */
    function resolvePromise(promise, x, resolve, reject) {
        if(promise === x && x !== undefined) {
            reject(new TypeError('Promise循环引用'))
        }
        if(typeof x !== 'null' && (typeof x === 'object' || typeof x === 'function')) {
            try {
                let then = x.then
                then.call(
                    x, 
                    (value) => {
                        // 若value任是一个promise，则继续执行下去
                        // 将最深层的promise执行结果作为promise2执行成功的结果
                        resolvePromise(promise, value, resolve, reject)
                    }, 
                    (reson) => reject(reson)
                )
            } catch (error) {
                reject(error)
            }
        } else {
            // onFulfilled返回值不是promise
            resolve(x)
        }
    }

    return promise2
}

```

```js
// 透传测试
let a = new myPromise((resolve) => {
    resolve(1)
})

// 无返回值
a
.then()
.then()
.then((data) => {
    console.log(data) // 1
})

// 有返回值
a
.then(() => { 
    return 'hello' 
})
.then((data) => { 
    console.log(data)  // 'hello'
}) 

// 返回值为promise
a.then(() => {
    return new myPromise((resolve) => { 
        setTimeout(() => { resolve('hello') }, 1000) 
    })
}).then((data) => {
    console.log(data) // hello
})

// 返回值为promise且resolve的也是一个promise
a.then(() => {
    return new myPromise((resolve) => { 
        resolve(new myPromise((resolve) => { resolve('hello') }))
    })
}).then((data) => {
    console.log(data) // hello
}) 
 
```



# 知识链接
[一起来手写一个合乎规范的Promise](https://www.jianshu.com/p/c633a22f9e8c)  
[Promises/A+规范（英文）](https://promisesaplus.com/)  
[Promises/A+规范（中文）](https://m.ituring.com.cn/article/66566)  
[promise的中then的执行为什么是异步的](https://www.zhihu.com/question/57071244)  
[JavaScript 中的异步：Event Loop 及其他](https://zhuanlan.zhihu.com/p/22710155)  
[参考博客](https://www.cnblogs.com/XieJunBao/p/9156134.html)  
[测试是否符合Promises/A+规范](https://github.com/promises-aplus/promises-tests)