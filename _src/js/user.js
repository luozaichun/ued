require("./jquery-1.8.3.min.js");
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
        if(optionCookie.get($(this).val())=="null"){
            
            optionCookie.set('username',$(this).val(),30);
        }
    });
})();
