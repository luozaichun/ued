require("./../css/admin.css");
require("./jquery-1.8.3.min.js");
require("./jquery.md5.js");
require("./canvas.js");
(function () {
    /*上传头像*/
    var thumb_img,d,_url=$("form").attr("action");
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
    
})();
