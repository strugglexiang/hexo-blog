// 为网页标题添加崩溃欺骗搞怪特效
(function() {
    var OriginTitle = document.title;
    var titleTime;
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            $('[rel="icon"]').attr('href', "/images/huaji.jpg");
            document.title = '╭(°A°`)╮ 页面崩溃啦 ~';
            clearTimeout(titleTime);
        }
        else {
            $('[rel="icon"]').attr('href', "/images/huaji.jpg");
            document.title = '(ฅ>ω<*ฅ) 噫又好了~' + OriginTitle;
            titleTime = setTimeout(function () {
                document.title = OriginTitle;
            }, 1500);
        }
    });
    
})()