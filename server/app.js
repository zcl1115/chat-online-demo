var createError = require('http-errors');
var express = require('express');
var path = require('path');
var DB_helper = require("./db/DB_helper");


// db_helper
global.db_helper = new DB_helper();
global.db_helper.setAllOffline(); // when server starts all users must be offline


var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var chatRouter = require('./routes/chat');
var SettingRouter = require('./routes/setting');//新写的，共2行，这里是第1行
var friendRouter=require('./routes/friend');

var app = express();
app.use(bodyParser.json());//数据JSON类型
app.use(bodyParser.urlencoded({ extended: false }));//解析post请求数据
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/chat', chatRouter);
app.use('/setting', SettingRouter);//新写的，共2行，这里是第2行
app.use('/friend',friendRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
