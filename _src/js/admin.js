/*管理员页面*/
var Cookies=require("../../cookie/cookie");
require("./jquery-1.8.3.min.js");
require("./jquery.md5.js");
(function () {
    /*表单验证*/
    $("form input").blur(function () {
        var val=$(this).val(),pass_word=$("form input[name=password]").val();
        if(val==''){
            $(this).parent().find(".from-tip").removeClass("suc").addClass("err").html('<i>*</i>不能为空！');
        }else if(!/^[\u4e00-\u9fa5]*$/.test(val)&&$(this).attr("name")=="username"){
            $(this).parent().find(".from-tip").removeClass("suc").addClass("err").html('<i>*</i>用户名只能是中文字符！');
        }else if(!/^[A-Za-z0-9]+$/.test(val)&&($(this).attr("name")=="password"||$(this).attr("name")=="confirm-password")){
            $(this).parent().find(".from-tip").removeClass("suc").addClass("err").html('<i>*</i>密码是字母、数字或下划线！');
        }else if($(this).attr("name")=="confirm-password"&&val!=pass_word){
            $(this).parent().find(".from-tip").removeClass("suc").addClass("err").html('<i>*</i>密码输入不一致！');
        }else if(!(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(val))&&$(this).attr("name")=="mail"){
            $(this).parent().find(".from-tip").removeClass("suc").addClass("err").html('<i>*</i>请输入正确的E-Mail地址！');
        }else{
            $(this).parent().find(".from-tip").removeClass("err").addClass("suc").html('<i>*</i>成功！');
        }
    });
    var _url=$("form").attr("action");
    /*提交*/
    $("#j-admin-submit").on("click",function () {
        var username=$("#username").val(),password=$.md5($("#confirm-password").val()),mail=$("#mail").val(),avatar=$("#avatar").val(),level=1;
        if ($(".from-tip").hasClass("err")||username==''||$("#password").val()==''||mail==''||$("#confirm-password").val()=='') {
            alert('输入不合法');
            return false;
        }else{
            if($("input[name='super-admin']:checkbox:checked").length >0){
                level=2;
            }else{
                level=1;
            }
            $.post(_url, {username: username, password: password, mail: mail,avatar:avatar,level:level}, function (res) {
                alert(res.msg);
                if(res.msg=="更新成功！"){
                    Cookies.deleteCookie(username);
                    location.href = '/users';
                }else{
                    window.location.reload(); 
                }
                
            })  
        }
    });
    /*删除*/
    $(".btn-admin-remove").on("click",function () {
        var _this = $(this);
        var id = _this.attr("data-id"),username = _this.attr("data-username");
        if (confirm("确定删除管理员" + username + "吗？")) {
            $.post('/admin/users/remove/' + id, function (res) {
                if(res.code==2){
                    alert(res.msg);
                    Cookies.deleteCookie(username);
                    location.href = '/users';
                }else{
                    alert(res.msg);
                    Cookies.deleteCookie(username);
                    window.location.reload();
                }
            })
        }
    })
})();