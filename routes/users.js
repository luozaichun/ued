var express = require('express');
var router = express.Router();
var User_data=require('../models/user');//数据库中表模块
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('admin/user', {});
});

module.exports = router;