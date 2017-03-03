var express = require('express');
var router = express.Router();
var Miguan_data=require('../models/front_data');//数据库中movie表模块

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: '米冠UED' });
});
/*分享页*/
router.get('/share', function(req, res, next) {
    var pageSize = req.query.pageSize ? req.query.pageSize :2, curPage = req.query.page ? req.query.page : 1;
    Miguan_data.find({})
        .sort({'createAt':-1})
        .skip((curPage - 1) * pageSize)
        .limit(pageSize) /*$sort  +  $skip  +  $limit顺序优化*/
        .exec(function (err,datas) {
            if(err){
                console.log(err);
                return false;
            }else{
                Miguan_data.count({},function (err,count) {
                    if (err){
                        console.log(err);
                        return false;
                    }else{
                        var totalPages = Math.ceil(count / pageSize);
                        res.render('share', {
                                    title: '分享',
                                    content_data:datas,
                                    _url: '/share',
                                    perPage: pageSize,
                                    curPage: parseInt(curPage),
                                    totalPages: totalPages,
                                    active:'share'
                                });
                    }
                })
            }   
        });
    



});
/*后台编辑路由*/
router.get('/admin/editor', function (req, res, next) {
    res.render('admin/editor', {cur: 'editor'});
});
/*后台添加数据*/
router.post('/admin/add', function (req, res, next) {
    if (req.body.title == '' || req.body.content == '') {
        res.json({code: -1, msg: '参数错误！'});
        return false;
    }else{
        Miguan_data.create(req.body, function (err) {
            if (err) {
                res.json({code: -1, msg: '数据库错误！'});
                return false;
            }
            console.log(req.body);
            res.json({code: 1, msg: '添加成功！'})
        });
    }
});
/*后台列表*/
router.get('/admin/list', function (req, res, next) {
    var type = req.query.type ? req.query.type : 1;
    var _cur = '';
    if (type == 2) _cur = 'article_sytt';
    res.render('admin/list', {
        cur: _cur
    });
});


module.exports = router;