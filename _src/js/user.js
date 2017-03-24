require("./jquery-1.8.3.min.js");
require("./jquery.md5.js");
require("./canvas.js");
(function () {
    /*操作cookie*/
    var optionCookie={
        set:function (c_name, value, expiredays){
            var exdate=new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
        },
        get:function (name)
        { var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
        delete:function (name)
        {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval=getCookie(name);
            if(cval!=null)
                document.cookie= name + "="+cval+";expires="+exp.toGMTString();
        }
    };
    $('input[name="username"]').blur(function () {
        var username=$(this).val();
        var _cookie=document.cookie.indexOf(username);
        if(_cookie == -1&&username!=''){
            $.post('/users/login/'+username,function (res) {
                if(res.code===1){
                    if(res.avatar!=''){
                        console.log(111);
                        $("#j-avatar").attr("src",res.avatar);
                        optionCookie.set(username,res.avatar,15); 
                    }else{
                        console.log(2222);
                        optionCookie.set(username, $("#j-avatar").attr("src"),15);
                    }
                }else {
                    alert(res.message);
                    return false;
                }
            });
        }else if(username!=''){
            $("#j-avatar").attr("src",optionCookie.get(username));
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
                    window.location.reload();
                    alert(res.message);
                }
            });

        }
    })
})();
