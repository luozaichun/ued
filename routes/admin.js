var express = require('express');
var router = express.Router();
var Miguan_data=require('../models/front_data');//数据库中表模块
var User_data=require('../models/user');//数据库中表模块
var Counter=require('../models/counter');//数据库中表模块
var Interceptor = require('../interceptor/Interceptor');
var MailService = require('../service/MailService');
/*Params是所有post和get传过来的值的集合;body:需要中间件，一般获取表单,是取post传值;query：从url的？后面的参数取值（get方法）*/

/*后台编辑添加或者更新*/
router.get('/editor',Interceptor.adminRequired,function (req, res, next) {
    var _id=req.query.id,data,post_url,status;
    if(_id!=undefined){
        Miguan_data.findOne({_id:_id},function (err,one_data) {
            if (err) {
                console.log(err);
                return false;
            }else{
                data=one_data;
                post_url="/admin/update/"+_id;
                res.render('admin/editor', {
                    cur: 'editor',
                    data:data,
                    post_url:post_url,
                    status:1
                });
            }
        });
    }
    else{
        data='';
        post_url="/admin/add";
        res.render('admin/editor', {
            cur: 'editor',
            data:data,
            post_url:post_url,
            status:0
        });
    }

});
/*后台新增数据*/
router.post('/add',Interceptor.adminRequired,function (req, res, next) {
    if (req.body.title == '' || req.body.content == '') {
        res.json({code: -1, msg: '参数错误！'});
        return false;
    }else{
        Miguan_data.create(req.body, function (err) {
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
/*后台更新数据*/
router.post('/update/:id',Interceptor.adminRequired,function (req, res, next) {
    Miguan_data.update({_id: req.params.id}, req.body, function (err) {
        if (err) {
            console.log(err);
            res.json({code: -1, msg: '数据库错误！'});
            return false;
        }
        res.json({code: 1, msg: '更新成功！'})
    });
});
/*后台删除数据*/
router.post('/remove/:id',Interceptor.adminRequired,function (req, res, next) {
    Miguan_data.remove({_id: req.params.id}, function (err) {
        if (err) {
            res.json({code: -1, msg: '删除失败！'});
            return false;
        }else{
            Counter.findOneAndUpdate({_id: "default"}, {$inc: { seq: -1 }}, function(err, _seq) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(_seq);
                    res.json({code: 1, msg: '删除成功！'});
                }

            });
        }

    })
});
/*后台列表*/
router.get('/list',Interceptor.adminRequired,function (req, res, next) {
    var pageSize = req.query.pageSize ? req.query.pageSize :6, curPage = req.query.page ? req.query.page : 1,
        type = req.query.type ? req.query.type : 2;
    Miguan_data.find({type: type})
        .sort({_id:-1})
        .skip((curPage - 1) * pageSize)
        .limit(pageSize) /*$sort  +  $skip  +  $limit顺序优化*/
        .exec(function (err,list_datas) {
            if(err){
                console.log(err);
                return false;
            }else{
                Miguan_data.count({type: type},function (err,count) {
                    if (err){
                        console.log(err);
                        return false;
                    }else{
                        var totalPages = Math.ceil(count / pageSize);
                        res.render('admin/list', {
                            title: '后台内容列表',
                            list_datas:list_datas,
                            _url: '/admin/list',
                            pageSize: pageSize,
                            curPage: parseInt(curPage),
                            totalPages: totalPages,
                            type:type,
                            cur:type
                        });
                    }
                })
            }
        });
    return false;
});
/*后台管理员*/
router.get('/users/add',function (req,res,next) {
    res.render('admin/administrator', {
        cur:'addAdmin'
    });

});
/*后台用户新增数据*/
router.post('/users/add',function (req, res, next) {
    console.log(req.body)
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
    // if (req.body.title == '' || req.body.content == '') {
    //     res.json({code: -1, msg: '参数错误！'});
    //     return false;
    // }else{
    //     User_data.create(req.body, function (err) {
    //         if (err) {
    //             console.log(err);
    //             res.json({code: -1, msg: '数据库错误！'});
    //             return false;
    //         }
    //         // else {
    //         //     User_data.find({})
    //         //         .sort({_id:-1})
    //         //         .exec(function (err,mail) {
    //         //             if(err){
    //         //                 console.log(err);
    //         //                 return false;
    //         //             }else{
    //         //
    //         //                 console.log(mail.mail)
    //         //
    //         //                 // MailService.sendMail(null, "来自"+req.session.user.nickname+"的邮件", req.body.content,
    //         //                 //     function () {
    //         //                 //         console.log(2222);
    //         //                 //         res.json({code: 1, msg: '邮件发送成功！'})
    //         //                 //     }, function (err) {
    //         //                 //         console.log(err);
    //         //                 //         res.json({code: -1, msg: err});
    //         //                 //     })
    //         //             }
    //         //         });
    //         // }
    //         res.json({code: 1, msg: '添加成功！'})
    //     });
    // }

    // if (req.body.title == '' || req.body.content == '') {
    //     res.json({code: -1, msg: '参数错误！'});
    //     return false;
    // }else{
    //     User_data.create(req.body, function (err) {
    //         if (err) {
    //             console.log(err);
    //             res.json({code: -1, msg: '数据库错误！'});
    //             return false;
    //         }else{
    //             // console.log(req.body);
    //             res.json({code: 1, msg: '添加成功！'})
    //             // User_data.find({})
    //             //     .exec(function (err,mail) {
    //             //         if(err){
    //             //             console.log(err);
    //             //             return false;
    //             //         }else{
    //             //             console.log(mail.mail)
    //             //
    //             //             // MailService.sendMail(null, "来自"+req.session.user.nickname+"的邮件", req.body.content,
    //             //             //     function () {
    //             //             //         console.log(2222);
    //             //             //         res.json({code: 1, msg: '邮件发送成功！'})
    //             //             //     }, function (err) {
    //             //             //         console.log(err);
    //             //             //         res.json({code: -1, msg: err});
    //             //             //     })
    //             //         }
    //             //     });
    //         }
    //
    //
    //     });
    // }
});


// router.post('/mail', Interceptor.adminRequiredJson, function (req, res, next) {
//     console.log(111);
//     console.log(req.body.content);
//     if (!req.body.content || req.body.content.length == 0) {
//         res.json({code: -1, msg: '参数错误！'});
//         return false;
//     }
//   
// });

module.exports = router;