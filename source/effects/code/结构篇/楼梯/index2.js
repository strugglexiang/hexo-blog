$(function () {
    //点击楼层按钮,页面是否正在移动
    var isMoving = false;
    //点击楼层按钮
    $("#loutiNav li").click(function () {
        //改变按钮的选中状态
        $(this).find("span").addClass("active").parent().siblings().find("span").removeClass("active");
        //下标
        var index = $(this).index();
        var top = $(".louti").eq(index).offset().top;
        //$(window).scrollTop(top);
        isMoving = true;
        $("html, body").stop().animate({ scrollTop: top }, 500, function () {
            isMoving = false;
        });
    })
    //scroll
    $(window).scroll(function () {
        if (isMoving == false) {
            var scrollTop = $(window).scrollTop();
            //遍历
            var index = 0;
            $(".louti").each(function () {
                var top = $(this).offset().top;
                if (scrollTop >= top) {
                    index = $(this).index();
                }
            })
            //改变楼梯按钮的选中状态
            $("#loutiNav li").eq(index).find("span").addClass("active")
                .parent().siblings().find("span").removeClass("active");
        }
    })
}) 