require("./../css/admin.css");
require("./jquery-1.8.3.min.js");
(function () {
    var thumb_img,d;
    $("#j-upload-thumb").on("click",function () {
        d = thumb_img.getDialog("insertimage");
        d.render();
        d.open();
    });
    thumb_img= new UE.ui.Editor();
    thumb_img.render('thumb');
    thumb_img.ready(function(){
        thumb_img.setDisabled();
        thumb_img.hide();
        thumb_img.addListener('beforeInsertImage',function(t, arg){
            $("#thumb").val(arg[0].src);
        });
    });

    /*编辑面板*/
    var ue = UE.getEditor('container', {
        autoHeightEnabled: false,
        initialFrameHeight: 580
    });
    $("#j-submit").on("click",function () {
        var txt = ue.getContent(),img = '', thumb=$("#thumb").val(),video = '', file="",type = $('#type').val(), title =$("#title").val(),author=$("#author").val();
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
                alert('文章内容或标题不能为空！');
                return false;
            }
           
            /*提交*/
            $.post('/admin/add', {title: title, type: type, content: txt, img: img, video: video,file:file,author:author,thumb:thumb}, function (res) {
                alert(res.msg);
                window.location.reload();
            })
    });

})();
