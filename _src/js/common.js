require("./../css/style.css");
require("./jquery-1.8.3.min.js");
(function () {
    $(document).ready(function(){
        /*首页*/
        $("#j-star-box").addClass('load');
        
    });
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
    });
    /*点赞*/
    $(".praise-point").on("click",function(){
        var $praise=$("#j-praise");
        var _id=$praise.attr("data-id");
        var favor=parseInt($praise.find(".praise-txt").text());
        console.log(favor);
        $.ajax({
            type:'get',
            url:'/detail/'+_id+'?favor='+favor,
            success:function (result) {
                if(result.code==1){
                   console.log(result.msg);
                    $praise.find(".add-num").fadeIn(200).html("<em class='mypraise'>+1</em>");
                    $praise.find(".praise-txt").text(favor+1);
                }
            }
        });
    });

})();