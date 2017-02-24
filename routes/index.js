var express = require('express');
var router = express.Router();
var Miguan_data=require('../models/front_data');//数据库中movie表模块

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: '米冠UED' });
});
/*分享页*/
router.get('/share', function(req, res, next) {
    Miguan_data.fetch(function (error,datas) {
        if(error){
            console.log(error);
        }
        res.render('share', {
            title: '分享',
            content_data:datas
        });
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
    }
    Miguan_data.create(req.body, function (err) {
        if (err) {
            res.json({code: -1, msg: '数据库错误！'});
            return false;
        }
        console.log(req.body);
        res.json({code: 1, msg: '添加成功！'})
    });
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