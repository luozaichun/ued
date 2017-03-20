var express = require('express');
var router = express.Router();
var Miguan_data=require('../models/front_data');//数据库中表模块
/*Params是所有post和get传过来的值的集合;body:需要中间件，一般获取表单,是取post传值;query：从url的？后面的参数取值（get方法）*/
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
            .sort({_id:-1})
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
                                pageSize: pageSize,
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
            .sort({_id:-1})
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
                                pageSize: pageSize,
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
    /*获取参数，其中param是express里面对body，query,和路由三种方式的封装；但是要注意弄清楚她拿到的是哪个里面的数据，一般优先级,它会先去查看路由里面的的数据，再查看body里面的，最后再去拿query的。*/
    /*body:需要中间件，一般获取表单；query：从url的？后面的参数取值（get方法）；params，从url中取参数*/
    var now_index,_preurl,_pretitle,_nexturl,_nexttitle,type=req.query.type,favor_num=req.query.favor ? req.query.favor : 'undefined';
    if(favor_num=='undefined'){
        Miguan_data.findOneAndUpdate({_id: req.params.id}, {'$inc': {view: 1}}, function (err, datas) {
            if (err) {
                return false;
            }
            else {
                now_index=datas.index;
                Miguan_data.find({index:{$in:[now_index-1, now_index+1]}}, function (err, data) {
                    if (err) {
                        console.log(err);
                        return false;
                    }
                    else{
                        if(data.length==1&&now_index==0){
                            _preurl="javascript:;";
                            _pretitle="已经是第一篇";
                            _nexturl='/detail/'+data[0]._id+'?type='+data[0].type;
                            _nexttitle=data[0].title;
                        }
                        else if(data.length==1&&now_index!=0){
                            _preurl='/detail/'+data[0]._id+'?type='+data[0].type;
                            _pretitle=data[0].title;
                            _nexturl="javascript:;";
                            _nexttitle="已经是最后一篇"
                        }
                        else if (data.length==0){
                            _preurl=_nexturl="javascript:;";
                            _pretitle="已经是第一篇";
                            _nexttitle="已经是最后一篇"
                        }
                        else if (data.length==2){
                            _preurl='/detail/'+data[0]._id+'?type='+data[0].type;
                            _nexturl='/detail/'+data[1]._id+'?type='+data[1].type;
                            _pretitle=data[0].title;
                            _nexttitle=data[1].title;
                        }
                        Miguan_data.find({_id:{"$ne":req.params.id},type:type}).sort({'_id':-1}).exec(function (err,relate_data) {
                            if(err){
                                console.log(err);
                            }else{
                                res.render('detail', {
                                    content_data:datas,
                                    relate_data:relate_data,
                                    active:'share',
                                    preurl:_preurl,
                                    nexturl:_nexturl,
                                    pretitle:_pretitle,
                                    nexttitle:_nexttitle
                                });  
                            }

                        });
                    }
                });
            }
        });
        
    }
    else{
        Miguan_data.findOneAndUpdate({_id: req.params.id}, {'$inc': {favor: 1}}, function (err) {
        if (err) {
            console.log(err);
            res.json({code: -1, msg: '数据库错误！'});
            return false;
        }
        res.json({code: 1, msg: '更新成功！'})
    });

    }
});

/*后台编辑添加或者更新*/
router.get('/admin/editor', function (req, res, next) {
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
router.post('/admin/add', function (req, res, next) {
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
router.post('/admin/update/:id', function (req, res, next) {
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
router.post('/admin/remove/:id', function (req, res, next) {
    Miguan_data.remove({_id: req.params.id}, function (err) {
        if (err) {
            res.json({code: -1, msg: '删除失败！'});
            return false;
        }
        res.json({code: 1, msg: '删除成功！'});
    })
});

/*后台列表*/
router.get('/admin/list', function (req, res, next) {
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
});

module.exports = router;