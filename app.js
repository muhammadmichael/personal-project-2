var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var beritaRouter = require('./routes/berita');
var komentarRouter = require('./routes/komentar');

var app = express();

// passport
app.use(passport.initialize());
require('./auth');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/images/uploadedimages', express.static('public/images/uploadedimages'));

// Sync DB
const db = require("./models")
db.sequelize.sync()
.then(() => {
    console.log("sync db")
})
.catch((err) => {
    console.log("error: " + err.message);
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/berita', beritaRouter);
app.use('/komentar', komentarRouter);

module.exports = app;
