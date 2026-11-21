"use strict";
(function () {
    /**
     * hover效果通用初始化方法
     * 不同树级的元素需要hover效果使用,
     * 移入hover触发者和hover层,给hover层添加.show样式类.移出时去掉
     * show一般为{display:block;animation...}
     * 在display:none时,transition动画不生效,建议改为animation作为进入动画
     * @param hoverFrom 触发hover层的选择器
     * @param hoverLayer 被触发的hover层选择器
     * @param hoverFuncBack hover时的回调函数,选填
     * **/
    var T_hoverShowInit = function (hoverFrom, hoverLayer, hoverFuncBack, showDelay) {
        var hover$ = $(hoverLayer);
        var timeout;
        var showTimeout;
        var showDelay = showDelay || 0;
        $(hoverFrom + ',' + hoverLayer)
        .on('mouseenter', function (e) {
            e.preventDefault();
            e.stopPropagation();
            //移入hover层和hover触发者
            clearTimeout(timeout);
            clearTimeout(showTimeout);
            showTimeout = setTimeout(function () {
                if (!hover$.hasClass('show')) {
                    hover$.addClass('show');
                    hoverFuncBack && hoverFuncBack();
                }
            }, showDelay);
        })
        .on('mouseleave', function (e) {
            e.preventDefault();
            e.stopPropagation();
            //移出hover层和hover触发者,因为元素间隔和子元素的原因,可能会频发触发out,所以使用延迟避免闪烁
            clearTimeout(timeout);
            clearTimeout(showTimeout);
            timeout = setTimeout(function () {
                hover$.removeClass('show');
            }, 100);
        });
    };



    /** 顶部hover控制 **/
    var TopHoverControl = {
        init: function () {
            //初始化导航hover
            T_hoverShowInit('.nav-menu', '.nav-big-menu-listbox', false, 300);
        }
    };

    // 初始化入口
    var TopModulejs = {
        init: function () {
            TopHoverControl.init();
        }
    };

    TopModulejs.init()
})()
