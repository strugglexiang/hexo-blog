---
title: vite入门初识
date: 2022-01-01 22:43:30
categories: 前端工程化
tags:
---

本篇是本人Vite入门学习记录，本篇文章使用的Vite1.0版本。
<!-- more -->

# 简介
Vite是一个前端项目初始化构建工具，它和Vue-cli脚手架的作用基本相同，可以看做Vue-cli的升级版本，主要用于构建Vue项目。

Vite提供的是开发环境的编译功能，打包依赖于`Rollup`（JS模块打包器）。

Vite的特点：
1. 冷服务启动，即在开发预览中，不进行打包，直接使用ES6的模块（Vue-cli开发预览时是需要先打包的）
2. 开发时支持热更新
3. 按需编译，代码变动时，不会全部刷新DOM节点。


# Vite构建项目
Vite构建项目有两种方式：
1. npm构建
2. yarn构建


## npm构建
使用`npm inti vite-app <project-name>`来构建一个简单工程。
```
npm init vite-app myVuedemo1
```

然后使用`npm install`安装模块，`npm run dev`运行项目。


## yarn构建
使用`yarn create vite-app <project-name>`构建一个简单工程。
```
yarn create vite-app myVuedemo2
```

然后使用`yarn`安装模块，`yarn dev`运行项目

`yarn`命令安装模块时可能会报错
```
error vite@1.0.0-rc.13: The engine "node" is incompatible with this module. Expected version ">=10.16.0". Got "10.15.1
```
意思是：vite@1.0.0-rc.13：引擎“节点”与此模块不兼容。预期node版本“>=10.16.0”，现在是“10.15.0”。就是vite的版本和node版本不兼容，解决办法是：更改node版本或者忽略
```
npm更新语句
npm install npm@latest -g

忽略语句
yarn config set ignore-engines true
```
<!-- https://blog.csdn.net/yuxielea/article/details/98481211 -->


# Vite对TypeScript、CSS和JSON的支持
Vite对TS，css文件引入和JSON文件引入的支持度很高，以下写法都可以成功
<script lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import './assets/init.css' // 支持直接引入css文件
import data from './assets/my.json'

const name: String = 'st' // 支持TS


export default {
  name: 'App',
  components: {
    HelloWorld
  },
  mounted() {
    console.log(name);
    console.log(data.name);
  }
}
</script>

后面是支持的具体部分解释。

## Vite项目中如何使用TypeScript
在Vue文件中的JS标签上加入`lang="ts"`就行了
```
<script lang="ts">
//....any
</script>
```

## Vite支持CSS直接引入
在Vue文件中JS标签内直接引入CSS文件
```
<script lang="ts">
import './assets/app.css'
</script>
```

## Vite支持JSON文件直接引入
在Vue文件中JS标签内直接引入JSON文件
```
<script lang="ts">
import data from './assets/my.json'
</script>
```

# Vite对于SASS和JSX的支持
## Vite对于SASS的支持
SASS是CSS预处理语言。

首先需要在文件目录安装SASS模块
```
npm i -D sass
```

然后在Vue文件CSS标签下使用
```
<template>
  <h1 class="name">st</h1>
</template>
```

```
<style lang="scss">
$nameColor: green;
.name {
  color: $nameColor;
}
</style>

```

## Vite对于JSX的支持
JSX是JS的扩展语法，表示框架中的元素。Vite构建的Vue项目中，支持JSX文件的使用和引入。

在src目录下创建如下App.jsx文件
```
function App() {
    return (
        <>
            <h1>my name is st</h1>
            <Child/>
        </>
    )
}

function Child() {
    return (
        <h1>I'm 18 years old!</h1>
    )
}

export default App
```
然后再main.js中使用JSX文件
```
import { createApp } from 'vue'
// import App from './App.vue'
import './index.css'

import App from './App.jsx'

createApp(App).mount('#app')

```


# Vite生成的文件目录结构
如上使用`npm init vite-app <project-name>`或`yarn create vite-app <project-name>`构建的项目文件目录结构如下：
```
|-node_modules      -- 项目依赖包的目录
|-public            -- 项目公用文件
  |--favicon.ico    -- 网站地址栏前面的小图标
|-src               -- 源文件目录，程序员主要工作的地方
  |-assets          -- 静态文件目录，图片图标，比如网站logo
  |-components      -- Vue3.x的自定义组件目录
  |--App.vue        -- 项目的根组件，单页应用都需要的
  |--index.css      -- 一般项目的通用CSS样式写在这里，main.js引入
  |--main.js        -- 项目入口文件，SPA单页应用都需要入口文件
|--.gitignore       -- git的管理配置文件，设置那些目录或文件不管理
|-- index.html      -- 项目的默认首页，Vue的组件需要挂载到这个文件上
|-- package-lock.json --项目包的锁定文件，用于防止包版本不一样导致的错误
|-- package.json    -- 项目配置文件，包管理、项目名称、版本和命令
```

# 参考
[Vite中文网](https://vitejs.cn/)

[技术胖Vite 入门视频图文教程](https://jspang.com/article/66#toc0)