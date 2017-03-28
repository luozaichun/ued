var express = require('express');
var router = express.Router();
var Miguan_data=require('../models/front_data');//数据库中表模块
var User_data=require('../models/user');//数据库中表模块
var async = require('async');
var Interceptor = require('../interceptor/Interceptor');
var MailService = require('../service/MailService');
/*Params是所有post和get传过来的值的集合;body:需要中间件，一般获取表单,是取post传值;query：从url的？后面的参数取值（get方法）*/
/*后台编辑添加或者更新*/
router.get('/editor',Interceptor.adminRequired,function (req, res, next) {
    var _id=req.query.id,data,post_url;
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
                    status:1,
                    level:req.session.user.level,
                    admin:req.session.user.username,
                    avatar:req.session.user.avatar
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
            status:0,
            level:req.session.user.level,
            admin:req.session.user.username,
            avatar:req.session.user.avatar
        });
    }

});
/*后台新增数据*/
router.post('/add',Interceptor.adminRequired,function (req, res, next) {
    if (req.body.title == '' || req.body.content == '') {
        res.json({code: -1, msg: '参数错误！'});
        return false;
    }else{
        var _admin={admin:req.session.user.username,lastAdmin:req.session.user.username};
        var _data=Object.assign(req.body,_admin);
        Miguan_data.create(_data, function (err) {
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
    var _admin={lastAdmin:req.session.user.username};
    var _data=Object.assign(req.body,_admin);
    Miguan_data.update({_id: req.params.id}, _data, function (err) {
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
            res.json({code: 1, msg: '删除成功！'});
        }
    })
});
/*后台列表*/
router.get('/list',Interceptor.adminRequired,function (req, res, next) {
    var pageSize = req.query.pageSize ? req.query.pageSize :2, curPage = req.query.page ? req.query.page : 1,
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
                            cur:type,
                            level:req.session.user.level,
                            admin:req.session.user.username,
                            avatar:req.session.user.avatar
                        });
                    }
                })
            }
        });
    return false;
});
/*后台新增或编辑管理员*/
router.get('/users/add',Interceptor.adminRequired,function (req, res, next) {
    var _id=req.query.id,data,postuser_url;
    if(_id!=undefined){
        User_data.findOne({_id:_id},function (err,one_data) {
            if (err) {
                console.log(err);
                return false;
            }else{
                data=one_data;
                postuser_url="/admin/users/update/"+_id;
                res.render('admin/administrator', {
                    cur:'addAdmin',
                    data:data,
                    post_url:postuser_url,
                    level:req.session.user.level,
                    status:1,
                    admin:req.session.user.username,
                    avatar:req.session.user.avatar
                });
            }
            
        });
    }
    else{
        data='';
        postuser_url="/admin/users/add";
        res.render('admin/administrator', {
            cur:'addAdmin',
            level:req.session.user.level,
            data:data,
            post_url:postuser_url,
            status:0,
            admin:req.session.user.username,
            avatar:req.session.user.avatar
        });
    }

});
/*后台用户新增数据*/
router.post('/users/add',Interceptor.adminRequired,function (req, res, next) {
    var mailArr=[];
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
            User_data.find({}).exec(function (err,admin_users) {
                if(err){
                    console.log(err);
                    return false;
                }
                async.eachSeries(admin_users, function (item, callback) {
                    mailArr.push(item.mail);
                    callback(err)
                }, function (err) {
                    console.log(err);
                });
                MailService.sendMail(mailArr.join(","), "来自米冠UED的邮件", "新增管理员"+req.body.username+"!",
                    function () {
                        res.json({code: 1, msg: '添加成功！',tip: '邮件发送成功！'})
                    }, function (err) {
                        console.log(err);
                        res.json({code: -1, msg: err});
                    });
            });

        });
    }
});
/*后台管理员列表*/
router.get('/users/list',Interceptor.adminRequired,function (req, res, next) {
    var pageSize = req.query.pageSize ? req.query.pageSize :6, curPage = req.query.page ? req.query.page : 1;
        User_data.find({})
        .sort({_id:-1})
        .skip((curPage - 1) * pageSize)
        .limit(pageSize) /*$sort  +  $skip  +  $limit顺序优化*/
        .exec(function (err,user_list) {
            if(err){
                console.log(err);
                return false;
            }else{
                User_data.count({},function (err,count) {
                    if (err){
                        console.log(err);
                        return false;
                    }else{
                        var totalPages = Math.ceil(count / pageSize);
                        res.render('admin/user_list', {
                            list_datas:user_list,
                            _url: '/admin/users/list',
                            pageSize: pageSize,
                            curPage: parseInt(curPage),
                            totalPages: totalPages,
                            type:"admin",
                            cur:"admin_list",
                            level:req.session.user.level,
                            admin:req.session.user.username,
                            avatar:req.session.user.avatar
                        });
                    }
                })
            }
        });
    return false;
});
/*后台用户编辑数据提交*/
router.post('/users/update/:id',Interceptor.adminRequired,function (req, res, next) {
    User_data.update({_id: req.params.id}, req.body, function (err) {
        if (err) {
            console.log(err);
            res.json({code: -1, msg: '数据库错误！'});
            return false;
        }else{
            req.session.user = null;
            res.json({code: 1, msg: '更新成功！'});
        }
    });
});
/*后台用户删除*/
router.post('/users/remove/:id',Interceptor.adminRequired,function (req, res, next) {
    if(req.params.id==req.session.user._id){
        User_data.remove({_id: req.params.id}, function (err) {
            if (err) {
                res.json({code: -1, msg: '删除失败！'});
                return false;
            }else{
                req.session.user = null;
                res.json({code: 2, msg: '删除成功！'});
            }
        })
    }else{
        User_data.remove({_id: req.params.id}, function (err) {
            if (err) {
                res.json({code: -1, msg: '删除失败！'});
                return false;
            }else{
                res.json({code: 1, msg: '删除成功！'});
            }
        })
    }

});
module.exports = router;