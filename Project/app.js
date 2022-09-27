var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
let logger = require('morgan');
const mongoose = require("mongoose");
const {verify} = require('./authMiddleWare/auth')
require('dotenv').config()
const bodyParser = require('body-parser')
const nocache = require('nocache')
const twilio = require('twilio');

var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

var app = express();
let port = process.env.port || 5000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(nocache())
app.use(cookieParser())  
app.use(logger('dev'));
//parsing the incoming data
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use('/static',express.static(path.join(__dirname,'public')))
// app.use(fileUpload())

app.use('/admin', adminRouter); 
app.use('/',usersRouter);

mongoose.connect('mongodb://localhost/userinfo')

app.listen(port,console.log("http://localhost:3008"))

module.exports = app;
