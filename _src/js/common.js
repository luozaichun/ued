require("../css/swiper.min.css");
require("../css/style.css");
require("./jquery-1.8.3.min.js");
require("./swiper.jquery.min.js");
(function () {
    $(document).ready(function(){
        /*首页*/
        var $section1=$("#j-mod-section1");
        $("#j-star-box").addClass('load');
        /*banner*/
        $section1.addClass('load').css("height",$(window).height());
        var section1_swiper = new Swiper('.mod-section1', {
            nextButton: '.mod-section1 .swiper-button-next',
            prevButton: '.mod-section1 .swiper-button-prev',
            parallax: true,
            speed: 1000,
            autoplay : 4000
        });
        $section1.find(".i-tip").addClass("moveIconUp");
        /*首页团队*/
        var team_swiper = new Swiper('.team-swiper', {
            pagination : '.swiper-pagination',
            paginationClickable :true,
            speed: 800,
            autoplay : 5000,
            freeModeMomentumRatio: 0,
            freeModeMomentumVelocityRatio: 0,
            onlyExternal: true
        });
        /*首页导航*/
        $(document).on("scroll",function () {
             if($(this).scrollTop()>30){
                 $("#j-sub-nav").addClass("small-nav")
             }else{
                 $("#j-sub-nav").removeClass("small-nav")
             }
        });
        $("#j-scroll-tip").on("click",function () {
            $('body,html').animate({scrollTop: $(window).height()-60}, 500);
        });
        /*回到顶部*/
        $("#j-go-top").on("click",function () {
            $('body,html').animate({scrollTop: 0}, 500);
        });
        /*点赞*/
        var $praise=$("#j-praise");
        var _id=$praise.attr("data-id");
        var favor=parseInt($praise.find(".praise-txt").text());
        $(".praise-point").toggle(function(){
            favor++;
            console.log(favor)
            $.ajax({
                type:'get',
                url:'/detail/'+_id+'?favor='+favor,
                success:function (result) {
                    if(result.code==1){
                        console.log(result.msg);
                        $praise.addClass("praised").find(".add-num").fadeIn(200).html("<em class='mypraise'>+1</em>");
                        $praise.find(".praise-txt").text(favor);
                        $praise.find(".zan-w").text("已喜欢")
                    }
                }
            });
        },function () {
            favor=favor-1;
            console.log(favor)
            $.ajax({
                type:'get',
                url:'/detail/'+_id+'?favor='+favor,
                success:function (result) {
                    if(result.code==1){
                        console.log(result.msg);
                        $praise.find(".zan-w").text("喜欢");
                        $praise.removeClass("praised").find(".praise-txt").text(favor);
                    }
                }
            });
        });
        /*产品案例及分享*/
        $("#j-section3").find("dd a").each(function (i) {
            if(i!=0&&i!=4&&i!=7){
                $(this).addClass("even")
            }
        });
        /*招聘*/
        $(".join").on("click",function () {
            $(this).parents(".part").find(".mod-dia").fadeIn(300);
        });
        $(".recruit-box .mod-dia .i-close").on("click",function () {
            $(this).parents(".mod-dia").fadeOut(300);
        });
    });

})();