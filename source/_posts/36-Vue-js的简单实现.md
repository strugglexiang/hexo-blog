---
title: Vue.js的简单实现
date: 2022-01-09 16:45:38
categories: JavaScript
tags:
---

在Vue.js的2.x版本中，响应式原理的核心是数据劫持和依赖收集，通过`Object.defineProperty`方法实现对数据存取的拦截，这一步的实现我们称之为数据代理；同时，通过对get方法进行拦截，可以获取到数据的依赖，并将依赖收集到一个集合中，当数据发生变更时，收集到的依赖将对视图进行更新。

Vue.js的3.0版本，响应式原理的核心思想不变，将用`Proxy`替换`Object.defineProperty`实现数据代理。

本篇基于Vue 2.x的核心思想来实现一个简化版的Vue.js。

<!-- more -->

# Vue类
Vue类用于构建Vue组件实例，并对实例的data数据进行响应式处理
```js
class Vue {
    constructor(option) {
        this.$el = option.el;
        this._data = option.data;
        this.$data = this._data;
        
        // 构造Vue类时对数据进行响应式处理
        new Observe(this._data)
    }
}
```
上面的代码中我们构建了一个Vue类，代码很容易理解，构造函数和我们平时使用Vue的方式保持一致，`Observe`类将其中传入的`option.data`需要进行响应式处理。

# Observe类
在Observe类中，通过`Object.defineProperty`方法实现对传入数据的拦截
```js
class Observe {
    constructor(objData) {
        if(typeof objData === 'object') {
            this.walk(objData)
        }
    }

    walk(objData) {
        let keys = Object.keys(objData);
        
        for(let key of keys) {
            this.defineReactive(objData, key)
        }
    }

    defineReactive(objData, key) {
        // value值为对象类型 递归调用walk方法进行响应式处理
        if(typeof objData[key] === 'object') {
            this.walk(objData[key]);
        }
        
        let keyValue = objData[key];
        let dep = new Dep(); // 本属性的依赖集合 get方法触发时进行收集
        Object.defineProperty(objData, key, {
            enumerable: true,
            configurable: true,
            get() {
                if(Dep.target) {
                    dep.addSub(Dep.target);
                }

                return keyValue;                        
            },
            set(newVal) {
                // set方法执行 本属性的依赖对数据的变更进行响应
                dep.nofity(newVal);

                keyValue = newVal;
            }
        })
    }
}
```
`walk`方法遍历传入的对象数据，调用`defineReactive`方法自定义每个属性的`get`和`set`，如果属性的value值为对象，则继续递归进行响应式处理。`defineReactive`方法中使用到`Dep`类，当属性的get方法触发时，`Dep`类将对该属性的依赖（既后面watcher对象）进行收集，set方法触发时，`Dep`类中的依赖将对视图进行更新。

# Dep类
Dep类将对属性的依赖（watcher对象）进行集中管理。
```js
// dep类 
// 属性的依赖集合
class Dep {
    static target = null;

    constructor() {
        this.subs = [];
    }

    addSub(watcher) {
        this.subs.push(watcher);
    }

    nofity(newVal) {
        this.subs.forEach(watcher => {
            watcher.update(newVal);
        })
    }
}
```


# watcher类
观察者类，它的实例对象将作为属性的依赖，数据更新时，watcher对象执行内部自定义逻辑（在Vue中多为操作dom，进行视图更新）
```js
let uid = 0;
class watcher {
    // vm => vue实例  
    // key => vm实例中响应式属性 
    // cb => 数据变更后进行的回调 一般是dom更新
    constructor(vm, key, cb) {
        this.uid = ++uid;
        this.vm = vm;
        this.cb = cb;

        // 这一步触发 属性的自定义get方法 将本watcher注入到依赖中
        Dep.target = this;
        this.value = vm.$data[key];

        // 成功注册中清空Dep.target
        Dep.target = null;
    }

    update(newVal) {
        // 数据更新后才进行响应 
        if(newVal !== this.value) {
            this.value = newVal;
            this.run();
        }
    }

    run() {
        this.cb(this.value); // cb方法中进行dom操作，视图更新
    }
}

```
watcher类构造函数调用时，将会触发响应式属性的get方法，此时将watcher实例作为属性的依赖注入到了属性的`dep`依赖中。属性的set方法触发时，`dep`对象会统一执行所有依赖的`run`方法。

