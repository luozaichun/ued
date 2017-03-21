require("./jquery-1.8.3.min.js");
require("./jquery.md5.js");
(function () {
    /*上传头像*/
    var avatar,d;
    $("#j-upload-avatar").on("click",function () {
        d = avatar.getDialog("insertimage");
        d.render();
        d.open();
    });
    avatar= new UE.ui.Editor();
    avatar.render('avatar');
    avatar.ready(function(){
        avatar.setDisabled();
        avatar.hide();
        avatar.addListener('beforeInsertImage',function(t, arg){
            $("#avatar").val(arg[0].src);
        });
    });
    
    /*表单验证*/
    $("form input").blur(function () {
        var val=$(this).val(),pass_word=$("form input[name=password]").val();
        if(val==''){
            $(this).parent().find(".from-tip").removeClass("suc").addClass("err").html('<i>*</i>不能为空！');
        }else if(!/[\u4e00-\u9fa5]/.test(val)&&$(this).attr("name")!="mail"){
            if($(this).attr("name")=="username"){
                $(this).parent().find(".from-tip").removeClass("suc").addClass("err").html('<i>*</i>用户名只能是中文字符！');
            }else if($(this).attr("name")=="password"){
                $(this).parent().find(".from-tip").removeClass("suc").addClass("err").html('<i>*</i>密码是字母、数字或下划线！');
            }else if($(this).attr("name")=="confirm-password"){
                $(this).parent().find(".from-tip").removeClass("suc").addClass("err").html('<i>*</i>密码是字母、数字或下划线！');
            }
        }else if($(this).attr("name")=="confirm-password"&&val!=pass_word){
            $(this).parent().find(".from-tip").removeClass("suc").addClass("err").html('<i>*</i>密码输入不一致！');
        }else if(!(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(val))&&$(this).attr("name")=="mail"){
            $(this).parent().find(".from-tip").removeClass("suc").addClass("err").html('<i>*</i>请输入正确的E-Mail地址！');
        }else{
            $(this).parent().find(".from-tip").removeClass("err").addClass("suc").html('<i>*</i>成功！');
        }
    });
    /*提交*/
    $("#j-admin-submit").on("click",function () {
        var username=$("#username").val(),password=$.md5($("#confirm-password").val()),mail=$("#mail").val(),avatar=$("#avatar").val();
        if ($(".from-tip").hasClass("err")) {
            alert('输入不合法');
            return false;
        }
        $.post('/users/add', {username: username, password: password, mail: mail,avatar:avatar}, function (res) {
            alert(res.msg);
            window.location.reload();
        })
    })
})();