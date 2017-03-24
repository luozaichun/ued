var express = require('express');
var router = express.Router();
var User_data=require('../models/user');//数据库中表模块
/* GET users listing. */

router.get('/', function(req, res, next) {
    res.render('admin/user', {});
});
/*登录获取头像*/
router.post('/login/:name', function (req, res, next) {
    User_data.findOne({username:req.params.name}, function (err, user) {
        if (err) {
            res.json({code: 0, message:'网络错误，请重试！'});
            return false;
        }else if(user){
            res.json({code: 1, avatar: user.avatar})  
        }else{
            res.json({code: 0, message:'您还不是管理员！'});
            return false;
        }
    });
});

//登陆
router.post('/login', function (req, res, next) {
    User_data.findOne({username: req.body.username, password: req.body.password}, function (err, user) {
        if (err) {
            res.json({code: 0, message:'网络错误，请重试！'});
            return false;
        }
        if (user){
            req.session.user = user;
            res.json({code:1});
        }else{
            res.json({code:0, message:'用户名或密码错误，请重试'});
            return false;
        }
    });

});


module.exports = router;