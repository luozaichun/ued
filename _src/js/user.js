/*登录页*/
var Cookies=require("../../cookie/cookie");
require("./jquery-1.8.3.min.js");
require("./jquery.md5.js");
require("./canvas.js");
(function () {
    $('input[name="username"]').blur(function () {
        var username=$(this).val();
        var _cookie=document.cookie.indexOf(username+"=");
        if(_cookie == -1&&username!=''){
            $.post('/users/login/'+username,function (res) {
                if(res.code===1){
                    if(res.avatar!=''){
                        $("#j-avatar").attr("src",res.avatar);
                        Cookies.setCookie(username,res.avatar,15); 
                    }else{
                        Cookies.setCookie(username, $("#j-avatar").attr("src"),15);
                    }
                }else {
                    $("#j-avatar").attr("src","/images/avatar.jpg");
                    alert(res.message);
                    return false;
                }
            });
        }else if(username!=''){
            $("#j-avatar").attr("src",Cookies.getCookie(username));
        }
    });
    $("#j-login-submit").on("click",function () {
        var username=$("#username").val(),password=$.md5($("#password").val());
        if (username==''||$("#password").val()=='') {
            alert('不能为空');
            return false;
        }else {
            $.post('/users/login',{username:username,password:password},function (res) {
                if(res.code==1){
                    location.href = '/admin/list?type=2';
                }else{
                    location.href = '/users';
                    alert(res.message);
                }
            });
        }
    });
    $("#j-login-form").keydown(function(e){
        var e = e || event,
            keycode = e.which || e.keyCode;
        if (keycode==13) {
            $("#j-login-submit").trigger("click");
        }
    });
})();
