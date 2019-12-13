---
title: flex最后一行左对齐的N种方式
date: 2019-08-16 17:03:01
categories: css
tags:
---

# 参考链接
本篇直接参考[张鑫旭博文](https://www.zhangxinxu.com/wordpress/2019/08/css-flex-last-align/ '让CSS flex布局最后一行列表左对齐的N种方法')，建议直接观看原文。


# 问题描述
我们知道，flex布局的`justify: space-between`可以实现子元素的两端对齐，但是当最后一行的列数不够时，最后一列无法实现左对齐，中间会留下大量空白。
<!-- more -->


代码如下:   
css代码
```css
.container {
    width: 800px;
    margin: 20px auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
}
.box {
    width: 180px;
    height: 100px;
    background: skyblue;
    margin-top: 10px;
}
```
html代码
```html
<div class="container">
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
</div>
```

结果如下图：  
![问题点](https://source.strugglexiang.xyz/1565938865.jpg)


以下是**flex最后一行左对齐**的几种解决方案：
1. [列数固定并且子元素宽度固定](#列数固定并且子元素宽度固定)
2. [列数不固定并且子元素宽度不固定](#列数不固定并且子元素宽度不固定)
3. [列数不固定并且子元素宽度固定](#列数不固定并且子元素宽度固定)

# 列数固定并且子元素宽度固定
## 方法一
原理：放弃使用`justify-content: space-between`，使用`margin`来模拟它的间隙。  
代码如下：  
css
```css
.container {
    width: 800px;
    margin: 20px auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.box {
    width: 180px;
    height: 100px;
    background: skyblue;
    margin-top: 10px;
}
/* 假设4列 */
.box:not(:nth-child(4n)) {
    margin-right: calc((100% - 180px *4) / 4)
}
```

```html
<div class="container">
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
</div>
```
[戳这里看演示](http://effects.strugglexiang.xyz/other/flex最后一行左对齐/列数固定并且子元素宽度固定-1.html)


## 方法二
原理：使用`justify-content: space-between`，给最后一列的最后一个元素设置计算好的`margin`，使得最后一列的可分配空间变小。
代码如下：   
css
```css
.container {
    width: 800px;
    margin: 20px auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
}
.box {
    width: 180px;
    height: 100px;
    background: skyblue;
    margin-top: 10px;
}
/* 假设4列 */
/* 需计算最后一列有3个或2个子元素的情况 */
.box:last-child:nth-child(4n-1) {
    margin-right: calc(180px + (100% - 180px * 4) / 3);
}
.box:last-child:nth-child(4n-2) {
    margin-right: calc(180px * 2 + (100% - 180px * 4) / 3 * 2);
}
```

html
```html
<div class="container">
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
</div>
```
[戳这里看演示](http://effects.strugglexiang.xyz/other/flex最后一行左对齐/列数固定并且子元素宽度固定-2.html)




# 列数不固定并且子元素宽度不固定
由于列数和子元素宽度都是不确定的，就只要控制最后一列左对齐就行了。    

##  方法一
原理： 最后一个子元素设置`margin-right: auto`，代码如下：   
css
```css
.container {
    border: 1px solid #ddd;
    margin: 20px auto;
    max-width: 720px;
    max-height: 400px;
    overflow: auto;
    resize: horizontal;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
}
.box {
    height: 100px;
    background: skyblue;
    margin: 10px;
}
.box:last-child {
    margin-right: auto;
}
.size1 {
    width: 157px;
}
.size2 {
    width: 200px;
}
.size3 {
    width: 123px;
}
.size4 {
    width: 350px;
}
```

html
```html
<div class="container">
    <div class="box size1"></div>
    <div class="box size4"></div>
    <div class="box size2"></div>
    <div class="box size1"></div>
    <div class="box size3"></div>
    <div class="box size1"></div>
    <div class="box size2"></div>
    <div class="box size1"></div>
</div>
```
[戳这里看演示](http://effects.strugglexiang.xyz/other/flex最后一行左对齐/列数不固定并且子元素宽度不固定-1.html)   

**注意**：`box`的外边距为10，使得非最后一列的两个子元素间的最小间距是20。同时最后一列的元素间距只能为20。

##  方法二
原理：在父级容器设置伪元素`::after`，设置伪元素`flex: 1;`让其撑满最后一列的剩余宽度。代码如下：

css: 
```css
.container {
        border: 1px solid #ddd;
        margin: 20px auto;
        max-width: 720px;
        max-height: 400px;
        overflow: auto;
        resize: horizontal;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .container::after {
        content: '';
        flex: auto;/* 或flex:1 */
    }
    .box {
        height: 100px;
        background: skyblue;
        margin: 10px;
    }
    .size1 {
        width: 157px;
    }
    .size2 {
        width: 200px;
    }
    .size3 {
        width: 123px;
    }
    .size4 {
        width: 350px;
    }
```

html
```html
<div class="container">
    <div class="box size1"></div>
    <div class="box size4"></div>
    <div class="box size2"></div>
    <div class="box size1"></div>
    <div class="box size3"></div>
    <div class="box size1"></div>
    <div class="box size2"></div>
    <div class="box size1"></div>
</div>
```

[戳这里看演示](http://effects.strugglexiang.xyz/other/flex最后一行左对齐/列数不固定并且子元素宽度不固定-2.html)   
**注意**：`box`的外边距为10，使得非最后一列的两个子元素间的最小间距是20。同时最后一列的元素间距只能为20。

# 列数不固定并且子元素宽度固定
原理：使用足够的空白标签来占据最后一列的位置，这个空白标签的宽度和子元素宽度一致，高度为0。由于空白标签的高度为0，就不会影响到
其他元素的垂直布局。

css
```css
.container {
    max-width: 800px;
    max-height: 600px;
    border: 1px solid #ddd;
    overflow: auto;
    resize: horizontal;
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
}
.box {
    margin-top: 10px;
    width: 180px;
    height: 100px;
    background: skyblue;
}
/* 空白标签 */
.fill_space {
    width: 180px;
}
```

[戳这里看演示](http://effects.strugglexiang.xyz/other/flex最后一行左对齐/列数不固定并且子元素宽度固定.html)


