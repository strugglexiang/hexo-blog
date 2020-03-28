---
title: Node.js初识
date: 2020-03-18 14:29:24
categories: Node.js
tags:
---


# Node.js初识
Node.js因后端简化并发编程而受关注，因作为前端辅助开发工具而流行，因异步流程控制和回调地狱而受人诟病，因npm批量安装模块而被人敬仰和敬畏。

<!-- more -->


# 什么是Node.js
Node.js是基于Chorme V8引擎而构建的JavaScript运行时。

* Node.js不是编程语言（JavaScript是编程语言），也不是某种语言的框架（如Js的React、PHP的Laravel），更不是类似ngixn这样的web服务器。Node.js是JavaScript的运行时环境。
* Node.js构建于Chorme V8这个JavaScirpt引擎之上。Chorme V8引擎是通过c/c++编写的，相当于是将Javascript转换为更偏向底层的C或C++代码后再执行，通过JavaScript的这层包装，大大降低了偏底层语言的学习成本。
* Node.js结合libuv扩展了JS的功能，使得JS除了具有操作浏览器DOM的能力，还有了一般后端语言才具有的I/O、文件读写、操作数据库等能力。
* Node.js是轻量和高效的，每个函数都是同步的，而I/O操作是异步的。所有由JS编写的函数的I/O都将由libuv（由c/c++编写）事件循环处理库来处理，隐藏了非阻塞I/O的具体细节，简化了编程模型，可以轻松编写高性能的web应用。


Node.js的架构模式如下图：

![node](https://source.strugglexiang.xyz/node.png)

Chrome V8 引擎负责解释并执行JS代码。Libuv由事件循环和线程池组成，负责分发和执行i/o任务。

JS是单线程的，也就意味着任务需要排队，一个任务执行前需等待前面的任务执行完成。

一般情况下，cpu时闲着的，其实cpu完全可以不管i/o设备而直接挂起处于等待中任务，先执行后面的任务。

将处于等待的任务放到事件循环中，事件循环由libuv提供。事件循环负责将i/o任务放入线程池中。

线程池也由libuv提供，它负责将**文件io任务**放入线程池中执行（网络io任务不通过线程池完成）。然后事件循环只需要等待执行结果就行。 

总之，只要cpu有资源，就要全力执行。

Node Bindings层负责将V8引擎暴漏的c/c++接口封装成Javascript API。结合这些JS API编写成最顶层的Node.js标准库。这些API被统称为Node.js JDK。

而我们的日常编程就是利用Node.js标准库代码来编写应用程序。


# Node.js的特点
总的来说就是一句话：适合构建web应用、高性能、简单、可扩展。

## 高性能
Node.js高性能是指以下几点：
1. 执行速度快，JS执行于V8引擎比较快。
2. 天生异步：事件循环和非阻塞io的特性决定了Node.js必须使用异步机制,线程池中的每个io任务都是异步的。
3. 适用于i/o密集型的网络应用，因为网络应用开发（包括web应用开发）的瓶颈在于i/o处理，即大部分情况是CPU在等I/O（硬盘/内存的读写操作) 。


# 知识
[程序员该如何理解io](https://www.jianshu.com/p/fa7bdc4f3de7)

[什么是CPU密集型和IO密集型](https://www.cnblogs.com/aspirant/p/11441353.html)