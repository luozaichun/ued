var express = require('express');
var router = express.Router();
var User_data=require('../models/user');//数据库中表模块
var MailService = require('../service/MailService');
/* GET users listing. */
var adminRequired = function (req, res, next) {
    var user = req.session.user;
    if (!user) {
        res.render('admin/user', {});
        return false;
    }
    next()
};

router.get('/', function(req, res, next) {
    res.render('admin/user', {});
});

//登陆
router.post('/login', function (req, res, next) {
    if (req.body.username == '' || req.body.password == '') {
        res.render('error', {message: '用户名或密码错误，请重试！'});
        return false;
    }
    User_data.findOne({username: req.body.username, password: req.body.password}, function (err, user) {
        if (err) {
            res.render('error', {message: '网络错误，请重试！'});
            return false;
        }
        if (user) {
            req.session.user = user;
            res.redirect('/dmin/list?type=2');
            return false;
        }else{
            res.render('error', {message: '用户名或密码错误，请重试！'});
        }
    });

});


router.get('/add',function (req,res,next) {
    res.render('admin/administrator', {
        cur:'addAdmin'
    });
});

/*后台用户新增数据*/
router.post('/add', function (req, res, next) {
    if (req.body.title == '' || req.body.content == '') {
        res.json({code: -1, msg: '参数错误！'});
        return false;
    }else{
        User_data.create(req.body, function (err) {
            if (err) {
                console.log(err);
                res.json({code: -1, msg: '数据库错误！'});
                return false;
            }
            console.log(req.body);
            res.json({code: 1, msg: '添加成功！'})
        });
    }
});
module.exports = router;