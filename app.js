var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy =require('passport-local').Strategy;
const validationResult  = require('express-validator');
var multer = require('multer');
var moment = require('moment')
var upload = multer({dest:'./uploads'});
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Handle Session
app.use(session({
     secret:'secret',
     saveUninitialized:true,
     resave:true
}));

//Pasport
app.use(passport.initialize());
app.use(passport.session());

//validator

app.use(validationResult({
  errorFormatter:function(param ,msg,value){
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

    while(namespace.length){
      formParam += '[' +namespace.shift() + ']';
    }
    return{
     param : formParam,
     msg   : msg,
     value : value
    };
  }
}));
// connect-flash
app.use(require('connect-flash')());
app.use(function(req,res,next){
res.locals.message = require('express-message')(req,res);
next();
});
app.get('*',function(req, res, next){
res.locals.user = req.user || null;
next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

