var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);//把会话信息存储在数据库
var ueditor = require("ueditor");
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
mongoose.connect('mongodb://localhost/front_miguan');

/*提供会话支持，设置 store 参数为 MongoStore 实例，把会话信息存储到数据库中*/
app.use(session({
  secret: '12345',
  store: new MongoStore({
    url: 'mongodb://localhost/front_miguan',
    collection: 'sessions'
  }),
  resave: false,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.ejs', require('ejs-mate'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/ueditor", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
  var ActionType = req.query.action;
  if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
    var file_url = '/upload/images/';//默认上传地址为图片
    /*其他上传格式的地址*/
    if (ActionType === 'uploadfile') {
      file_url = '/upload/file/'; //附件保存地址
    }
    if (ActionType === 'uploadvideo') {
      file_url = '/upload/video/'; //视频保存地址
    }
    res.ue_up(file_url);
    res.setHeader('Content-Type', 'text/html');
  }
  //客户端发起图片列表请求
  else if (ActionType === 'listimage') {
    var dir_url = '/images/ueditor/';
    res.ue_list(dir_url);  // 客户端会列出 dir_url 目录下的所有图片
  }
  // 客户端发起其它请求
  else {
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/lib/ueditor/nodejs/config.json')
  }
}));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;