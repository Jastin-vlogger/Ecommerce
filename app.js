let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const mongoose = require("mongoose");
const {verify} = require('./authMiddleWare/auth')
require('dotenv').config()
const bodyParser = require('body-parser')
const nocache = require('nocache')
const twilio = require('twilio');

let adminRouter = require('./routes/admin');
let usersRouter = require('./routes/users');

let app = express();
// let port = process.env.port || 5000;

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

app.get('/error',(req,res)=>{
  res.render('error')
})


app.use('/admin', adminRouter); 
app.use('/',usersRouter);



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


mongoose.connect(process.env.MONGO_URL)

app.listen(process.env.PORT || 5000,console.log("http://localhost:3008"))

module.exports = app;