至此，一个最简单版Vue已经构建完成。以下是简单使用：
```js
let data = {
    name: 'st',
    age: 18
}
let app = new Vue({
    data
});

new watcher(app, 'name', (newVal) => {
    console.log(`属性name赋值为${newVal}`)
})


// 数据的变更 执行watcher传入的回调
data.name = 1; // 属性name赋值为1
data.name = 2; // 属性name赋值为2

```


但是此时，上述实现有个致命的问题：当我们对某项数据进行频繁的更新时会有很严重的性能问题，比如以下代码：
```js
new watcher(app, 'name', (newVal) => {
    for(let i = 0; i++; i < 100) {
        console.log(i)
    }
})

```
此时watcher的回调内部将输出100个数字，其对应的就是100次dom更新操作。对于框架来说，这种缺陷肯定是不能容忍的，因此Vue内部引入了`nextTick`机制来优化这个问题。


# nextTick
关于nextTick，Vue官方的说明的这样的：**在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM**。

这里涉及到了一个新的概念**异步更新**，也久说Vue的视图更新是异步的，每次数据变化之后不是立刻去执行DOM更新，而是将数据的变化缓存起来，在合适的时间统一执行一次dom更新操作。那么，这个**合适的时间**久显得尤为重要。


我们知道，浏览器种eventloop的循环顺序是这样的:
> 宏任务
>
> 本地宏任务产生的所有微任务
>
> 视图更新
> 
> 宏任务

很容易想到，我们可以利用eventloop实现**异步更新**，因为每次事件循环之间都有视图渲染，我们可以把dom的更新操作统一放在每次视图更新前，这样就有了一个统一的视图更新的时间点。同时，为了避免无效的dom操作，还需要将数据的变化缓存起来，只保留最后一次数据变更的结果。


为了实现异步更新，首先需要更改watcher的update方法，在update方法种不能直接进行视图更新，而是把数据变化后的watcher放入一个更新队列中，本地事件循环结束时将更新队列中的watcher出队并执行更新。
```js
class watcher {
    update(newVal) {
        // 数据更新后才进行响应 
        if(newVal !== this.value) {
            this.value = newVal;
            // this.run();
            updateQueue.push(this);
        }
    }
}
```
上面的代码我们把变更了的Watcher添加到更新队列updateQueque中，用于后续的更新，下面我们编写一个清空更新队列并依次执行更新的函数。
```js
flushUpdateQueue() {
    while(updateQueue.length) {
        updateQueue.shift().run();
    }
}
```
现在我们有了一个处理更新队列的函数，但是现在还缺少一个很重要的元素，就是执行此函数的时机，这时我们回忆一下我们的更新队列是异步更新队列，这里的异步即使用setTimeout或者Promise实现异步更新，这个就是`nextTick`的实现过程。
```js
let callbacks = []; // 事件队列 包括异步更新队列和vue手动添加的队列
let pedding = false; // 控制变量 确保一次eventloop值执行一次flushCallbacks
function nextTick(cb) {
    callbacks.push(cb);
    if(!pedding) {
        pedding = true;
        if(Promise) {
            Promise.resolve().then(() => {
                flushCallbacks()
            })
        } else {
            setTimeout(() => {
                flushCallbacks()
            }, 0)
        }
    } 
}

// 清空异步队列
function flushCallbacks() {
    while(callbacks.length) {
        callbacks.shift();
    }
    pedding = false;
}
```
主要做了两件事，创建callbacks数组作为保存事件的队列，我们每次调用nextTick函数就往callbacks事件队列中入队一个事件，然后我们在setTimeout或者Promise.then创建的异步事件中，通过flushCallbacks将异步队列中的函数一次出队并执行。

