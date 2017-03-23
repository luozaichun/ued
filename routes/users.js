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
        console.log(user);
        if (err) {
            res.json({code: 0, message:'网络错误，请重试！'});
            return false;
        }
        if (user){
            req.session.user = user;
            User_data.update({username: req.body.username}, {$set:{isadmin : true}}, function (err) {
                if (err) {
                    console.log(err);
                    res.json({code: -1, msg: '数据库更新错误！'});
                    return false;
                }
                res.json({code:1,avatar:user.avatar});
            });

        }else{
            res.json({code:0, message:'用户名或密码错误，请重试'});
            return false;
        }
    });

});


/*后台用户新增数据*/
// router.post('/add', function (req, res, next) {
//     if (req.body.title == '' || req.body.content == '') {
//         res.json({code: -1, msg: '参数错误！'});
//         return false;
//     }else{
//
//         User_data.create(req.body, function (err) {
//             if (err) {
//                 console.log(err);
//                 res.json({code: -1, msg: '数据库错误！'});
//                 return false;
//             }
//             console.log(req.body);
//             res.json({code: 1, msg: '添加成功！'})
//         });
//     }
// });
module.exports = router;