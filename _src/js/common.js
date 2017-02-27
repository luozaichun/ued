require("./../css/style.css");
require("./jquery-1.8.3.min.js");
(function () {
    /*导航*/
    var $nav_li= $('#j-nav').find("li");
    $nav_li.parents(".nav").find(".i-line").css("left",$nav_li.find("a.active").parent().position().left+837+"px");
    $nav_li.hover(function(){
        $(this).parents(".nav").find(".i-line").stop().animate({left: $(this).position().left+837+"px"},200);
    },function () {
        $(this).parents(".nav").find(".i-line").stop().animate({left: $nav_li.find("a.active").parent().position().left+837+"px"},200);
    });
    /*回到顶部*/
    $("#j-go-top").on("click",function () {
        $('body,html').animate({scrollTop: 0}, 500);
    })
})();