把上述代码集成到Vue中：
```js
class Vue {
    constructor(option) {
        this.$el = option.el;
        this._data = option.data;
        this.$data = this._data;
        
        // 构造Vue类时对数据进行响应式处理
        new Observe(this._data)

        // 异步更新机制
        this.callbacks = []; // 事件队列 包括异步更新队列和vue手动添加的队列
        this.updateQueue = []; // 异步更新队列
        this.pedding = false; // 控制变量 确保一次eventloop值执行一次flushCallbacks
        this.waiting = false; // 控制变量 确保一次eventloop只向callbacks添加一次flushUpdateQueue（也就是dom更新）
        this.hash = {}; // 控制变量 确保updateQueue中的watcher唯一
        this.$nextTick = this.nextTick;
    }

    nextTick(cb) {
        this.callbacks.push(cb);
        if(!this.pedding) {
            this.pedding = true;
            if(Promise) {
                Promise.resolve().then(() => {
                    this.flushCallbacks.call(this)
                })
            } else {
                setTimeout(() => {
                    this.flushCallbacks.call(this)
                }, 0)
            }
        }
        
    }

    // 清空异步队列
    flushCallbacks() {
        while(this.callbacks.length) {
            this.callbacks.shift().call(this);
        }
        this.pedding = false;
    }

    // 清空更新队列 更新视图
    flushUpdateQueue() {
        while(this.updateQueue.length) {
            this.updateQueue.shift().run();
        }
        this.hash = {};
    }
}
```

对watcher进一步优化：
```js
class watcher {
    update(newVal) {
        // 数据更新后才进行响应 
        if(newVal !== this.value) {
            this.value = newVal;
            // this.run();
            
            // 控制变量 确保一次eventloop只向callbacks添加一次flushUpdateQueue（也就是dom更新）
            if(!this.vm.waiting) {
                this.vm.$nextTick(this.vm.flushUpdateQueue)
                this.vm.waiting = true;
            }

            // 控制变量 确保updateQueue中的watcher唯一
            if(!this.vm.hash[this.uid]) {
                this.vm.hash[this.uid] = true;
                this.vm.updateQueue.push(this);
            }
        }
    }
}

```
观察上面的代码我们发现，update方法不再立即执行更新，得是把变更通过nextTick缓存到updateQueue队列中，这个队列保存了本次事件循环期间发生了变更的Watcher。

最终异步更新完成，检测代码如下：
```js
// 测试数据
let data = {
    name: 'st',
    age: 18
}
let app = new Vue({
    data
});

new watcher(app, 'name', (newVal) => {
    console.log(newVal)
})

data.name = 1; // 数据一旦更新 会为nextTick事件队列添加flushUpdateQueue回调函数
data.name = 2;
app.$nextTick(() => {
    console.log('dom更新'); // 主动添加的回调函数会在dom更新后执行
})
data.name = 3; // name的变更会push到updateQueue中，因为push的是whatch实例，所以只会保留最后一次变更


// 3
// dom更新
```





