require("./../css/admin.css");
require("./jquery-1.8.3.min.js");
(function () {
    $("#j-submit").on("click",function () {
        var txt = ue.getContent(),img = '', thumb=$("#thumb").val(),video = '', file="",type = $('#type').val(), type_name=$("#type").find("option:selected").text(),title =$("#title").val(),author=$("#author").val();
        var _temp=$('#temp').html(txt).find("p");
            _temp.find("img").each(function (i) {
                if(i==0){
                    img=$(this).attr("src");
                }else{
                    img=$(this).attr("src")+","+img;
                }
            });
            _temp.find("embed,video").each(function () {
                $(this).attr({'width':'500','height':'280'});
                video = this.outerHTML;
            });
            _temp.find("a").each(function (i) {
                if(i==0){
                    file = $(this).attr("href");
                }else{
                    file = $(this).attr("href")+","+file;
                }
            });
            /* 文章内容或标题*/
            if ($.trim(txt) == '' || $.trim(title) == '') {
                alert('列表缩略图，文章内容或标题不能为空！');
                return false;
            }
            /*提交*/
            $.post(_url, {title: title, type: type, type_name: type_name,content: txt, img: img, video: video,file:file,author:author,thumb:thumb}, function (res) {
                alert(res.msg);
                window.location.reload();
            })
    });
    /* 删除*/
    $('.btn-remove').on('click', function () {
        var _this = $(this);
        var id = _this.attr("data-id"),title = _this.attr("data-title");
        if (confirm("确定删除" + title + "吗？")) {
            $.post('/admin/remove/' + id, function (res) {
                alert("删除成功");
                console.log(res.msg);
                window.location.reload();
            })
        }
    });
})();
