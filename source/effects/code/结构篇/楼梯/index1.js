//---------- 元素出现在视口
function elementInView(element, fn) {
    if(!element.tagName) {
        throw new Error('Element must be a HTML element object')
    }
    if(getComputedStyle(element).display === 'none') {
        return
    }
    const rect = element.getBoundingClientRect()
    const condition1 = rect.top <= window.innerHeight
    const condition2 = rect.bottom >= 0
    if(condition1 && condition2) {
        fn && fn()
    }
}

//---------- 节流
function throttle(fn, dealy) {
    let flag = true
    return function() {
        if(!flag) {
            return 
        }
        flag = false
        dealy = dealy || 2000
        const args = arguments
        setTimeout(function() {
            fn && fn(...args)
            flag = true
        }, dealy)
    }
}


//---------- 元素在文档流中位置
function getElementTop(element) {
    if(!element.tagName) {
        throw new Error('Element must be a HTML element object')
    }
    let offsetParernt = element.offsetParernt
    let top = element.offsetTop
    while(offsetParernt) {
        top += offsetParernt.offsetTop
        offsetParent = offsetParent.offsetParent
    }
    return top
}

//------------- 滚动条滚动到指定位置




(function() {
    const mainArr = Array.from(document.querySelectorAll('.louti'))
    const sideArr = document.querySelectorAll('#loutiNav li span')

    //------ 滚动业务逻辑
    function siderStyle(e) {
        mainArr.forEach((e, index) => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            let top = getElementTop(e)
            if(scrollTop >=  top) {
                sideArr.forEach(sideitem => {
                    sideitem.classList.remove('active')
                })
                sideArr[index].classList.add('active')
            }
        })
    }
    document.addEventListener('scroll', throttle(siderStyle, 200))

    //------ 楼梯点击业务逻辑
    sideArr.forEach((item, index) => {
        item.addEventListener('click', function() {
            let targetTop = getElementTop(mainArr[index])
            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            })
        })
    })
    
})()