# 附源码
```js
// Vue类 
// 用于创建Vue实例
class Vue {
    constructor(option) {
        this.$el = option.el;
        this._data = option.data;
        this.$data = this._data;
        
        // 构造Vue类时对数据进行响应式处理
        new Observe(this._data)

        // 异步更新机制
        this.callbacks = []; // 事件队列 包括异步更新队列和vue手动添加的队列
        this.updateQueue = []; // 异步更新队列
        this.pedding = false; // 控制变量 确保一次eventloop值执行一次flushCallbacks
        this.waiting = false; // 控制变量 确保一次eventloop只向callbacks添加一次flushUpdateQueue（也就是dom更新）
        this.hash = {}; // 控制变量 确保updateQueue中的watcher唯一
        this.$nextTick = this.nextTick;
    }

    nextTick(cb) {
        this.callbacks.push(cb);
        if(!this.pedding) {
            this.pedding = true;
            if(Promise) {
                Promise.resolve().then(() => {
                    this.flushCallbacks.call(this)
                })
            } else {
                setTimeout(() => {
                    this.flushCallbacks.call(this)
                }, 0)
            }
        }
        
    }

    // 清空异步队列
    flushCallbacks() {
        while(this.callbacks.length) {
            this.callbacks.shift().call(this);
        }
        this.pedding = false;
    }

    // 清空更新队列 更新视图
    flushUpdateQueue() {
        while(this.updateQueue.length) {
            this.updateQueue.shift().run();
        }
        this.hash = {};
    }
}


// Observe类
// 对数据进行响应式处理
class Observe {
    constructor(objData) {
        if(typeof objData === 'object') {
            this.walk(objData)
        }
    }

    walk(objData) {
        let keys = Object.keys(objData);
        
        for(let key of keys) {
            this.defineReactive(objData, key)
        }
    }

    defineReactive(objData, key) {
        // value值为对象类型 递归调用walk方法进行响应式处理
        if(typeof objData[key] === 'object') {
            this.walk(objData[key]);
        }
        
        let keyValue = objData[key];
        let dep = new Dep(); // 本属性的依赖集合 get方法触发时进行收集
        Object.defineProperty(objData, key, {
            enumerable: true,
            configurable: true,
            get() {
                if(Dep.target) {
                    dep.addSub(Dep.target);
                }

                return keyValue;                        
            },
            set(newVal) {
                // set方法执行 本属性的依赖对数据的变更进行响应
                dep.nofity(newVal);

                keyValue = newVal;
            }
        })
    }
}

// dep类 
// 属性的依赖集合
class Dep {
    static target = null;

    constructor() {
        this.subs = [];
    }

    addSub(watcher) {
        this.subs.push(watcher);
    }

    nofity(newVal) {
        this.subs.forEach(watcher => {
            watcher.update(newVal);
        })
    }
}

// watcher类
// 具体的某个属性的依赖
let uid = 0;
class watcher {
    // vm => vue实例  
    // key => vm实例中响应式属性 
    // cb => 数据变更后进行的回调 一般是dom更新
    constructor(vm, key, cb) {
        this.uid = ++uid;
        this.vm = vm;
        this.cb = cb;

        // 这一步触发 属性的自定义get方法 将本watcher注入到依赖中
        Dep.target = this;
        this.value = vm.$data[key];

        // 成功注册中清空Dep.target
        Dep.target = null;
    }

    update(newVal) {
        // 数据更新后才进行响应 
        if(newVal !== this.value) {
            this.value = newVal;
            // this.run();

            if(!this.vm.waiting) {
                this.vm.$nextTick(this.vm.flushUpdateQueue)
                this.vm.waiting = true;
            }
            if(!this.vm.hash[this.uid]) {
                this.vm.hash[this.uid] = true;
                this.vm.updateQueue.push(this);
            }
        }
    }

    run() {
        // 
        this.cb(this.value);
    }
}


// 测试数据
let data = {
    name: 'st',
    age: 18
}
let app = new Vue({
    data
});

new watcher(app, 'name', (newVal) => {
    console.log(newVal)
})

data.name = 1; // 数据一旦更新 会为nextTick事件队列添加flushUpdateQueue回调函数
data.name = 2;
app.$nextTick(() => {
    console.log('dom更新'); // 主动添加的回调函数会在dom更新后执行
})
data.name = 3; // name的变更会push到updateQueue中，因为push的是whatch实例，所以只会保留最后一次变更


// 3
// dom更新
```

# 参考
[剖析 Vue.js 内部运行机制](https://juejin.cn/book/6844733705089449991) 

[Vue nextTick彻底理解](https://blog.csdn.net/qq_33718648/article/details/113862569)
