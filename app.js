var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var db = require("./services/database.js");
var cors = require("cors");
require("dotenv").config();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/brokrUserRouter');
var servicesRouter = require("./routes/servicesUserRouter");
const proxy = require('express-http-proxy');


var port = process.env.PORT || '3000';

require("./services/websocketServer").config();

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
}))



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/services',servicesRouter);


require("./services/expressProxy").config(app).then((newApp) => {
 
  app.listen(port, () => {
    console.log(`Server is up and running`)
  })
})

module.exports = {app}



