# 利用scroll
原理：  
父级设置固定宽度（或高度），子级的宽度（或高度）超过父级使父级出现滚动条，控制父级的scrollLeft（或scrollTop)使滚动条移动，当子级滚动完后将scrollLeft（或scrollTop）重置为0，实现循环。

注意点：  
1. 当scrollLeft >= 子级宽度时，子级才完全滚出父级。为保证scrollLeft能够达到此条件，子级的宽度 >= 自身循环内容 + 父级宽度
2. offsetWidth = border + padding + 宽度 + scrollbar
3. clientWidth = padding + 宽度
4. scrollWidth: 元素内容（包括被隐藏的部分）出现在视口所需的最小宽度。

```
伪代码
1. 父容器定义宽度
2. 子容器定义宽度(>= 父容器宽度 + 子容器循环内容)，使父容器出现滚动条。
3. 定时器设置父容器scrollLeft移动，直至子容器需循环内容完全滚出父容器视口后置0（即scrollLeft = son.offsetWidth）
```

# 利用transition
原理：利用transition过渡 + transform: translate实现动画，过渡时间结束后，重置transform重新移动。

```
伪代码
1. 父级设置固定宽度，相对定位
2. 子级绝对定位到最右侧隐藏(left: 100%)
3. 设置transiton: all 5s linear; transform: translateX(-(父级宽度+子级内容宽度))
4. 定时器重置动画
```

> 更改 offsetTop、offsetLeft、 offsetWidth、offsetHeight；scrollTop、scrollLeft、scrollWidth、scrollHeight；clientTop、clientLeft、clientWidth、clientHeight；getComputedStyle() 、currentStyle（）。这些都会触发回流。回流导致DOM重新渲染，平时要尽可能避免，但这里，为了动画即时生效播放，则主动触发回流，刷新DOM。


# 利用animation
```
伪代码
1. 父级设置固定宽度，相对定位
2. 子级绝对定位到最右侧隐藏(left: 100%)
3. 子级利用animation将left从100%移动到0%，无限循环
```

