var express = require('express');
var router = express.Router();
var Miguan_data=require('../models/front_data');//数据库中movie表模块

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: '米冠UED' });
});
/*分享页*/
router.get('/share', function(req, res, next) {
    var pageSize = req.query.pageSize ? req.query.pageSize :6, curPage = req.query.page ? req.query.page : 1,
    type = req.query.type ? req.query.type : 8;
    if(type==8){
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
                                active:'share',
                                type:type,
                                itemId:type
                            });
                        }
                    })
                }
            });
    }else {
        Miguan_data.find({type: type})
            .sort({'createAt':-1})
            .skip((curPage - 1) * pageSize)
            .limit(pageSize) /*$sort  +  $skip  +  $limit顺序优化*/
            .exec(function (err,datas) {
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
                            res.render('share', {
                                title: '分享',
                                content_data:datas,
                                _url: '/share',
                                perPage: pageSize,
                                curPage: parseInt(curPage),
                                totalPages: totalPages,
                                active:'share',
                                type:type,
                                itemId:type
                            });
                        }
                    })
                }
            });
    }
});
/*详情内容页*/
router.get('/detail/:id', function(req, res, next) {
    /*获取参数,（get方法），其中param是express里面对body，query,和路由三种方式的封装；但是要注意弄清楚她拿到的是哪个里面的数据，一般优先级,它会先去查看路由里面的的数据，再查看body里面的，最后再去拿query的。*/
    /*body:需要中间件，一般获取表单；query：从url的？后面的参数取值；params，从url中取参数*/
    var _classify;
    if(req.query.type==2){
        _classify='视觉设计'
    }else if(req.query.type==3){
        _classify='前端技术'
    } else if(req.query.type==4){
        _classify='团队活动'
    }
    else if(req.query.type==5){
        _classify='用户研究'
    }
    else if(req.query.type==6){
        _classify='交互设计'
    }
    else if(req.query.type==7){
        _classify='闲话杂谈'
    }
  
    Miguan_data.findOneAndUpdate({_id: req.params.id}, {'$inc': {view: 1}}, function (err, datas) {
        if (err) {
            return false;
        }
        res.render('detail', {
            content_data:datas,
            active:'share',
            type:_classify
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