var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
const cookieSession = require('cookie-session');
const passport = require('passport');

var index = require('./routes/index');
const authRoutes = require('./routes/auth-routes');
const svcRoutes = require('./routes/svc-routes');
const keys = require('./config/keys');
const passportSetup = require('./config/passport-setup');

var app = express();


MongoClient.connect(keys.mongodb.dbURI, function (err, db) {
    console.log("Successfully connected to MongoDB.");
    global.db = db;

    // set up session cookies
    app.use(cookieSession({
        maxAge: 24 * 60 * 60 * 1000,
        keys: [keys.session.cookieKey]
    }));


// initialize passport
    app.use(passport.initialize());
    app.use(passport.session());
// view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', index);
    app.use('/auth', authRoutes);
    app.use('/svc', svcRoutes);

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
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
});

module.exports = app;
