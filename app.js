var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ResultMode = require('./util/resultmodel');
var CodeMessage = require('./util/codemessage');

var app = express();
var mongoose = require('./config/mongoose');
var db = mongoose();
var UserRouter = require('./routes/user.route');
var VersionRouter = require('./routes/version.route');
var KeyRouter = require('./routes/key.route');
var StaticsRouter = require('./routes/statics.route');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',UserRouter);
app.use('/version',VersionRouter);
app.use('/key',KeyRouter);
app.use('/statics',StaticsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    var resultMode = new ResultMode();
    resultMode.code  =6;
    resultMode.message = CodeMessage.MSG_6
    return res.json(resultMode);
    // // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};
    //
    // // render the error page
    // res.status(err.status || 500);
    // res.render('error');

});

module.exports = app;
